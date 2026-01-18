from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.auth.models import User
from app.profile.models import UserProfile
from app.gap_analysis.models import CareerReadinessSnapshot, SkillGapResult
from app.models.models import Recommendation
import json

def diagnose():
    db = SessionLocal()
    try:
        print("--- Diagnostic Report ---")
        
        # 1. Check Users
        users = db.query(User).all()
        print(f"Total Users: {len(users)}")
        for u in users:
            print(f"User: {u.username} (ID: {u.id})")
            print(f"  Target Domain: {u.target_domain}")
            
            # 2. Check Profile
            profile = db.query(UserProfile).filter(UserProfile.user_id == u.id).first()
            if profile:
                print(f"  Profile found: {profile.full_name}, Target Role: {profile.target_role}")
            else:
                print("  No UserProfile entry found.")
            
            # 3. Check Legacy Recommendations
            recs = db.query(Recommendation).filter(Recommendation.user_id == u.id).all()
            print(f"  Legacy Recommendations: {len(recs)}")
            for r in recs:
                print(f"    - {r.career.title if r.career else 'Unknown'}: {r.match_score}%")
            
            # 4. Check New Snapshots
            snapshots = db.query(CareerReadinessSnapshot).filter(CareerReadinessSnapshot.user_id == u.id).all()
            print(f"  New Readiness Snapshots: {len(snapshots)}")
            
            # 5. Check Skill Scores
            from app.scoring.models import SkillScore
            scores = db.query(SkillScore).filter(SkillScore.user_id == u.id).all()
            print(f"  Skill Scores: {len(scores)}")

        print("--- End of Report ---")
    finally:
        db.close()

if __name__ == "__main__":
    diagnose()
