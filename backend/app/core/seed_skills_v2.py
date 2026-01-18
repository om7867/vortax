from app.core.database import SessionLocal
from app.skills.models import SkillMaster, SkillDomain, SkillCategory, UserSkillProfile
from app.auth.models import User, LoginHistory
from app.profile.models import UserProfile, ProfileCompletion
from app.certifications.models import CertificationRecord
from app.audit.models import ProfileAuditLog
import uuid

def seed_skills():
    db = SessionLocal()
    try:
        # Check if skills already exist
        if db.query(SkillMaster).count() > 0:
            print("Skills master already has data. Skipping seed.")
            return

        skills = [
            # Agriculture
            {"name": "Soil Science", "domain": SkillDomain.AGRICULTURE, "category": SkillCategory.TECHNICAL, "difficulty": 3},
            {"name": "Crop Rotation", "domain": SkillDomain.AGRICULTURE, "category": SkillCategory.TECHNICAL, "difficulty": 2},
            {"name": "Pest Management", "domain": SkillDomain.AGRICULTURE, "category": SkillCategory.TECHNICAL, "difficulty": 4},
            {"name": "Irrigation Design", "domain": SkillDomain.AGRICULTURE, "category": SkillCategory.TECHNICAL, "difficulty": 4},
            {"name": "Precision Farming", "domain": SkillDomain.AGRICULTURE, "category": SkillCategory.TECHNICAL, "difficulty": 5},
            
            # Healthcare
            {"name": "Patient Diagnosis", "domain": SkillDomain.HEALTHCARE, "category": SkillCategory.TECHNICAL, "difficulty": 4},
            {"name": "Medical Data Analysis", "domain": SkillDomain.HEALTHCARE, "category": SkillCategory.ANALYTICAL, "difficulty": 4},
            {"name": "Emergency Care", "domain": SkillDomain.HEALTHCARE, "category": SkillCategory.TECHNICAL, "difficulty": 5},
            {"name": "Hospital Management", "domain": SkillDomain.HEALTHCARE, "category": SkillCategory.SOFT, "difficulty": 3},
            
            # Technology
            {"name": "Python Development", "domain": SkillDomain.TECHNOLOGY, "category": SkillCategory.TECHNICAL, "difficulty": 3},
            {"name": "Machine Learning", "domain": SkillDomain.TECHNOLOGY, "category": SkillCategory.TECHNICAL, "difficulty": 5},
            {"name": "SQL Databases", "domain": SkillDomain.TECHNOLOGY, "category": SkillCategory.TECHNICAL, "difficulty": 3},
            {"name": "Cloud Computing", "domain": SkillDomain.TECHNOLOGY, "category": SkillCategory.TECHNICAL, "difficulty": 4},
            
            # Common
            {"name": "Project Management", "domain": SkillDomain.COMMON, "category": SkillCategory.SOFT, "difficulty": 3},
            {"name": "Data Analysis", "domain": SkillDomain.COMMON, "category": SkillCategory.ANALYTICAL, "difficulty": 3},
            {"name": "Critical Thinking", "domain": SkillDomain.COMMON, "category": SkillCategory.ANALYTICAL, "difficulty": 4},
            {"name": "Communication", "domain": SkillDomain.COMMON, "category": SkillCategory.SOFT, "difficulty": 2},
        ]
        
        for s in skills:
            skill = SkillMaster(
                name=s["name"],
                domain=s["domain"],
                category=s["category"],
                difficulty_level=s["difficulty"]
            )
            db.add(skill)
        
        db.commit()
        print(f"Successfully seeded {len(skills)} master skills!")
    except Exception as e:
        print(f"Error seeding skills: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_skills()
