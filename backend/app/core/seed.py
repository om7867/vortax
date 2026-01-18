"""
Database Seeder.
Destroys existing data and repopulates with strict defaults.
"""
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.models import Skill, Career, CareerSkillRequirement, SkillCategory, Course, Project, Assessment, Job, Certification, Achievement, UserSkill
from app.auth.models import User, UserRole
from app.profile.models import UserProfile, EducationLevel, DomainInterest, ExperienceLevel
from app.core.security import get_password_hash
import sys

def seed_database():
    print("🌱 Starting database seed...")
    
    # Ensure all models are loaded for metadata
    from app import all_models
    
    # 1. DROP and CREATE tables (Destructive)
    print("⚠️  Dropping all tables via Schema Reset...")
    from sqlalchemy import text
    with engine.connect() as conn:
        conn.execute(text("DROP SCHEMA IF EXISTS public CASCADE"))
        conn.execute(text("CREATE SCHEMA public"))
        conn.execute(text("GRANT ALL ON SCHEMA public TO public"))
        # Also ensure postgres user has access if running as postgres
        # conn.execute(text("GRANT ALL ON SCHEMA public TO postgres"))
        conn.commit()
    
    print("✨ Creating new tables...")
    # Re-import all models to ensure they are captured by metadata
    from app import all_models
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
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

    # 2b. Create Profile for Admin
    print("👤 Creating Admin profile...")
    profile = UserProfile(
        user_id=admin.id,
        full_name="System Administrator",
        education_level=EducationLevel.BACHELOR,
        field_of_study="Agricultural Science",
        domain_interest=DomainInterest.AGRICULTURE,
        target_role="Agronomist",
        experience_level=ExperienceLevel.INTERMEDIATE,
        years_of_experience=5,
        location="Remote"
    )
    db.add(profile)
    db.commit()

    # 3. Create Skills
    print("🛠️  Creating Skills...")
    from app.skills.models import SkillMaster, SkillDomain, SkillCategory, UserSkillProfile, SkillSource
    
    skills_data = [
        # Agriculture
        {"name": "Soil Health", "domain": SkillDomain.AGRICULTURE, "category": SkillCategory.TECHNICAL, "diff": 3},
        {"name": "Crop Science", "domain": SkillDomain.AGRICULTURE, "category": SkillCategory.TECHNICAL, "diff": 4},
        {"name": "Irrigation Systems", "domain": SkillDomain.AGRICULTURE, "category": SkillCategory.TECHNICAL, "diff": 3},
        {"name": "Pest Control", "domain": SkillDomain.AGRICULTURE, "category": SkillCategory.TECHNICAL, "diff": 2},
        # Technology
        {"name": "Data Analysis", "domain": SkillDomain.TECHNOLOGY, "category": SkillCategory.ANALYTICAL, "diff": 4},
        {"name": "Precision Agriculture", "domain": SkillDomain.TECHNOLOGY, "category": SkillCategory.TECHNICAL, "diff": 5},
        {"name": "IoT Sensors", "domain": SkillDomain.TECHNOLOGY, "category": SkillCategory.TECHNICAL, "diff": 3},
        {"name": "Farm Management", "domain": SkillDomain.AGRICULTURE, "category": SkillCategory.SOFT, "diff": 3},
        # General/Common Tech
        {"name": "Python", "domain": SkillDomain.TECHNOLOGY, "category": SkillCategory.TECHNICAL, "diff": 3},
        {"name": "Machine Learning", "domain": SkillDomain.TECHNOLOGY, "category": SkillCategory.TECHNICAL, "diff": 4},
        {"name": "SQL", "domain": SkillDomain.TECHNOLOGY, "category": SkillCategory.TECHNICAL, "diff": 3},
        {"name": "React", "domain": SkillDomain.TECHNOLOGY, "category": SkillCategory.TECHNICAL, "diff": 3},
        {"name": "FastAPI", "domain": SkillDomain.TECHNOLOGY, "category": SkillCategory.TECHNICAL, "diff": 4},
    ]
    
    skills_map = {} # name -> id
    for s in skills_data:
        skill = SkillMaster(
            name=s["name"], 
            domain=s["domain"], 
            category=s["category"], 
            difficulty_level=s["diff"],
            description=f"Core competency in {s['name']}"
        )
        db.add(skill)
        db.commit()
        db.refresh(skill)
        skills_map[s["name"]] = skill.id

    # 4. Create Careers (Roles)
    print("🚜 Creating Careers...")
    from app.gap_analysis.models import Role, RoleSkillRequirement
    
    careers_data = [
        {"title": "Agronomist", "sector": "Agriculture", "domain": "agriculture", "readiness": 60.0},
        {"title": "Soil Scientist", "sector": "Agriculture", "domain": "agriculture", "readiness": 70.0},
        {"title": "Precision Agriculture Specialist", "sector": "AgriTech", "domain": "technology", "readiness": 75.0},
        {"title": "Farm Manager", "sector": "Agriculture", "domain": "agriculture", "readiness": 50.0},
        {"title": "Data Scientist", "sector": "Technology", "domain": "technology", "readiness": 70.0},
        {"title": "Software Engineer", "sector": "Technology", "domain": "technology", "readiness": 65.0},
        {"title": "ML Engineer", "sector": "Technology", "domain": "technology", "readiness": 75.0},
    ]
    
    roles_map = {} # title -> id
    for c in careers_data:
        role = Role(
            name=c["title"], 
            sector=c["sector"], 
            domain=c["domain"],
            min_readiness_percentage=c["readiness"]
        )
        db.add(role)
        db.commit()
        db.refresh(role)
        roles_map[c["title"]] = role.id

    # 5. Career Skill Requirements
    print("🔗 Mapping Skills to Careers...")
    requirements = [
        # Agronomist
        ("Agronomist", "Soil Health", 70, 4),
        ("Agronomist", "Crop Science", 85, 5),
        ("Agronomist", "Pest Control", 60, 3),
        ("Agronomist", "Data Analysis", 40, 3),
        
        # Precision Ag Specialist
        ("Precision Agriculture Specialist", "Precision Agriculture", 90, 5),
        ("Precision Agriculture Specialist", "IoT Sensors", 80, 4),
        ("Precision Agriculture Specialist", "Data Analysis", 75, 4),
        ("Precision Agriculture Specialist", "Irrigation Systems", 50, 2),

        # Data Scientist
        ("Data Scientist", "Python", 85, 5),
        ("Data Scientist", "Machine Learning", 80, 5),
        ("Data Scientist", "SQL", 75, 4),
        ("Data Scientist", "Data Analysis", 90, 5),

        # Software Engineer
        ("Software Engineer", "Python", 80, 4),
        ("Software Engineer", "React", 85, 5),
        ("Software Engineer", "FastAPI", 80, 4),
        ("Software Engineer", "SQL", 70, 3),

        # ML Engineer
        ("ML Engineer", "Python", 90, 5),
        ("ML Engineer", "Machine Learning", 95, 5),
        ("ML Engineer", "FastAPI", 70, 3),
        ("ML Engineer", "Data Analysis", 80, 4),
    ]
    
    for role_name, skill_name, req_score, weight in requirements:
        if skill_name not in skills_map or role_name not in roles_map:
            continue
        
        mapping = RoleSkillRequirement(
            role_id=roles_map[role_name],
            skill_id=skills_map[skill_name],
            required_score_percentage=float(req_score),
            importance_weight=weight
        )
        db.add(mapping)
    db.commit()

    # 6. Seed Assessments (Session based)
    print("📝 Seeding Assessments...")
    from app.assessments.models import SkillTest, TestQuestion, TestStatus
    
    # Create one main assessment session for admin
    main_test = SkillTest(
        user_id=admin.id,
        domain="agriculture",
        target_role="Agronomist",
        status=TestStatus.EVALUATED,
        total_questions=len(skills_map) * 2
    )
    db.add(main_test)
    db.commit()
    db.refresh(main_test)
    
    for s_name, s_id in skills_map.items():
        # Add 2 questions per skill linked to this test
        q1 = TestQuestion(
            test_id=main_test.id, 
            skill_id=s_id,
            question_text=f"Sample question for {s_name}?", 
            options=["A", "B", "C", "D"], 
            correct_option_index=0, 
            difficulty=3
        )
        q2 = TestQuestion(
            test_id=main_test.id, 
            skill_id=s_id,
            question_text=f"Advanced concept in {s_name}?", 
            options=["X", "Y", "Z", "W"], 
            correct_option_index=1, 
            difficulty=4
        )
        db.add_all([q1, q2])
    db.commit()

    # 7. Seed User Skills (Demo Data for Admin)
    print("🧬 Seeding Admin Skills...")
    admin_skills = [
        ("Soil Health", 80, True),
        ("Crop Science", 45, True),
        ("Irrigation Systems", 30, False),
        ("Data Analysis", 55, True),
    ]
    
    for s_name, score, verified in admin_skills:
        if s_name not in skills_map: continue
        
        # Add to user skill profile
        usp = UserSkillProfile(
            user_id=admin.id, 
            skill_id=skills_map[s_name], 
            self_rating=4 if score > 70 else 2,
            source=SkillSource.TEST if verified else SkillSource.MANUAL,
            verified=verified
        )
        db.add(usp)
        
        # Add to SkillScore (for gap analysis)
        from app.scoring.models import SkillScore, ConfidenceLevel
        ss = SkillScore(
            user_id=admin.id,
            skill_id=skills_map[s_name],
            test_id=main_test.id,
            raw_score=int(score),
            max_score=100,
            score_percentage=float(score),
            normalized_score=float(score)/100.0,
            confidence_level=ConfidenceLevel.HIGH if verified else ConfidenceLevel.MEDIUM
        )
        db.add(ss)
    db.commit()

    # Trigger initial gap analysis for admin
    from app.gap_analysis.services import GapAnalysisService
    print("📊 Running initial gap analysis for Admin...")
    GapAnalysisService.evaluate_gap_analysis(db, admin.id)

    print("✅ Database seeding complete!")
    db.close()

if __name__ == "__main__":
    seed_database()
