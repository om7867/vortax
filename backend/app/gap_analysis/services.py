"""
Module 5: Skill Gap Analysis Engine
Business Logic Services
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Dict, List
from uuid import UUID
from datetime import datetime

from app.gap_analysis.models import Role, RoleSkillRequirement, SkillGapResult, CareerReadinessSnapshot, GapStatus
from app.gap_analysis.readiness_calculator import ReadinessCalculator
from app.profile.models import UserProfile
from app.scoring.models import SkillScore
from app.skills.models import SkillMaster
from app.audit.services import AuditService
from app.auth.models import User

class GapAnalysisService:
    """
    Core service for skill gap analysis and career readiness calculation.
    """
    
    @staticmethod
    def evaluate_gap_analysis(db: Session, user_id: UUID) -> Dict:
        """
        Run complete gap analysis for a user.
        
        Steps:
        1. Fetch user's target role
        2. Get all skill requirements for that role
        3. Match with user's skill scores
        4. Calculate gaps and status
        5. Calculate weighted readiness
        6. Persist results
        
        Args:
            db: Database session
            user_id: UUID of the user
            
        Returns:
            Dictionary with analysis results
        """
        # 1. Get user's target role
        profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if not profile or not profile.target_role:
            raise HTTPException(
                status_code=400,
                detail="User must set a target role in their profile before gap analysis"
            )
        
        # Find role by name
        role = db.query(Role).filter(Role.name == profile.target_role).first()
        if not role:
            raise HTTPException(
                status_code=404,
                detail=f"Role '{profile.target_role}' not found in system"
            )
        
        # 2. Get all skill requirements for the role
        requirements = db.query(RoleSkillRequirement).filter(
            RoleSkillRequirement.role_id == role.id
        ).all()
        
        if not requirements:
            raise HTTPException(
                status_code=400,
                detail=f"No skill requirements defined for role '{role.name}'"
            )
        
        # 3. Fetch latest skill scores for user
        # Get most recent score for each skill
        from sqlalchemy import func
        
        subquery = db.query(
            SkillScore.skill_id,
            func.max(SkillScore.evaluated_at).label('max_date')
        ).filter(
            SkillScore.user_id == user_id
        ).group_by(SkillScore.skill_id).subquery()
        
        user_scores = db.query(SkillScore).join(
            subquery,
            (SkillScore.skill_id == subquery.c.skill_id) &
            (SkillScore.evaluated_at == subquery.c.max_date)
        ).filter(SkillScore.user_id == user_id).all()
        
        # Create score lookup
        score_map = {str(s.skill_id): s.score_percentage for s in user_scores}
        
        # 4. Calculate gaps for each required skill
        skill_gaps = []
        gap_statuses = []
        skill_scores_for_readiness = []
        
        for req in requirements:
            user_score = score_map.get(str(req.skill_id), 0.0)
            required_score = req.required_score_percentage
            
            gap_percentage = ReadinessCalculator.calculate_gap(user_score, required_score)
            gap_status = ReadinessCalculator.determine_gap_status(user_score, required_score)
            
            # Create SkillGapResult
            gap_result = SkillGapResult(
                user_id=user_id,
                role_id=role.id,
                skill_id=req.skill_id,
                user_score=user_score,
                required_score=required_score,
                gap_percentage=gap_percentage,
                gap_status=gap_status
            )
            db.add(gap_result)
            skill_gaps.append(gap_result)
            gap_statuses.append(gap_status)
            
            # Collect for readiness calculation
            skill_scores_for_readiness.append((
                user_score,
                required_score,
                req.importance_weight
            ))
        
        # 5. Calculate weighted readiness
        readiness_percentage = ReadinessCalculator.calculate_weighted_readiness(
            skill_scores_for_readiness
        )
        
        # Count by status
        status_counts = ReadinessCalculator.count_by_status(gap_statuses)
        
        # 6. Create CareerReadinessSnapshot
        snapshot = CareerReadinessSnapshot(
            user_id=user_id,
            role_id=role.id,
            readiness_percentage=readiness_percentage,
            achieved_skills_count=status_counts["achieved"],
            partial_skills_count=status_counts["needs_improvement"],
            missing_skills_count=status_counts["missing"]
        )
        db.add(snapshot)
        
        # Update user status
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            user.analysis_generated = True
            user.last_analysis_at = datetime.utcnow()
            user.readiness_percentage = readiness_percentage
        
        # Commit all changes
        db.commit()
        
        # Audit log
        AuditService.log_action(
            db=db,
            actor_id=user_id,
            action="GAP_ANALYSIS_RUN",
            entity_type="CareerReadiness",
            entity_id=snapshot.id,
            metadata={"role_id": str(role.id), "readiness": readiness_percentage}
        )
        
        return {
            "role_id": role.id,
            "role_name": role.name,
            "readiness_percentage": readiness_percentage,
            "skills_analyzed": len(requirements),
            "achieved": status_counts["achieved"],
            "needs_improvement": status_counts["needs_improvement"],
            "missing": status_counts["missing"]
        }
    
    @staticmethod
    def get_summary(db: Session, user_id: UUID) -> Dict:
        """
        Get latest gap analysis summary for user.
        
        Args:
            db: Database session
            user_id: UUID of the user
            
        Returns:
            Summary dictionary with readiness and skill breakdown
        """
        # Get user's target role
        profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if not profile or not profile.target_role:
            raise HTTPException(status_code=400, detail="No target role set")
        
        role = db.query(Role).filter(Role.name == profile.target_role).first()
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")
        
        # Get latest snapshot
        snapshot = db.query(CareerReadinessSnapshot).filter(
            CareerReadinessSnapshot.user_id == user_id,
            CareerReadinessSnapshot.role_id == role.id
        ).order_by(CareerReadinessSnapshot.evaluated_at.desc()).first()
        
        if not snapshot:
            raise HTTPException(status_code=404, detail="No gap analysis found. Run evaluation first.")
        
        # Get latest skill gaps
        gap_results = db.query(SkillGapResult).filter(
            SkillGapResult.user_id == user_id,
            SkillGapResult.role_id == role.id
        ).order_by(SkillGapResult.evaluated_at.desc()).all()
        
        # Get skill names and weights
        skill_gaps = []
        for gap in gap_results[:20]:  # Limit to latest 20
            skill = db.query(SkillMaster).filter(SkillMaster.id == gap.skill_id).first()
            req = db.query(RoleSkillRequirement).filter(
                RoleSkillRequirement.role_id == role.id,
                RoleSkillRequirement.skill_id == gap.skill_id
            ).first()
            
            skill_gaps.append({
                "skill_id": gap.skill_id,
                "skill_name": skill.name if skill else "Unknown",
                "user_score": gap.user_score,
                "required_score": gap.required_score,
                "gap_percentage": gap.gap_percentage,
                "gap_status": gap.gap_status,
                "importance_weight": req.importance_weight if req else 3
            })
        
        return {
            "user_id": user_id,
            "role_id": role.id,
            "role_name": role.name,
            "readiness_percentage": snapshot.readiness_percentage,
            "achieved_skills_count": snapshot.achieved_skills_count,
            "partial_skills_count": snapshot.partial_skills_count,
            "missing_skills_count": snapshot.missing_skills_count,
            "evaluated_at": snapshot.evaluated_at,
            "skill_gaps": skill_gaps
        }
    
    @staticmethod
    def get_radar_data(db: Session, user_id: UUID) -> Dict:
        """
        Get data for radar chart visualization.
        
        Args:
            db: Database session
            user_id: UUID of the user
            
        Returns:
            Radar chart data
        """
        summary = GapAnalysisService.get_summary(db, user_id)
        
        data_points = []
        for gap in summary["skill_gaps"]:
            data_points.append({
                "skill_name": gap["skill_name"],
                "user_score": gap["user_score"],
                "required_score": gap["required_score"],
                "gap_status": gap["gap_status"]
            })
        
        return {
            "role_name": summary["role_name"],
            "data_points": data_points
        }
    
    @staticmethod
    def get_missing_skills(db: Session, user_id: UUID) -> Dict:
        """
        Get skills with gaps (for recommendation engine).
        
        Args:
            db: Database session
            user_id: UUID of the user
            
        Returns:
            Missing and partial skills
        """
        summary = GapAnalysisService.get_summary(db, user_id)
        
        missing_skills = []
        needs_improvement_skills = []
        
        for gap in summary["skill_gaps"]:
            skill_data = {
                "skill_id": gap["skill_id"],
                "skill_name": gap["skill_name"],
                "required_score": gap["required_score"],
                "user_score": gap["user_score"],
                "gap_percentage": gap["gap_percentage"],
                "importance_weight": gap["importance_weight"]
            }
            
            if gap["gap_status"] == GapStatus.MISSING:
                missing_skills.append(skill_data)
            elif gap["gap_status"] == GapStatus.NEEDS_IMPROVEMENT:
                needs_improvement_skills.append(skill_data)
        
        return {
            "role_name": summary["role_name"],
            "missing_skills": missing_skills,
            "needs_improvement_skills": needs_improvement_skills
        }
