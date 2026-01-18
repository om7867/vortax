
import os
import sys

# Add current directory to path
sys.path.append(os.getcwd())

from app.core.database import SessionLocal
from app.auth.models import User
from app.gap_analysis.models import SkillGapResult, CareerReadinessSnapshot, Role, GapStatus
from app.profile.models import UserProfile
from app.recommendations.models import TrendingSkill, LearningResource

def diagnose():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == "admin").first()
        if not user:
            print("User admin not found")
            return

        print(f"--- DIAGNOSIS FOR: {user.username} ({user.id}) ---")
        
        profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
        target_role = profile.target_role if profile else "NONE"
        print(f"Target Role in Profile: {target_role}")
        
        role = db.query(Role).filter(Role.name == target_role).first()
        if not role:
            print(f"ERROR: Role '{target_role}' not found in Roles table")
        else:
            print(f"Role ID: {role.id}")

        snapshot = db.query(CareerReadinessSnapshot).filter(CareerReadinessSnapshot.user_id == user.id).order_by(CareerReadinessSnapshot.evaluated_at.desc()).first()
        if snapshot:
            print(f"Latest Snapshot: Readiness={snapshot.readiness_percentage}%, RoleID={snapshot.role_id}")
        else:
            print("ERROR: No CareerReadinessSnapshot found for user")

        gaps = db.query(SkillGapResult).filter(SkillGapResult.user_id == user.id).all()
        print(f"Total SkillGapResults: {len(gaps)}")
        
        missing_count = 0
        improvement_count = 0
        for g in gaps:
            if g.gap_status == GapStatus.MISSING: missing_count += 1
            if g.gap_status == GapStatus.NEEDS_IMPROVEMENT: improvement_count += 1
        
        print(f"Gaps found: {missing_count} MISSING, {improvement_count} NEEDS_IMPROVEMENT")
        
        trending_count = db.query(TrendingSkill).count()
        print(f"TrendingSkills in DB: {trending_count}")
        
        resources_count = db.query(LearningResource).count()
        print(f"LearningResources in DB: {resources_count}")

        # Check for specific skill mismatch if any
        if role:
            from app.gap_analysis.services import GapAnalysisService
            print("\nSimulating GapAnalysisService.get_missing_skills...")
            missing_skills = GapAnalysisService.get_missing_skills(db, user.id)
            print(f"Missing: {len(missing_skills['missing_skills'])}")
            print(f"Needs Imp: {len(missing_skills['needs_improvement_skills'])}")
            
    except Exception as e:
        print(f"DIAGNOSIS FAILED: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    diagnose()
