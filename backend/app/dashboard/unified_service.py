"""
Unified Dashboard Service
Orchestrates all modules and provides complete dashboard data
"""
from sqlalchemy.orm import Session
from typing import Dict, Optional
from uuid import UUID
from datetime import datetime, timedelta

from app.scoring.services import ScoringService
from app.gap_analysis.services import GapAnalysisService
from app.profile.models import UserProfile, ProfileCompletion
from app.scoring.models import SkillScore
from app.gap_analysis.models import CareerReadinessSnapshot
from app.skills.models import UserSkillProfile

class UnifiedDashboardService:
    """
    Central hub that orchestrates all modules for complete dashboard
    """
    
    @staticmethod
    def get_complete_dashboard(db: Session, user_id: UUID) -> Dict:
        print(f"DEBUG: Starting get_complete_dashboard for user {user_id}")
        """
        Get all dashboard data in one call
        
        Returns:
        - Profile status
        - Career readiness
        - Skill scores
        - Gap analysis
        - Career scorecard
        - Next steps
        """
        # Get profile
        profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        
        # Get profile completion
        profile_completion = db.query(ProfileCompletion).filter(
            ProfileCompletion.user_id == user_id
        ).first()
        
        completion_percentage = profile_completion.profile_score if profile_completion else 0
        print(f"DEBUG: Profile completion: {completion_percentage}%")
        
        # Get skill count
        skill_count = db.query(UserSkillProfile).filter(UserSkillProfile.user_id == user_id).count()
        
        # Get latest readiness snapshot
        readiness_snapshot = db.query(CareerReadinessSnapshot).filter(
            CareerReadinessSnapshot.user_id == user_id
        ).order_by(CareerReadinessSnapshot.evaluated_at.desc()).first()
        print(f"DEBUG: Readiness snapshot found: {readiness_snapshot is not None}")
        
        # Get user for flags
        from app.auth.models import User
        user = db.query(User).filter(User.id == user_id).first()

        # Fallback Logic for Profile / Readiness (Initial)
        target_role = profile.target_role if profile else None
        readiness_pct = readiness_snapshot.readiness_percentage if readiness_snapshot else 0
        achieved = readiness_snapshot.achieved_skills_count if readiness_snapshot else 0
        partial = readiness_snapshot.partial_skills_count if readiness_snapshot else 0
        missing = readiness_snapshot.missing_skills_count if readiness_snapshot else 0

        # FALLBACK 1: If no V2 profile, try to find a legacy recommendation
        if not target_role:
            from app.models.models import Recommendation as LegacyRecommendation
            best_legacy = db.query(LegacyRecommendation).filter(
                LegacyRecommendation.user_id == user_id
            ).order_by(LegacyRecommendation.match_score.desc()).first()
            
            if best_legacy:
                target_role = best_legacy.career.title if best_legacy.career else "Analyst (Predicted)"
                # If we have no V2 readiness snapshot, fall back to legacy match score
                if readiness_pct == 0:
                    readiness_pct = best_legacy.match_score
                    # Mock counts for legacy fallback
                    achieved = int(readiness_pct / 20) # Simple heuristic
                    missing = 5 - achieved

        # Get scoring summary (if exists)
        try:
            scoring_summary = ScoringService.get_user_summary(db, user_id)
        except Exception:
            scoring_summary = None
        
        # Try to get gap analysis (if exists)
        try:
            gap_summary = GapAnalysisService.get_summary(db, user_id)
        except Exception:
            gap_summary = None
        print(f"DEBUG: Gap summary found: {gap_summary is not None}")
            
        # AUTO-TRIGGER: If we have a target_role but no gap analysis, run it now
        if not gap_summary and target_role and "Predicted" not in target_role and target_role != "Not Set":
            try:
                # Ensure UserProfile exists for evaluate_gap_analysis
                if not profile:
                    profile = UserProfile(
                        user_id=user_id, 
                        target_role=target_role, 
                        full_name=user.full_name or user.username, 
                        education_level="bachelor", 
                        field_of_study="General", 
                        domain_interest=user.target_domain or "Agriculture", 
                        experience_level="beginner"
                    )
                    db.add(profile)
                    db.commit()
                
                print(f"DEBUG: Running auto-analysis...")
                GapAnalysisService.evaluate_gap_analysis(db, user_id)
                print(f"DEBUG: Auto-analysis complete.")
                gap_summary = GapAnalysisService.get_summary(db, user_id)
                
                # Refresh readiness info
                readiness_snapshot = db.query(CareerReadinessSnapshot).filter(
                    CareerReadinessSnapshot.user_id == user_id
                ).order_by(CareerReadinessSnapshot.evaluated_at.desc()).first()
                if readiness_snapshot:
                    readiness_pct = readiness_snapshot.readiness_percentage
                    achieved = readiness_snapshot.achieved_skills_count
                    partial = readiness_snapshot.partial_skills_count
                    missing = readiness_snapshot.missing_skills_count
            except Exception as e:
                print(f"Auto-analysis failed: {str(e)}")
            
        # Get recommendations (Module 6)
        from app.recommendations.services import RecommendationService
        try:
            recommendations_summary = RecommendationService.get_recommendations_summary(db, user_id)
            # If no recs yet, try to generate if gaps exist
            if not any(recommendations_summary.values()) and gap_summary:
                print(f"DEBUG: Generating recommendations...")
                RecommendationService.generate_recommendations(db, user_id)
                print(f"DEBUG: Recommendations generated.")
                recommendations_summary = RecommendationService.get_recommendations_summary(db, user_id)
        except Exception:
            recommendations_summary = {"courses": [], "projects": [], "certifications": []}
            
        # Get job recommendations
        try:
            job_recommendations = RecommendationService.get_job_recommendations(db, user_id)
        except Exception:
            job_recommendations = []
        
        # Calculate career scorecard
        try:
            scorecard = UnifiedDashboardService._calculate_scorecard(
                db, user_id, readiness_snapshot
            )
        except Exception:
            scorecard = {
                "skill_growth": "+0%",
                "matching_jobs": 0,
                "projected_growth": "+0%",
                "talent_pool_rank": "N/A"
            }
        
        # Determine next steps
        try:
            next_steps = UnifiedDashboardService._get_next_steps(
                db, user_id, completion_percentage, skill_count, scoring_summary, gap_summary
            )
        except Exception:
            next_steps = []

        # Build response
        return {
            "profile": {
                "completion_percentage": completion_percentage,
                "target_role": target_role or user.target_domain or "Not Set",
                "domain": profile.domain_interest if profile and profile.domain_interest else (user.target_domain if user else None),
                "total_skills": skill_count
            },
            "readiness": {
                "percentage": int(readiness_pct),
                "achieved_count": achieved,
                "partial_count": partial,
                "missing_count": missing,
                "role": target_role or "Not Set"
            },
            "scoring": scoring_summary,
            "gaps": gap_summary or {
                "skill_gaps": [],
                "role_name": target_role or "Not Set",
                "readiness_percentage": readiness_pct
            },
            "recommendations": recommendations_summary,
            "jobs": job_recommendations,
            "scorecard": scorecard,
            "next_steps": next_steps,
            "analysis_generated": user.analysis_generated if user else False,
            "last_analysis_at": user.last_analysis_at.isoformat() if user and user.last_analysis_at else None,
            "last_updated": datetime.utcnow().isoformat()
        }
    
    @staticmethod
    def _calculate_scorecard(db: Session, user_id: UUID, readiness: CareerReadinessSnapshot) -> dict:
        """Calculate career metrics for the scorecard"""
        from app.recommendations.services import RecommendationService
        # Skill Growth (mock based on score history)
        
        if not readiness:
            return {
                "skill_growth": "+0%",
                "matching_jobs": 0,
                "projected_growth": "+0%",
                "talent_pool_rank": "N/A"
            }
        
        # Get snapshot from 30 days ago
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        old_snapshot = db.query(CareerReadinessSnapshot).filter(
            CareerReadinessSnapshot.user_id == user_id,
            CareerReadinessSnapshot.evaluated_at <= thirty_days_ago
        ).order_by(CareerReadinessSnapshot.evaluated_at.desc()).first()
        
        # Calculate growth
        if old_snapshot:
            growth = readiness.readiness_percentage - old_snapshot.readiness_percentage
        else:
            growth = readiness.readiness_percentage
        
        # Calculate projected growth (based on missing skills)
        missing_count = readiness.missing_skills_count
        projected = min(missing_count * 14, 50)  # Each skill = ~14% boost, cap at 50%
        
        # Estimate matching jobs (simple heuristic)
        readiness_val = readiness.readiness_percentage
        if readiness_val >= 80:
            matching_jobs = 15
        elif readiness_val >= 60:
            matching_jobs = 8
        elif readiness_val >= 40:
            matching_jobs = 3
        else:
            matching_jobs = 0
        
        # Talent pool rank (based on readiness)
        if readiness_val >= 90:
            rank = "Top 1%"
        elif readiness_val >= 75:
            rank = "Top 5%"
        elif readiness_val >= 50:
            rank = "Top 25%"
        else:
            rank = "Bottom 50%"
        
        return {
            "skill_growth": f"+{int(growth)}%" if growth > 0 else f"{int(growth)}%",
            "matching_jobs": matching_jobs,
            "projected_growth": f"+{projected}%",
            "talent_pool_rank": rank
        }
    
    @staticmethod
    def _get_next_steps(db, user_id, completion_percentage, skill_count, scoring, gaps) -> list:
        """Determine next steps for user"""
        steps = []
        
        # Step 1: Complete profile
        if completion_percentage < 70:
            steps.append({
                "action": "complete_profile",
                "title": "Complete Your Profile",
                "description": "Add missing information to unlock full features",
                "priority": "high"
            })
        
        # Step 2: Add skills
        if skill_count < 3:
            steps.append({
                "action": "add_skills",
                "title": f"Add {3 - skill_count} More Skills",
                "description": "Build your skill inventory",
                "priority": "high"
            })
        
        # Step 3: Take assessment
        if not scoring:
            steps.append({
                "action": "take_assessment",
                "title": "Take Skill Assessment",
                "description": "Validate your skills with AI-powered testing",
                "priority": "medium"
            })
        
        # Step 4: Add certifications
        steps.append({
            "action": "add_certifications",
            "title": "Add Certifications",
            "description": "Boost your credibility",
            "priority": "low"
        })
        
        # Step 5: Improve skills (if gaps exist)
        if gaps and gaps.get("missing_skills_count", 0) > 0:
            steps.append({
                "action": "improve_skills",
                "title": "Close Skill Gaps",
                "description": f"Focus on {gaps['missing_skills_count']} missing skills",
                "priority": "high"
            })
        
        return steps[:3]  # Return top 3 steps
