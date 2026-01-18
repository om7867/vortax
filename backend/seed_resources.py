"""
Seed script for Module 6: Learning Resources
Populates database with sample courses, projects, and certifications
"""
import uuid
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
def seed_learning_resources():
    import app.all_models
    from app.recommendations.models import LearningResource, ResourceType, DifficultyLevel
    from app.skills.models import SkillMaster
    
    db = SessionLocal()
    
    try:
        print("=" * 60)
        print("SEEDING LEARNING RESOURCES (Module 6)")
        print("=" * 60)
        
        # Ensure tables exist
        Base.metadata.create_all(bind=engine)
        
        # Check if resources already exist
        count = db.query(LearningResource).count()
        if count > 0:
            print(f"✓ {count} resources already exist. Skipping seed.")
            return

        # Get skills from DB
        skills = db.query(SkillMaster).all()
        if not skills:
            print("⚠ No skills found. Please seed skills (Module 2) first.")
            return

        print(f"Found {len(skills)} skills. Creating resources...")

        resources = []
        for skill in skills:
            # Add a Course
            resources.append(LearningResource(
                title=f"Complete {skill.name} Masterclass 2026",
                resource_type=ResourceType.COURSE,
                provider="Coursera",
                skill_id=skill.id,
                difficulty_level=DifficultyLevel.BEGINNER,
                duration_estimate="4 weeks",
                external_url=f"https://coursera.org/learn/{skill.name.lower().replace(' ', '-')}",
                domain=skill.category
            ))

            # Add an Intermediate Project
            resources.append(LearningResource(
                title=f"Hands-on {skill.name} Deployment Project",
                resource_type=ResourceType.PROJECT,
                provider="SkillPath Internal",
                skill_id=skill.id,
                difficulty_level=DifficultyLevel.INTERMEDIATE,
                duration_estimate="5 days",
                external_url=f"/projects/{skill.id}",
                domain=skill.category
            ))

            # Add a Certification
            resources.append(LearningResource(
                title=f"Certified {skill.name} Professional (CPP)",
                resource_type=ResourceType.CERTIFICATION,
                provider="PathIQ Institute",
                skill_id=skill.id,
                difficulty_level=DifficultyLevel.ADVANCED,
                duration_estimate="Check provider site",
                external_url=f"https://pathiq.org/certs/{skill.id}",
                domain=skill.category
            ))

        db.add_all(resources)
        db.commit()
        print(f"✓ Successfully created {len(resources)} resources.")
        print("=" * 60)

    except Exception as e:
        print(f"✗ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_learning_resources()
