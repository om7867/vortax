"""
Module 4: Skill Scoring & Normalization Engine
Business Logic Services
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Dict, List
from uuid import UUID
from datetime import datetime

from app.scoring.models import SkillScore, SkillScoreHistory, ConfidenceLevel
from app.scoring.normalization import ScoringEngine
from app.assessments.models import SkillTest, TestQuestion, TestAttempt, TestStatus
from app.skills.models import UserSkillProfile, SkillMaster
from app.audit.services import AuditService

class ScoringService:
    """
    Core service for evaluating tests and managing skill scores.
    """
    
    @staticmethod
    def evaluate_test(db: Session, test_id: UUID, user_id: UUID) -> Dict:
        """
        Evaluate a submitted test and generate skill scores.
        
        This is the main entry point for Module 4.
        Called after test submission (Module 3).
        
        Args:
            db: Database session
            test_id: UUID of the test to evaluate
            user_id: UUID of the user (for security check)
            
        Returns:
            Dictionary with evaluation results
        """
        # 1. Fetch and validate test
        test = db.query(SkillTest).filter(
            SkillTest.id == test_id,
            SkillTest.user_id == user_id
        ).first()
        
        if not test:
            raise HTTPException(status_code=404, detail="Test not found")
        
        if test.status != TestStatus.SUBMITTED:
            raise HTTPException(status_code=400, detail="Test must be submitted before evaluation")
        
        # Check if already evaluated (idempotency)
        existing_scores = db.query(SkillScore).filter(SkillScore.test_id == test_id).count()
        if existing_scores > 0:
            raise HTTPException(status_code=400, detail="Test already evaluated")
        
        # 2. Fetch all questions and attempts
        questions = db.query(TestQuestion).filter(TestQuestion.test_id == test_id).all()
        attempts = db.query(TestAttempt).filter(TestAttempt.test_id == test_id).all()
        
        # Create attempt lookup
        attempt_map = {str(a.question_id): a for a in attempts}
        
        # 3. Group questions by skill
        skill_questions: Dict[UUID, List[TestQuestion]] = {}
        for q in questions:
            if q.skill_id not in skill_questions:
                skill_questions[q.skill_id] = []
            skill_questions[q.skill_id].append(q)
        
        # 4. Calculate scores for each skill
        skill_scores = []
        for skill_id, skill_qs in skill_questions.items():
            # Calculate raw score
            raw_score = 0.0
            difficulties = []
            
            for q in skill_qs:
                difficulties.append(q.difficulty)
                attempt = attempt_map.get(str(q.id))
                
                if attempt:
                    question_score = ScoringEngine.calculate_question_score(
                        is_correct=attempt.is_correct,
                        difficulty=q.difficulty
                    )
                    raw_score += question_score
            
            # Calculate max possible score
            max_score = ScoringEngine.calculate_max_possible_score(difficulties)
            
            # Calculate percentage and normalized score
            score_percentage = ScoringEngine.calculate_score_percentage(raw_score, max_score)
            normalized_score = ScoringEngine.normalize_score(score_percentage)
            confidence_level = ScoringEngine.assign_confidence_level(score_percentage)
            
            # Create SkillScore record
            skill_score = SkillScore(
                user_id=user_id,
                skill_id=skill_id,
                test_id=test_id,
                raw_score=int(raw_score * 100),  # Store as integer (cents)
                max_score=int(max_score * 100),
                score_percentage=score_percentage,
                normalized_score=normalized_score,
                confidence_level=confidence_level,
                difficulty_weighted=True
            )
            db.add(skill_score)
            skill_scores.append(skill_score)
            
            # Create history record
            history = SkillScoreHistory(
                user_id=user_id,
                skill_id=skill_id,
                score_percentage=score_percentage,
                normalized_score=normalized_score,
                confidence_level=confidence_level
            )
            db.add(history)
            
            # Update UserSkillProfile
            user_skill = db.query(UserSkillProfile).filter(
                UserSkillProfile.user_id == user_id,
                UserSkillProfile.skill_id == skill_id
            ).first()
            
            if user_skill:
                user_skill.verified = True
                user_skill.last_assessed_at = datetime.utcnow()
                # Optionally update self_rating
                suggested_rating = ScoringEngine.suggest_skill_rating(score_percentage)
                if suggested_rating > user_skill.self_rating:
                    user_skill.self_rating = suggested_rating
        
        # 5. Update test status
        test.status = TestStatus.EVALUATED
        
        # 6. Commit all changes
        db.commit()
        
        # 7. Audit log
        AuditService.log_action(
            db=db,
            actor_id=user_id,
            action="SKILL_SCORE_EVALUATED",
            entity_type="SkillTest",
            entity_id=test_id,
            metadata={"skill_count": len(skill_scores)}
        )
        
        return {
            "test_id": test_id,
            "skills_evaluated": len(skill_scores),
            "status": "evaluated"
        }
    
    @staticmethod
    def get_user_summary(db: Session, user_id: UUID) -> Dict:
        """
        Get scoring summary for a user (all skills).
        
        Args:
            db: Database session
            user_id: UUID of the user
            
        Returns:
            Summary dictionary with overall score and skill breakdown
        """
        # Fetch all skill scores for user (latest per skill)
        # We need to get the most recent score for each skill
        from sqlalchemy import func
        
        subquery = db.query(
            SkillScore.skill_id,
            func.max(SkillScore.evaluated_at).label('max_date')
        ).filter(
            SkillScore.user_id == user_id
        ).group_by(SkillScore.skill_id).subquery()
        
        scores = db.query(SkillScore).join(
            subquery,
            (SkillScore.skill_id == subquery.c.skill_id) &
            (SkillScore.evaluated_at == subquery.c.max_date)
        ).filter(SkillScore.user_id == user_id).all()
        
        if not scores:
            return {
                "user_id": user_id,
                "overall_score": 0.0,
                "total_skills_assessed": 0,
                "skill_breakdown": []
            }
        
        # Calculate overall score
        normalized_scores = [s.normalized_score for s in scores]
        overall_score = ScoringEngine.calculate_overall_score(normalized_scores)
        
        # Build skill breakdown
        skill_breakdown = []
        for score in scores:
            skill = db.query(SkillMaster).filter(SkillMaster.id == score.skill_id).first()
            skill_breakdown.append({
                "skill_id": score.skill_id,
                "skill_name": skill.name if skill else "Unknown",
                "raw_score": score.raw_score,
                "max_score": score.max_score,
                "score_percentage": score.score_percentage,
                "normalized_score": score.normalized_score,
                "confidence_level": score.confidence_level,
                "evaluated_at": score.evaluated_at
            })
        
        return {
            "user_id": user_id,
            "overall_score": overall_score,
            "total_skills_assessed": len(scores),
            "skill_breakdown": skill_breakdown
        }
    
    @staticmethod
    def get_skill_history(db: Session, user_id: UUID, skill_id: UUID) -> Dict:
        """
        Get historical progression for a specific skill.
        
        Args:
            db: Database session
            user_id: UUID of the user
            skill_id: UUID of the skill
            
        Returns:
            Dictionary with skill history
        """
        history = db.query(SkillScoreHistory).filter(
            SkillScoreHistory.user_id == user_id,
            SkillScoreHistory.skill_id == skill_id
        ).order_by(SkillScoreHistory.recorded_at.asc()).all()
        
        skill = db.query(SkillMaster).filter(SkillMaster.id == skill_id).first()
        
        return {
            "skill_id": skill_id,
            "skill_name": skill.name if skill else "Unknown",
            "history": [
                {
                    "score_percentage": h.score_percentage,
                    "normalized_score": h.normalized_score,
                    "confidence_level": h.confidence_level,
                    "recorded_at": h.recorded_at
                }
                for h in history
            ]
        }
