from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from datetime import datetime
import uuid

from app.assessments.models import SkillTest, TestQuestion, TestAttempt, SkillTestResult, TestStatus, ConfidenceLevel
from app.assessments.ai_generator import AIGenerator
from app.assessments.schemas import TestSubmission
from app.profile.models import ProfileCompletion, UserProfile
from app.skills.models import UserSkillProfile, SkillMaster
from app.auth.models import User

import logging
logger = logging.getLogger("uvicorn.error")

class AssessmentService:
    @staticmethod
    def start_assessment(db: Session, user_id: str, domain_override: str = None, role_override: str = None):
        # 1. Gating: Check if user has any skills
        user_skills_count = db.query(UserSkillProfile).filter(UserSkillProfile.user_id == user_id).count()
        
        if user_skills_count == 0:
            # Generate Roadmap / Suggestions (No skills = No test, show roadmap)
            profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
            target_domain = profile.domain_interest if profile else "General"
            
            # Fetch top 3 basic skills for this domain
            from sqlalchemy import cast, String
            suggested_skills = db.query(SkillMaster).filter(
                cast(SkillMaster.domain, String).ilike(f"%{target_domain}%")
            ).limit(3).all()
            
            suggestions = [s.name for s in suggested_skills]
            if not suggestions:
                suggestions = ["Communication", "Problem Solving", "Digital Literacy"] # Fallback
                
            raise HTTPException(
                status_code=403, 
                detail={
                    "code": "roadmap_required",
                    "message": "To unlock assessments, you need to add at least one skill to your profile.",
                    "roadmap": suggestions,
                    "target_domain": target_domain
                }
            )

        # 2. Check for active test persistence
        active_test = db.query(SkillTest).filter(
            SkillTest.user_id == user_id,
            SkillTest.status == TestStatus.IN_PROGRESS
        ).first()

        if active_test:
            logger.info(f"DEBUG: Resuming active test {active_test.id}")
            response = {
                "id": active_test.id,
                "status": active_test.status,
                "total_questions": active_test.total_questions,
                "started_at": active_test.started_at,
                "questions": []
            }
            for tq in active_test.questions:
                s_name = tq.skill.name if tq.skill else "Unknown"
                response["questions"].append({
                    "id": tq.id,
                    "skill_name": s_name,
                    "question_text": tq.question_text,
                    "options": tq.options
                })
            return response

        profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        domain = domain_override or (profile.domain_interest if profile else "General")
        target_role = profile.target_role if profile else "General"
        
        # 3. Identify Skills to Test (Top 5 from Inventory)
        user_skills = db.query(UserSkillProfile).filter(
            UserSkillProfile.user_id == user_id
        ).limit(5).all()
        
        if not user_skills:
            raise HTTPException(status_code=400, detail="No skills found in profile. Add skills to start assessment.")
            
        # Prepare skills input for AI
        skills_input = []
        for us in user_skills:
            skill_master = db.query(SkillMaster).filter(SkillMaster.id == us.skill_id).first()
            skills_input.append({
                "id": str(skill_master.id), # UUID to str
                "name": skill_master.name,
                "domain": skill_master.domain,
                "difficulty": us.self_rating
            })
            
        # 4. Generate AI Questions
        logger.info(f"DEBUG: Generating questions for {len(skills_input)} skills...")
        try:
            raw_questions = AIGenerator.generate_test_suite(skills_input)
            logger.info(f"DEBUG: Generated {len(raw_questions)} questions.")
        except Exception as e:
            logger.error(f"DEBUG: AI Generation failed: {e}")
            raise e
        
        # 5. Create SkillTest Record
        try:
            test = SkillTest(
                user_id=user_id,
                domain=domain,
                target_role=target_role,
                status=TestStatus.IN_PROGRESS,
                total_questions=len(raw_questions)
            )
            db.add(test)
            db.flush() # Get ID
            logger.info(f"DEBUG: Created test {test.id}")
            
            # 6. Store Questions
            for i, q in enumerate(raw_questions):
                tq = TestQuestion(
                    test_id=test.id,
                    skill_id=uuid.UUID(q['skill_id']),
                    question_text=q['question_text'],
                    options=q['options'],
                    correct_option_index=q['correct_option_index'],
                    difficulty=q['difficulty'],
                    ai_generated=True
                )
                db.add(tq)
            logger.info("DEBUG: Added questions to session.")
                
            db.commit()
            db.refresh(test)
            
            # Formulate response to avoid lazy loading issues in Pydantic
            # Eager load needed data or build dict
            response = {
                "id": test.id,
                "status": test.status,
                "total_questions": test.total_questions,
                "started_at": test.started_at,
                "questions": []
            }
            
            for tq in test.questions:
                # Access skill name (lazy load triggers here while session is open)
                s_name = tq.skill.name if tq.skill else "Unknown"
                response["questions"].append({
                    "id": tq.id,
                    "skill_name": s_name,
                    "question_text": tq.question_text,
                    "options": tq.options
                })
                
            return response
        except Exception as e:
            logger.error(f"DEBUG: Database storage failed: {e}")
            db.rollback()
            raise e

    @staticmethod
    def submit_assessment(db: Session, user_id: str, submission: TestSubmission):
        logger.info(f"DEBUG: Processing submission for test {submission.test_id} by user {user_id}")
        test = db.query(SkillTest).filter(SkillTest.id == submission.test_id).first()
        if not test:
            logger.error(f"DEBUG: Test {submission.test_id} not found")
            raise HTTPException(status_code=404, detail="Test not found")
            
        # Ensure status is valid for submission
        current_status = test.status
        if hasattr(current_status, 'value'):
            current_status = current_status.value
            
        if current_status not in [TestStatus.IN_PROGRESS.value, TestStatus.CREATED.value, TestStatus.EVALUATED.value]:
             logger.warning(f"DEBUG: Test {test.id} has invalid status {current_status}")
             # We allow EVALUATED just in case of retry
             if current_status != TestStatus.EVALUATED.value:
                raise HTTPException(status_code=400, detail=f"Test cannot be submitted in status: {current_status}")
        
        # Logic: Process Answers
        correct_count = 0
        total_score = 0
        
        # Fetch all questions for this test to optimize
        questions_map = {str(q.id): q for q in test.questions}
        skill_scores = {} # skill_id -> {total: 0, correct: 0}
        
        for answer in submission.answers:
            qid = str(answer.question_id)
            if qid not in questions_map:
                continue
                
            question = questions_map[qid]
            is_correct = (answer.selected_option_index == question.correct_option_index)
            
            # Record Attempt
            attempt = TestAttempt(
                test_id=test.id,
                question_id=question.id,
                selected_option_index=answer.selected_option_index,
                is_correct=is_correct
            )
            db.add(attempt)
            
            # Scoring
            if is_correct:
                correct_count += 1
                total_score += (1 * question.difficulty) # Weighted score
                
            # Aggregation for SkillResult
            sid = str(question.skill_id)
            if sid not in skill_scores:
                skill_scores[sid] = {'total': 0, 'correct': 0}
            skill_scores[sid]['total'] += 1
            if is_correct:
                skill_scores[sid]['correct'] += 1
                
        # Finalize Test
        test.status = TestStatus.EVALUATED
        test.total_score = total_score
        test.submitted_at = datetime.utcnow()
        
        # Generate SkillTestResults
        for sid, stats in skill_scores.items():
            percentage = (stats['correct'] / stats['total']) * 100 if stats['total'] > 0 else 0
            
            conf = ConfidenceLevel.LOW
            if percentage >= 80:
                conf = ConfidenceLevel.HIGH
            elif percentage >= 50:
                conf = ConfidenceLevel.MEDIUM
                
            result = SkillTestResult(
                test_id=test.id,
                user_id=user_id,
                skill_id=uuid.UUID(sid),
                score_percentage=percentage,
                confidence_level=conf
            )
            db.add(result)
            
        # Update User Status
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            user.assessment_completed = True
            user.analysis_viewed = False
            user.latest_assessment_id = test.id
            user.latest_assessment_at = datetime.utcnow()
            
            # Log Audit Action
            from app.audit.services import AuditService
            AuditService.log_action(
                db=db,
                actor_id=user_id,
                action="ASSESSMENT_COMPLETED",
                entity_type="SkillTest",
                entity_id=test.id,
                metadata={"total_score": total_score}
            )
            
        db.commit()
        db.refresh(test)
        
        # Manual response construction
        response = {
            "test_id": test.id,
            "total_score": test.total_score,
            "status": test.status,
            "submitted_at": test.submitted_at,
            "skill_results": []
        }
        
        # We need to re-query results with skill names or use what we have
        # Best to query SkillTestResult with eager load
        results = db.query(SkillTestResult).filter(SkillTestResult.test_id == test.id).all()
        for res in results:
            s_name = res.skill.name if res.skill else "Unknown"
            response["skill_results"].append({
                "skill_id": res.skill_id,
                "skill_name": s_name,
                "score_percentage": res.score_percentage,
                "confidence_level": res.confidence_level
            })
            
        return response
    
    @staticmethod
    def get_result(db: Session, test_id: str):
        test = db.query(SkillTest).filter(SkillTest.id == test_id).first()
        if not test:
            raise HTTPException(status_code=404, detail="Test not found")
            
        # Manual response construction to avoid lazy loading issues
        response = {
            "test_id": test.id,
            "total_score": test.total_score,
            "status": test.status,
            "submitted_at": test.submitted_at,
            "skill_results": []
        }
        
        # We need to re-query results with skill names or use what we have
        results = db.query(SkillTestResult).filter(SkillTestResult.test_id == test.id).all()
        for res in results:
             # Eager load triggered here while session open
            s_name = res.skill.name if res.skill else "Unknown"
            response["skill_results"].append({
                "skill_id": res.skill_id,
                "skill_name": s_name,
                "score_percentage": res.score_percentage,
                "confidence_level": res.confidence_level
            })
            
        return response
