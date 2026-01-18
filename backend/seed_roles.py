"""
Seed script for Module 5: Gap Analysis
Creates sample roles and role-skill requirements
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import all models to ensure they're registered
from app.core.database import SessionLocal, Base, engine
from app.gap_analysis.models import Role, RoleSkillRequirement
from app.skills.models import SkillMaster
from app.auth.models import User  # Ensure User model is loaded
from sqlalchemy import cast, String

# Create all tables
Base.metadata.create_all(bind=engine)

def seed_roles_and_requirements():
    db = SessionLocal()
    
    try:
        print("=" * 60)
        print("SEEDING ROLES & REQUIREMENTS (Module 5)")
        print("=" * 60)
        
        # Check if roles already exist
        existing_roles = db.query(Role).count()
        if existing_roles > 0:
            print(f"\n✓ {existing_roles} roles already exist. Skipping seed.")
            return
        
        # Define roles
        roles_data = [
            {
                "name": "health_analyst",
                "domain": "healthcare",
                "description": "Analyzes health data and trends to improve patient outcomes"
            },
            {
                "name": "data_scientist",
                "domain": "technology",
                "description": "Develops ML models and analyzes complex datasets"
            },
            {
                "name": "agronomist",
                "domain": "agriculture",
                "description": "Specializes in crop production and soil management"
            }
        ]
        
        print("\n--- Creating Roles ---")
        created_roles = {}
        for role_data in roles_data:
            role = Role(**role_data)
            db.add(role)
            db.flush()
            created_roles[role_data["name"]] = role
            print(f"✓ Created role: {role.name} ({role.domain})")
        
        # Get some skills from database
        print("\n--- Fetching Skills ---")
        skills = db.query(SkillMaster).limit(10).all()
        
        if not skills:
            print("⚠ No skills found in database. Please seed skills first.")
            return
        
        print(f"✓ Found {len(skills)} skills")
        
        # Create role-skill requirements
        print("\n--- Creating Role Requirements ---")
        
        # Health Analyst requirements
        if "health_analyst" in created_roles and len(skills) >= 5:
            requirements = [
                {"skill": skills[0], "required_score": 70, "weight": 5},
                {"skill": skills[1], "required_score": 60, "weight": 4},
                {"skill": skills[2], "required_score": 50, "weight": 3},
                {"skill": skills[3], "required_score": 65, "weight": 4},
                {"skill": skills[4], "required_score": 55, "weight": 3},
            ]
            
            for req in requirements:
                role_req = RoleSkillRequirement(
                    role_id=created_roles["health_analyst"].id,
                    skill_id=req["skill"].id,
                    required_score_percentage=req["required_score"],
                    importance_weight=req["weight"]
                )
                db.add(role_req)
                print(f"  ✓ {req['skill'].name}: {req['required_score']}% (weight: {req['weight']})")
        
        # Data Scientist requirements
        if "data_scientist" in created_roles and len(skills) >= 8:
            requirements = [
                {"skill": skills[0], "required_score": 80, "weight": 5},
                {"skill": skills[1], "required_score": 75, "weight": 5},
                {"skill": skills[5], "required_score": 70, "weight": 4},
                {"skill": skills[6], "required_score": 65, "weight": 3},
                {"skill": skills[7], "required_score": 60, "weight": 3},
            ]
            
            for req in requirements:
                role_req = RoleSkillRequirement(
                    role_id=created_roles["data_scientist"].id,
                    skill_id=req["skill"].id,
                    required_score_percentage=req["required_score"],
                    importance_weight=req["weight"]
                )
                db.add(role_req)
        
        # Agronomist requirements
        if "agronomist" in created_roles and len(skills) >= 6:
            requirements = [
                {"skill": skills[0], "required_score": 65, "weight": 4},
                {"skill": skills[1], "required_score": 60, "weight": 4},
                {"skill": skills[2], "required_score": 70, "weight": 5},
                {"skill": skills[3], "required_score": 55, "weight": 3},
            ]
            
            for req in requirements:
                role_req = RoleSkillRequirement(
                    role_id=created_roles["agronomist"].id,
                    skill_id=req["skill"].id,
                    required_score_percentage=req["required_score"],
                    importance_weight=req["weight"]
                )
                db.add(role_req)
        
        db.commit()
        
        print("\n" + "=" * 60)
        print("✓ SEED COMPLETE")
        print(f"  Roles created: {len(created_roles)}")
        print(f"  Requirements created: {db.query(RoleSkillRequirement).count()}")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_roles_and_requirements()
