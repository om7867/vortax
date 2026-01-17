"""
Database Seeder.
Destroys existing data and repopulates with strict defaults.
"""
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.models import Skill, Career, CareerSkillRequirement, SkillCategory, Course, Project, Assessment, Job, Certification, Achievement, UserSkill
from app.auth.models import User, UserRole
from app.core.security import get_password_hash
import sys

def seed_database():
    print("🌱 Starting database seed...")
    
    # 1. DROP and CREATE tables (Destructive)
    print("⚠️  Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("✨ Creating new tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # 2. Create Admin User
        print("👤 Creating Admin user...")
        admin = User(
            username="admin",
            email="admin@agrila.com",
            hashed_password=get_password_hash("admin123"), # Passlib hash
            role=UserRole.ADMIN
        )
        db.add(admin)
        db.commit() # Commit to get ID
        db.refresh(admin)

        # 3. Create Skills
        print("🛠️  Creating Skills...")
        skills_data = [
            # Soil
            {"name": "Soil Health", "category": SkillCategory.SOIL, "description": "Analysis of soil nutrient composition"},
            # Crop
            {"name": "Crop Science", "category": SkillCategory.CROP, "description": "Biology and management of crop production"},
            {"name": "Irrigation Systems", "category": SkillCategory.CROP, "description": "Water management technologies"},
            {"name": "Pest Control", "category": SkillCategory.CROP, "description": "Integrated Pest Management (IPM)"},
            # Technology
            {"name": "Data Analysis", "category": SkillCategory.TECHNOLOGY, "description": "Agricultural data analytics"},
            {"name": "Precision Agriculture", "category": SkillCategory.TECHNOLOGY, "description": "GPS and sensor-based farming"},
            {"name": "IoT Sensors", "category": SkillCategory.TECHNOLOGY, "description": "Maintenance of connected farm sensors"},
            # Business (Optional but good for completeness)
            {"name": "Farm Management", "category": SkillCategory.BUSINESS, "description": "Operational and financial farm planning"},
        ]
        
        skills_map = {} # name -> id
        for s in skills_data:
            skill = Skill(name=s["name"], category=s["category"], description=s["description"], created_by=admin.id)
            db.add(skill)
            db.commit() # Commit individually to get IDs safely
            skills_map[s["name"]] = skill.id

        # 4. Create Careers
        print("🚜 Creating Careers...")
        careers_data = [
            {"title": "Agronomist", "description": "Specialist in crop production and soil management"},
            {"title": "Soil Scientist", "description": "Expert in soil chemistry and biology"},
            {"title": "Precision Agriculture Specialist", "description": "Tech-focused role optimizing farm inputs"},
            {"title": "Farm Manager", "description": "Oversees general farm operations"},
        ]
        
        careers_map = {} # title -> id
        for c in careers_data:
            career = Career(title=c["title"], description=c["description"])
            db.add(career)
            db.commit()
            careers_map[c["title"]] = career.id

        # 5. Career Skill Requirements
        print("🔗 Mapping Skills to Careers...")
        requirements = [
            # Agronomist
            ("Agronomist", "Soil Health", 8),
            ("Agronomist", "Crop Science", 9),
            ("Agronomist", "Pest Control", 7),
            ("Agronomist", "Data Analysis", 5),
            
            # Soil Scientist
            ("Soil Scientist", "Soil Health", 10),
            ("Soil Scientist", "Crop Science", 6),
            ("Soil Scientist", "Laboratory Analysis", None), # Skipping if not in skills list? Wait, sticking to seed list
            
            # Precision Ag Specialist
            ("Precision Agriculture Specialist", "Precision Agriculture", 9),
            ("Precision Agriculture Specialist", "IoT Sensors", 8),
            ("Precision Agriculture Specialist", "Data Analysis", 8),
            ("Precision Agriculture Specialist", "Irrigation Systems", 6),
            
            # Farm Manager
            ("Farm Manager", "Farm Management", 8),
            ("Farm Manager", "Crop Science", 6),
            ("Farm Manager", "Pest Control", 5),
            ("Farm Manager", "Data Analysis", 4),
        ]
        
        for career_title, skill_name, level in requirements:
            if skill_name not in skills_map:
                continue # Skip if skill wasn't created above
            
            mapping = CareerSkillRequirement(
                career_id=careers_map[career_title],
                skill_id=skills_map[skill_name],
                required_level=level
            )
        db.commit()

        # 6. Seed Courses (New)
        print("📚 Seeding Courses...")
        courses = [
            Course(
                title="Medical Image Analysis with Deep Learning",
                provider="Coursera",
                difficulty="Intermediate",
                skills_gained=["Deep Learning", "TensorFlow", "Medical Imaging"],
                url="https://coursera.org",
                image_url="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=300&q=80"
            ),
            Course(
                title="Precision Agriculture Fundamentals",
                provider="Udemy",
                difficulty="Beginner",
                skills_gained=["Precision Agriculture", "IoT Sensors", "Data Analysis"],
                url="https://udemy.com",
                image_url="https://images.unsplash.com/photo-1625246333195-58f21a408b59?auto=format&fit=crop&w=300&q=80"
            )
        ]
        db.add_all(courses)
        db.commit()

        # 7. Seed Projects (New)
        print("💻 Seeding Projects...")
        projects = [
            Project(
                title="Build a Pneumonia Detection Model",
                description="Use CNNs to detect pneumonia from X-ray images.",
                difficulty="Intermediate",
                skills_verified=["Python", "TensorFlow", "Medical Imaging"],
                image_url="https://images.unsplash.com/photo-1584036561566-b9375530ab7a?auto=format&fit=crop&w=300&q=80"
            ),
            Project(
                title="IoT Soil Moisture Monitor",
                description="Build a dashboard to monitor real-time soil data from sensors.",
                difficulty="Advanced",
                skills_verified=["IoT Sensors", "Data Analysis", "Python"],
                image_url="https://images.unsplash.com/photo-1581093458791-9f302e6d830b?auto=format&fit=crop&w=300&q=80"
            )
        ]
        db.add_all(projects)
        db.commit()

        # 8. Seed Assessments (New)
        print("📝 Seeding Assessments...")
        soil_skill = db.query(Skill).filter(Skill.name == "Soil Health").first()
        if soil_skill:
            assessment = Assessment(
                skill_id=soil_skill.id,
                title="Soil Health Mastery Quiz",
                question_bank=[
                    {
                        "question": "What is the ideal pH range for most crops?",
                        "options": ["3.0-4.0", "5.5-7.0", "8.0-9.0", "1.0-2.0"],
                        "answer": "5.5-7.0"
                    },
                    {
                        "question": "Which nutrient is responsible for root development?",
                        "options": ["Nitrogen", "Phosphorus", "Potassium", "Zinc"],
                        "answer": "Phosphorus"
                    }
                ]
            )
            db.add(assessment)
            db.commit()
            
        # 9. Seed Jobs (New)
        print("💼 Seeding Jobs...")
        jobs = [
            Job(
                title="AI Agronomist",
                company="GreenTech Solutions",
                location="Remote / San Francisco",
                skills_required=["Data Analysis", "Crop Science", "Python"],
                match_score=95.0, # Mock score
                apply_url="https://linkedin.com"
            ),
            Job(
                title="Smart City Data Analyst",
                company="UrbanFlow",
                location="New York, NY",
                skills_required=["Data Analysis", "Urban Planning", "SQL"],
                match_score=88.0,
                apply_url="https://linkedin.com"
            )
        ]
        db.add_all(jobs)
        db.commit()

        # 10. Seed Certifications & Achievements (New)
        print("🏆 Seeding Achievements & Certs...")
        certs = [
            Certification(
                user_id=admin.id,
                title="Certified Crop Advisor (CCA)",
                issuer="American Society of Agronomy",
                date_earned=None,
                url="https://www.agronomy.org/"
            )
        ]
        db.add_all(certs)
        
        achievements = [
            Achievement(
                user_id=admin.id,
                title="Early Adopter",
                description="Joined AgriNova during beta phase",
                badge_icon="rocket"
            ),
            Achievement(
                user_id=admin.id,
                title="Skill Pioneer",
                description="Verified 5+ skills",
                badge_icon="medal"
            )
        ]
        db.add_all(achievements)
        db.commit()

        # 11. Seed User Skills (DEMO)
        print("🧬 Seeding User Skills (Demo Data)...")
        # Get Skill IDs
        soil_id = skills_map["Soil Health"]
        data_id = skills_map["Data Analysis"]
        crop_id = skills_map["Crop Science"]
        pest_id = skills_map["Pest Control"]

        from app.models.models import UserSkill # Lazy import to avoid circular if any, strictly local
        
        user_skills = [
            UserSkill(user_id=admin.id, skill_id=soil_id, proficiency_level=7, verified=True),
            UserSkill(user_id=admin.id, skill_id=data_id, proficiency_level=5, verified=True),
            UserSkill(user_id=admin.id, skill_id=crop_id, proficiency_level=4, verified=False),
            UserSkill(user_id=admin.id, skill_id=pest_id, proficiency_level=2, verified=False),
        ]
        db.add_all(user_skills)
        db.commit()

        print("✅ Database seeding complete!")

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
