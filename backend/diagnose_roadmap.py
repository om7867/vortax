
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.auth.models import User
from app.gap_analysis.services import GapAnalysisService
from app.recommendations.services import RecommendationService
from app.gap_analysis.models import SkillGapResult, CareerReadinessSnapshot, Role
from app.profile.models import UserProfile

def diagnose():
    db = SessionLocal()
    user = db.query(User).filter(User.username == "admin").first()
    if not user:
        print("User admin not found")
        return

    print(f"Diagnosing for user: {user.username} (ID: {user.id})")
    
    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    print(f"Target Role: {profile.target_role if profile else 'No Profile'}")
    
    role = db.query(Role).filter(Role.name == profile.target_role).first()
    print(f"Role ID: {role.id if role else 'Role not found'}")
    
    snapshots = db.query(CareerReadinessSnapshot).filter(CareerReadinessSnapshot.user_id == user.id).all()
    print(f"Found {len(snapshots)} snapshots")
    
    gaps = db.query(SkillGapResult).filter(SkillGapResult.user_id == user.id).all()
    print(f"Found {len(gaps)} total skill gap results")
    for g in gaps:
        print(f"  Skill ID: {g.skill_id}, Status: {g.gap_status}, Evaluated At: {g.evaluated_at}")
        
    print("\nCalling GapAnalysisService.get_missing_skills...")
    try:
        missing = GapAnalysisService.get_missing_skills(db, user.id)
        print(f"Missing Skills: {len(missing['missing_skills'])}")
        print(f"Needs Improvement: {len(missing['needs_improvement_skills'])}")
        for s in missing['missing_skills']:
            print(f"  - {s['skill_name']} (ID: {s['skill_id']}, Gap: {s['gap_percentage']}%)")
    except Exception as e:
        print(f"Error in get_missing_skills: {e}")

    print("\nCalling RecommendationService.generate_personalized_roadmap...")
    try:
        roadmap = RecommendationService.generate_personalized_roadmap(db, user.id)
        if "message" in roadmap:
            print(f"Backend Message: {roadmap['message']}")
        else:
            print(f"Roadmap generated with {len(roadmap['roadmap'])} phases")
            for phase in roadmap['roadmap']:
                print(f"  Phase {phase['phase']} ({phase['months']}): {len(phase['recommendations'])} recommendations")
    except Exception as e:
        print(f"Error in generate_personalized_roadmap: {e}")
        import traceback
        traceback.print_exc()

    db.close()

if __name__ == "__main__":
    diagnose()
