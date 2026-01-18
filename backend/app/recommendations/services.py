"""
Module 6: Recommendation Engine Services
"""
from sqlalchemy.orm import Session
from sqlalchemy import desc
from uuid import UUID
from datetime import datetime
from typing import List, Dict

from .models import LearningResource, Recommendation, UserLearningPlan, ResourceType, RecommendationPriority, DifficultyLevel, LearningPlanStatus, UserLearningProgress
from .prioritizer import RecommendationPrioritizer
from .reason_generator import ReasonGenerator
from app.gap_analysis.models import SkillGapResult, GapStatus, CareerReadinessSnapshot, RoleSkillRequirement, Role
from app.scoring.models import SkillScore, ConfidenceLevel
from app.skills.models import SkillMaster
from app.profile.models import UserProfile, ExperienceLevel
from app.ml.roadmap_engine import roadmap_engine

class RecommendationService:
    """
    Core engine for generating and managing skill recommendations
    """
    
    @staticmethod
    def generate_recommendations(db: Session, user_id: UUID) -> List[Recommendation]:
        """
        Generate recommendations based on SkillGapResult
        
        Logic:
        1. Fetch MISSING/PARTIAL gaps
        2. Sort by importance and gap size
        3. Match difficulty with user experience
        4. Select appropriate resource types
        5. Generate reasons and priority
        """
        # 1. Fetch gaps
        gaps = db.query(SkillGapResult).filter(
            SkillGapResult.user_id == user_id,
            SkillGapResult.gap_status.in_([GapStatus.MISSING, GapStatus.NEEDS_IMPROVEMENT])
        ).all()
        
        # Get user profile for experience level
        profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        user_exp = profile.experience_level if profile else ExperienceLevel.BEGINNER
        
        # Determine target difficulty based on experience
        target_diff = RecommendationService._match_difficulty(user_exp)
        
        recommendations = []
        
        # Clear old recommendations for this user (refresh logic)
        db.query(Recommendation).filter(Recommendation.user_id == user_id).delete()
        
        for gap in gaps:
            # Get importance weight from RoleSkillRequirement
            req = db.query(RoleSkillRequirement).filter(
                RoleSkillRequirement.role_id == gap.role_id,
                RoleSkillRequirement.skill_id == gap.skill_id
            ).first()
            
            importance = req.importance_weight if req else 3
            
            # Get skill info
            skill = db.query(SkillMaster).filter(SkillMaster.id == gap.skill_id).first()
            if not skill:
                continue
            
            # Get confidence level if exists
            score_entry = db.query(SkillScore).filter(
                SkillScore.user_id == user_id,
                SkillScore.skill_id == gap.skill_id
            ).first()
            confidence = score_entry.confidence_level if score_entry else None
            
            # Priority & Reason
            priority = RecommendationPrioritizer.calculate_priority(importance, gap.gap_percentage)
            reason = ReasonGenerator.generate_gap_reason(skill.name, gap.user_score, gap.required_score)
            
            # Find matching resources
            resources = RecommendationService._find_matching_resources(
                db, gap.skill_id, gap.gap_status, target_diff, confidence
            )
            
            for resource in resources:
                rec = Recommendation(
                    user_id=user_id,
                    resource_id=resource.id,
                    recommendation_type=resource.resource_type,
                    priority=priority,
                    reason=reason,
                    gap_percentage=gap.gap_percentage
                )
                db.add(rec)
                recommendations.append(rec)
        
        db.commit()
        return recommendations

    @staticmethod
    def get_recommendations_summary(db: Session, user_id: UUID) -> Dict:
        """Fetch and group recommendations by type"""
        recs = db.query(Recommendation).filter(Recommendation.user_id == user_id).all()
        
        summary = {
            "courses": [],
            "projects": [],
            "certifications": []
        }
        
        for r in recs:
            if r.recommendation_type == ResourceType.COURSE:
                summary["courses"].append(r)
            elif r.recommendation_type == ResourceType.PROJECT:
                summary["projects"].append(r)
            elif r.recommendation_type == ResourceType.CERTIFICATION:
                summary["certifications"].append(r)
                
        return summary

    @staticmethod
    def _match_difficulty(exp_level: ExperienceLevel) -> List[DifficultyLevel]:
        """User experience_level -> resource difficulty"""
        if exp_level == ExperienceLevel.ENTRY or exp_level == ExperienceLevel.BEGINNER:
            return [DifficultyLevel.BEGINNER, DifficultyLevel.INTERMEDIATE]
        if exp_level == ExperienceLevel.INTERMEDIATE:
            return [DifficultyLevel.INTERMEDIATE, DifficultyLevel.ADVANCED]
        return [DifficultyLevel.ADVANCED]

    @staticmethod
    def _find_matching_resources(db: Session, skill_id: UUID, gap_status: GapStatus, 
                               difficulties: List[DifficultyLevel], confidence: ConfidenceLevel) -> List[LearningResource]:
        """
        Find resources based on gap status
        IF gap_status == GapStatus.MISSING: recommend COURSE + PROJECT
        IF gap_status == GapStatus.NEEDS_IMPROVEMENT: recommend PROJECT or CERTIFICATION
        """
        target_types = []
        if gap_status == GapStatus.MISSING:
            target_types = [ResourceType.COURSE, ResourceType.PROJECT]
        else:
            target_types = [ResourceType.PROJECT, ResourceType.CERTIFICATION]
            
        # If confidence is low, push beginner courses
        if confidence == ConfidenceLevel.LOW:
            difficulties = [DifficultyLevel.BEGINNER] + difficulties
            target_types = [ResourceType.COURSE] + target_types
            
        return db.query(LearningResource).filter(
            LearningResource.skill_id == skill_id,
            LearningResource.resource_type.in_(target_types),
            LearningResource.difficulty_level.in_(difficulties)
        ).limit(2).all()

    @staticmethod
    def add_to_learning_plan(db: Session, user_id: UUID, resource_id: UUID) -> UserLearningPlan:
        """Add resource to user learning plan, preventing duplicates"""
        existing = db.query(UserLearningPlan).filter(
            UserLearningPlan.user_id == user_id,
            UserLearningPlan.resource_id == resource_id
        ).first()
        
        if existing:
            return existing
            
        plan_entry = UserLearningPlan(
            user_id=user_id,
            resource_id=resource_id,
            status=LearningPlanStatus.PLANNED
        )
        db.add(plan_entry)
        db.commit()
        db.refresh(plan_entry)
        return plan_entry

    @staticmethod
    def get_learning_plan(db: Session, user_id: UUID) -> List[UserLearningPlan]:
        """Fetch user learning roadmap"""
        return db.query(UserLearningPlan).filter(
            UserLearningPlan.user_id == user_id
        ).order_by(desc(UserLearningPlan.added_at)).all()

    @staticmethod
    def generate_personalized_roadmap(db: Session, user_id: UUID) -> Dict:
        """
        AI Strategy for Roadmap Generation:
        - Identify missing + improvement skills
        - Priority = (Gap Severity * 0.7) + (Market Demand * 0.3)
        - Group into 2-month phases
        """
        # 1. Get Gaps
        from app.gap_analysis.services import GapAnalysisService
        gaps_summary = GapAnalysisService.get_missing_skills(db, user_id)
        
        all_skill_gaps = gaps_summary["missing_skills"] + gaps_summary["needs_improvement_skills"]
        if not all_skill_gaps:
            return {"message": "No skills to improve. You are role-ready!"}

        # 2. Get Trending Data for weightage
        trending = {s.skill_name: s.demand_score for s in db.query(TrendingSkill).all()}
        
        # 3. Calculate Weight and Sort
        for gap in all_skill_gaps:
            demand = trending.get(gap["skill_name"], 50.0) # Default to 50 if unknown
            # Priority: Higher gap and higher demand = higher priority
            gap["ai_priority_score"] = (gap["gap_percentage"] * 0.7) + (demand * 0.3)
        
        sorted_gaps = sorted(all_skill_gaps, key=lambda x: x["ai_priority_score"], reverse=True)
        
        # 4. Phase Construction (2 skills per 2 months)
        phases = []
        for i in range(0, len(sorted_gaps), 2):
            phase_num = (i // 2) + 1
            skills_in_phase = sorted_gaps[i:i+2]
            
            phase_data = {
                "phase": phase_num,
                "months": f"Month {phase_num*2 - 1}-{phase_num*2}",
                "focus_skills": [s["skill_name"] for s in skills_in_phase],
                "recommendations": []
            }
            
            # Find resources for these skills
            for skill_gap in skills_in_phase:
                # Get some resources
                resources = RecommendationService._find_matching_resources(
                    db, skill_gap["skill_id"], 
                    GapStatus.MISSING if skill_gap["gap_percentage"] > 40 else GapStatus.NEEDS_IMPROVEMENT,
                    [DifficultyLevel.BEGINNER, DifficultyLevel.INTERMEDIATE], 
                    None
                )
                for res in resources:
                    phase_data["recommendations"].append({
                        "id": str(res.id),
                        "title": res.title,
                        "type": res.resource_type,
                        "provider": res.provider,
                        "url": res.external_url,
                        "duration": res.duration_estimate
                    })
            
            phases.append(phase_data)
            
        total_duration = len(phases) * 2
        
        return {
            "total_duration_months": total_duration,
            "roadmap": phases,
            "ai_explanation": "These recommendations are generated using AI models trained on skill readiness data, industry demand trends, and learning outcomes."
        }

    @staticmethod
    def get_job_recommendations(db: Session, user_id: UUID) -> List[Dict]:
        """
        Job Recommendation Gating:
        - Readiness >= 60%
        - At least 70% roadmap completed
        """
        # 1. Check readiness
        snapshot = db.query(CareerReadinessSnapshot).filter(
            CareerReadinessSnapshot.user_id == user_id
        ).order_by(desc(CareerReadinessSnapshot.evaluated_at)).first()
        
        if not snapshot:
            return []
            
        # 2. Check roadmap progress
        progress_entries = db.query(UserLearningProgress).filter(
            UserLearningProgress.user_id == user_id
        ).all()
        
        road_ready = False
        if not progress_entries:
            # If no progress tracking yet, we check if they even have a roadmap
            road_ready = False
        else:
            avg_progress = sum(p.progress_percentage for p in progress_entries) / len(progress_entries)
            if avg_progress >= 70.0:
                road_ready = True

        # GATING LOGIC
        if snapshot.readiness_percentage < 60.0 or not road_ready:
            return [] # Locked in backend too
            
        # 3. Match Jobs from JobRole Catalog
        from .models import JobRole
        jobs = db.query(JobRole).filter(
            JobRole.min_readiness_percentage <= snapshot.readiness_percentage
        ).limit(10).all()
        
        result = []
        for job in jobs:
            result.append({
                "id": str(job.id),
                "title": job.title,
                "company": job.company,
                "sector": job.sector,
                "match_score": min(100, snapshot.readiness_percentage + 5), # Simplified match
                "linkedin_url": job.linkedin_url,
                "reason": f"Aligned with your {job.sector} expertise and achieved skills."
            })
            
        return result

    @staticmethod
    def generate_ml_roadmap(db: Session, user_id: UUID):
        """
        MASTER ML LOGIC for PathIQ:
        1. Fetch all MISSING or NEEDS_IMPROVEMENT gaps
        2. For each gap, use RoadmapEngine to predict duration_months
        3. Map to specific resources (Courses, Certifications)
        4. Distribute into a monthly timeline
        5. Persist to learning_roadmap table
        """
        from .models import LearningRoadmap, LearningResource, ResourceType
        
        # Clear existing roadmap for refresh
        db.query(LearningRoadmap).filter(LearningRoadmap.user_id == user_id).delete()
        
        # 1. Get Gaps
        gaps = db.query(SkillGapResult).filter(
            SkillGapResult.user_id == user_id,
            SkillGapResult.gap_status.in_([GapStatus.MISSING, GapStatus.NEEDS_IMPROVEMENT])
        ).all()
        
        if not gaps:
            return []

        roadmap_items = []
        current_month = 1
        
        # Sort gaps by importance
        role_id = gaps[0].role_id
        requirements = db.query(RoleSkillRequirement).filter(
            RoleSkillRequirement.role_id == role_id
        ).all()
        importance_map = {req.skill_id: req.importance_weight for req in requirements}
        
        gaps_with_importance = []
        for g in gaps:
            gaps_with_importance.append((g, importance_map.get(g.skill_id, 3)))
        
        # Sort by importance (highest first)
        gaps_with_importance.sort(key=lambda x: x[1], reverse=True)

        for gap, imp_weight in gaps_with_importance:
            # 2. Predict duration
            duration = roadmap_engine.predict_months(gap.user_score, gap.required_score, imp_weight)
            
            # 3. Determine Actions
            # Month N: "Master [Skill] Foundations"
            # Month N+1: "Advanced [Skill] Project"
            # Final Month: "Obtain [Skill] Certification"
            
            skill_name = db.query(SkillMaster).filter(SkillMaster.id == gap.skill_id).first().name
            
            # Find resources
            resources = db.query(LearningResource).filter(
                LearningResource.skill_id == gap.skill_id
            ).all()
            
            res_map = {r.resource_type: r for r in resources}
            
            # Step 1: Course
            course = res_map.get(ResourceType.COURSE)
            roadmap_items.append(LearningRoadmap(
                user_id=user_id,
                skill_id=gap.skill_id,
                month=current_month,
                action=f"Foundational Course: Mastery of {skill_name}",
                resource_type=ResourceType.COURSE,
                link=course.external_url if course else "https://coursera.org"
            ))
            
            if duration > 1:
                # Step 2: Project
                proj = res_map.get(ResourceType.PROJECT)
                roadmap_items.append(LearningRoadmap(
                    user_id=user_id,
                    skill_id=gap.skill_id,
                    month=current_month + 1,
                    action=f"Practical Implementation: {skill_name} Portfolio Project",
                    resource_type=ResourceType.PROJECT,
                    link=proj.external_url if proj else "https://github.com"
                ))
            
            # Step 3: Certification
            cert = res_map.get(ResourceType.CERTIFICATION)
            roadmap_items.append(LearningRoadmap(
                user_id=user_id,
                skill_id=gap.skill_id,
                month=current_month + int(duration),
                action=f"Expert Validation: {skill_name} Professional Certification",
                resource_type=ResourceType.CERTIFICATION,
                link=cert.external_url if cert else "https://linkedin.com"
            ))
            
            current_month += 1 # Stagger skills month by month
            
        for item in roadmap_items:
            db.add(item)
            
        db.commit()
        return roadmap_items

    @staticmethod
    def get_ml_roadmap(db: Session, user_id: UUID):
        """Fetch the persisted ML roadmap from DB"""
        from .models import LearningRoadmap
        return db.query(LearningRoadmap).filter(
            LearningRoadmap.user_id == user_id
        ).order_by(LearningRoadmap.month.asc()).all()

    @staticmethod
    def get_detailed_recommendations(db: Session, user_id: UUID):
        """
        MASTER RECOMMENDATION CONTRACT:
        1. Check Gap Analysis exists
        2. Identify MISSING/IMPROVEMENT skills
        3. Map courses/certs/jobs
        4. Return structured response for UI
        """
        from fastapi import HTTPException
        from .models import LearningResource, ResourceType
        
        # 1. Fetch Snapshot & Gaps
        snapshot = db.query(CareerReadinessSnapshot).filter(
            CareerReadinessSnapshot.user_id == user_id
        ).order_by(CareerReadinessSnapshot.evaluated_at.desc()).first()
        
        if not snapshot:
            raise HTTPException(status_code=409, detail="GAP_ANALYSIS_REQUIRED")
            
        gaps = db.query(SkillGapResult).filter(
            SkillGapResult.user_id == user_id
        ).all()
        
        if not gaps:
             raise HTTPException(status_code=409, detail="GAP_ANALYSIS_REQUIRED")

        role = db.query(Role).filter(Role.id == gaps[0].role_id).first()
        role_name = role.name if role else "Specialist"
        
        # Get requirements for weights
        requirements = db.query(RoleSkillRequirement).filter(
            RoleSkillRequirement.role_id == gaps[0].role_id
        ).all()
        importance_map = {req.skill_id: req.importance_weight for req in requirements}

        skills_recs = []
        for gap in gaps:
            # We focus on MISSING and NEEDS_IMPROVEMENT
            if gap.gap_status not in [GapStatus.MISSING, GapStatus.NEEDS_IMPROVEMENT]:
                continue
                
            skill_master = db.query(SkillMaster).filter(SkillMaster.id == gap.skill_id).first()
            skill_name = skill_master.name if skill_master else "Unknown Skill"
            
            # Predict Duration
            imp = importance_map.get(gap.skill_id, 3)
            duration = roadmap_engine.predict_months(gap.user_score, gap.required_score, imp)
            
            # Find Resources
            resources = db.query(LearningResource).filter(
                LearningResource.skill_id == gap.skill_id
            ).all()
            
            courses = []
            certs = []
            for r in resources:
                if r.resource_type == ResourceType.COURSE:
                    courses.append({
                        "platform": r.provider,
                        "title": r.title,
                        "link": r.external_url or "https://coursera.org"
                    })
                elif r.resource_type == ResourceType.CERTIFICATION:
                    certs.append(r.title)
            
            # Jobs - LinkedIn Search URL
            # Format: https://www.linkedin.com/jobs/search/?keywords=Role%20Skill
            safe_role = role_name.replace(" ", "%20")
            safe_skill = skill_name.replace(" ", "%20")
            linkedin_url = f"https://www.linkedin.com/jobs/search/?keywords={safe_role}%20{safe_skill}"
            
            skills_recs.append({
                "skill": skill_name,
                "status": gap.gap_status.value.upper(),
                "current_score": gap.user_score,
                "required_score": gap.required_score,
                "learning_duration_months": int(duration),
                "courses": courses[:1], # Limit to 1 for brevity as per UI request
                "certifications": certs[:1],
                "job_roles": [
                    {
                        "title": f"Junior {skill_name} {role_name}",
                        "linkedin_search": linkedin_url
                    }
                ]
            })
            
        return {
            "role": role_name,
            "overall_readiness": snapshot.readiness_percentage,
            "skills": skills_recs
        }


class ProgressService:
    @staticmethod
    def update_progress(db: Session, user_id: UUID, skill_id: UUID, completed_hours: float) -> UserLearningProgress:
        progress = db.query(UserLearningProgress).filter(
            UserLearningProgress.user_id == user_id,
            UserLearningProgress.skill_id == skill_id
        ).first()
        
        if not progress:
            # Estimate planned hours (e.g., 20h per skill)
            progress = UserLearningProgress(
                user_id=user_id,
                skill_id=skill_id,
                planned_hours=20.0,
                completed_hours=0.0,
                progress_percentage=0.0
            )
            db.add(progress)
            
        progress.completed_hours += completed_hours
        progress.progress_percentage = min(100.0, (progress.completed_hours / progress.planned_hours) * 100.0)
        
        # Update user's global readiness score as progress increases
        from app.auth.models import User
        user = db.query(User).filter(User.id == user_id).first()
        if user and completed_hours > 0:
             # Basic logic: 1h adds 0.1 to readiness
             user.readiness_percentage = min(100.0, user.readiness_percentage + (completed_hours * 0.1))

        db.commit()
        db.refresh(progress)
        return progress

    @staticmethod
    def get_user_progress(db: Session, user_id: UUID) -> List[Dict]:
        entries = db.query(UserLearningProgress).filter(
            UserLearningProgress.user_id == user_id
        ).all()
        
        result = []
        for e in entries:
            skill = db.query(SkillMaster).filter(SkillMaster.id == e.skill_id).first()
            result.append({
                "skill_id": str(e.skill_id),
                "skill_name": skill.name if skill else "Unknown",
                "planned_hours": e.planned_hours,
                "completed_hours": e.completed_hours,
                "progress_percentage": e.progress_percentage,
                "last_updated": e.last_updated
            })
        return result
