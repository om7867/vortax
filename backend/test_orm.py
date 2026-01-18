from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.profile.models import UserProfile, ProfileCompletion
from app.skills.models import UserSkillProfile, SkillMaster
from app.certifications.models import CertificationRecord
from app.auth.models import User
import os
from dotenv import load_dotenv

def test_query():
    load_dotenv()
    db_url = os.getenv("DATABASE_URL")
    if db_url.startswith("postgresql+psycopg2://"):
        db_url = db_url.replace("postgresql+psycopg2://", "postgresql://")
    
    engine = create_engine(db_url)
    Session = sessionmaker(bind=engine)
    db = Session()
    
    try:
        # 1. Get a user
        user = db.query(User).filter(User.username == "OM11dada").first()
        if not user:
            print("User OM11dada not found")
            return
        
        print(f"Testing for user: {user.username} ({user.id})")

        # Reset Password
        from app.core.security import get_password_hash
        user.hashed_password = get_password_hash("NewPassword123!")
        db.commit()
        print("Password reset to 'NewPassword123!'")
        return
        
        # Trigger calculate_score logic which failed before
        print("Calculating score...")
        from app.profile.completion_engine import ProfileCompletionService
        completion = ProfileCompletionService.calculate_score(db, str(user.id))
        print(f"Completion calculation successful: Score {completion.profile_score}")
        
        # 2. Test UserProfile
        print("Querying UserProfile...")
        profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
        print(f"Profile found: {profile.full_name if profile else 'None'}")
        
        # 3. Test Skills
        print("Querying Skills...")
        skills = db.query(UserSkillProfile).filter(UserSkillProfile.user_id == user.id).all()
        print(f"Skills found: {len(skills)}")
        
        # 4. Test Certs
        print("Querying Certs...")
        certs = db.query(CertificationRecord).filter(CertificationRecord.user_id == user.id).all()
        print(f"Certs found: {len(certs)}")
        
        # 5. Test Completion
        print("Querying Completion...")
        completion = db.query(ProfileCompletion).filter(ProfileCompletion.user_id == user.id).first()
        print(f"Completion record: {completion.profile_score if completion else 'None'}, Last Updated: {completion.last_updated if completion else 'None'}")
        
        print("SUCCESS: All queries worked.")
    except Exception as e:
        print(f"FAILURE during query: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_query()
