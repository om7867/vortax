"""
MODULE 2: Master Skills Seed Script
Seeds the skills_master table with initial skill data across all domains.

Run this script after database initialization:
    python -m app.profile.seed_skills

This populates the master skills catalog that users can select from.
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent.parent))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base

# Import all models to ensure they're registered with SQLAlchemy
from app.auth.models import User, LoginHistory
from app.models.models import (
    Skill, Career, CareerSkillRequirement, UserSkill as ExistingUserSkill,
    Recommendation, MLTrainingData, AuditLog, Course, Project, Assessment,
    Job, Certification as ExistingCertification, Achievement
)
from app.profile.models import UserProfile, ProfileCompletion
from app.skills.models import SkillMaster, UserSkillProfile, SkillDomain, SkillCategory
from app.certifications.models import CertificationRecord
from app.audit.models import ProfileAuditLog


# Master Skills Data
# Organized by domain and category for easy ML consumption
MASTER_SKILLS = [
    # ============================================================
    # HEALTHCARE DOMAIN
    # ============================================================
    {
        "name": "Medical Imaging Analysis",
        "domain": SkillDomain.HEALTHCARE,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 4,
        "description": "Ability to analyze and interpret medical imaging data (X-rays, MRI, CT scans)"
    },
    {
        "name": "Patient Data Management",
        "domain": SkillDomain.HEALTHCARE,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 2,
        "description": "Managing electronic health records and patient information systems"
    },
    {
        "name": "Clinical Research Methods",
        "domain": SkillDomain.HEALTHCARE,
        "category": SkillCategory.ANALYTICAL,
        "difficulty_level": 4,
        "description": "Designing and conducting clinical research studies"
    },
    {
        "name": "Healthcare Data Analytics",
        "domain": SkillDomain.HEALTHCARE,
        "category": SkillCategory.ANALYTICAL,
        "difficulty_level": 3,
        "description": "Analyzing healthcare data for insights and decision-making"
    },
    {
        "name": "Epidemiology",
        "domain": SkillDomain.HEALTHCARE,
        "category": SkillCategory.ANALYTICAL,
        "difficulty_level": 4,
        "description": "Study of disease patterns and health outcomes in populations"
    },
    {
        "name": "Patient Communication",
        "domain": SkillDomain.HEALTHCARE,
        "category": SkillCategory.SOFT,
        "difficulty_level": 2,
        "description": "Effective communication with patients and families"
    },
    {
        "name": "Medical Terminology",
        "domain": SkillDomain.HEALTHCARE,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 2,
        "description": "Understanding and using medical terminology correctly"
    },
    {
        "name": "Telemedicine Technology",
        "domain": SkillDomain.HEALTHCARE,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 3,
        "description": "Using telehealth platforms and remote patient monitoring"
    },
    
    # ============================================================
    # AGRICULTURE DOMAIN
    # ============================================================
    {
        "name": "Soil Analysis",
        "domain": SkillDomain.AGRICULTURE,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 3,
        "description": "Testing and analyzing soil composition, pH, and nutrient levels"
    },
    {
        "name": "Crop Management",
        "domain": SkillDomain.AGRICULTURE,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 3,
        "description": "Planning and managing crop cultivation cycles"
    },
    {
        "name": "Precision Agriculture",
        "domain": SkillDomain.AGRICULTURE,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 4,
        "description": "Using GPS, sensors, and data analytics for optimized farming"
    },
    {
        "name": "Irrigation Systems",
        "domain": SkillDomain.AGRICULTURE,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 3,
        "description": "Designing and managing irrigation infrastructure"
    },
    {
        "name": "Pest Management",
        "domain": SkillDomain.AGRICULTURE,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 3,
        "description": "Integrated pest management strategies"
    },
    {
        "name": "Agricultural Economics",
        "domain": SkillDomain.AGRICULTURE,
        "category": SkillCategory.ANALYTICAL,
        "difficulty_level": 3,
        "description": "Understanding agricultural markets and economics"
    },
    {
        "name": "Sustainable Farming Practices",
        "domain": SkillDomain.AGRICULTURE,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 3,
        "description": "Implementing environmentally sustainable farming methods"
    },
    {
        "name": "Farm Equipment Operation",
        "domain": SkillDomain.AGRICULTURE,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 2,
        "description": "Operating and maintaining agricultural machinery"
    },
    {
        "name": "Livestock Management",
        "domain": SkillDomain.AGRICULTURE,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 3,
        "description": "Caring for and managing livestock"
    },
    
    # ============================================================
    # URBAN PLANNING DOMAIN
    # ============================================================
    {
        "name": "Urban Design",
        "domain": SkillDomain.URBAN,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 4,
        "description": "Designing urban spaces and infrastructure"
    },
    {
        "name": "GIS Mapping",
        "domain": SkillDomain.URBAN,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 3,
        "description": "Geographic Information Systems for spatial analysis"
    },
    {
        "name": "Transportation Planning",
        "domain": SkillDomain.URBAN,
        "category": SkillCategory.ANALYTICAL,
        "difficulty_level": 4,
        "description": "Planning urban transportation systems"
    },
    {
        "name": "Zoning Regulations",
        "domain": SkillDomain.URBAN,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 3,
        "description": "Understanding and applying zoning laws"
    },
    {
        "name": "Environmental Impact Assessment",
        "domain": SkillDomain.URBAN,
        "category": SkillCategory.ANALYTICAL,
        "difficulty_level": 4,
        "description": "Assessing environmental impacts of urban development"
    },
    {
        "name": "Community Engagement",
        "domain": SkillDomain.URBAN,
        "category": SkillCategory.SOFT,
        "difficulty_level": 3,
        "description": "Engaging with community stakeholders"
    },
    {
        "name": "Smart City Technologies",
        "domain": SkillDomain.URBAN,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 4,
        "description": "IoT and smart infrastructure for urban areas"
    },
    {
        "name": "Urban Data Analytics",
        "domain": SkillDomain.URBAN,
        "category": SkillCategory.ANALYTICAL,
        "difficulty_level": 3,
        "description": "Analyzing urban data for planning decisions"
    },
    
    # ============================================================
    # COMMON SKILLS (Applicable across all domains)
    # ============================================================
    {
        "name": "Python Programming",
        "domain": SkillDomain.COMMON,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 3,
        "description": "Programming in Python for data analysis and automation"
    },
    {
        "name": "Data Visualization",
        "domain": SkillDomain.COMMON,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 2,
        "description": "Creating charts, graphs, and visual representations of data"
    },
    {
        "name": "Statistical Analysis",
        "domain": SkillDomain.COMMON,
        "category": SkillCategory.ANALYTICAL,
        "difficulty_level": 3,
        "description": "Applying statistical methods to analyze data"
    },
    {
        "name": "Machine Learning",
        "domain": SkillDomain.COMMON,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 4,
        "description": "Building and deploying ML models"
    },
    {
        "name": "SQL Database Management",
        "domain": SkillDomain.COMMON,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 2,
        "description": "Working with relational databases using SQL"
    },
    {
        "name": "Project Management",
        "domain": SkillDomain.COMMON,
        "category": SkillCategory.SOFT,
        "difficulty_level": 3,
        "description": "Planning and managing projects effectively"
    },
    {
        "name": "Technical Writing",
        "domain": SkillDomain.COMMON,
        "category": SkillCategory.SOFT,
        "difficulty_level": 2,
        "description": "Writing clear technical documentation"
    },
    {
        "name": "Problem Solving",
        "domain": SkillDomain.COMMON,
        "category": SkillCategory.SOFT,
        "difficulty_level": 2,
        "description": "Analytical problem-solving abilities"
    },
    {
        "name": "Communication Skills",
        "domain": SkillDomain.COMMON,
        "category": SkillCategory.SOFT,
        "difficulty_level": 2,
        "description": "Effective verbal and written communication"
    },
    {
        "name": "Critical Thinking",
        "domain": SkillDomain.COMMON,
        "category": SkillCategory.ANALYTICAL,
        "difficulty_level": 3,
        "description": "Analyzing information objectively and making reasoned judgments"
    },
    {
        "name": "Research Methodology",
        "domain": SkillDomain.COMMON,
        "category": SkillCategory.ANALYTICAL,
        "difficulty_level": 3,
        "description": "Conducting systematic research and analysis"
    },
    {
        "name": "Data Collection",
        "domain": SkillDomain.COMMON,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 2,
        "description": "Gathering and organizing data from various sources"
    },
    {
        "name": "Excel/Spreadsheet Analysis",
        "domain": SkillDomain.COMMON,
        "category": SkillCategory.TECHNICAL,
        "difficulty_level": 2,
        "description": "Advanced spreadsheet analysis and modeling"
    },
    {
        "name": "Presentation Skills",
        "domain": SkillDomain.COMMON,
        "category": SkillCategory.SOFT,
        "difficulty_level": 2,
        "description": "Creating and delivering effective presentations"
    },
    {
        "name": "Teamwork",
        "domain": SkillDomain.COMMON,
        "category": SkillCategory.SOFT,
        "difficulty_level": 2,
        "description": "Collaborating effectively in team environments"
    },
]


def seed_master_skills(db: Session):
    """
    Seed the skills_master table with initial data.
    Skips skills that already exist (based on unique name constraint).
    """
    print("🌱 Starting master skills seed...")
    
    added_count = 0
    skipped_count = 0
    
    for skill_data in MASTER_SKILLS:
        # Check if skill already exists
        existing_skill = db.query(SkillMaster).filter(
            SkillMaster.name == skill_data["name"]
        ).first()
        
        if existing_skill:
            print(f"  ⏭️  Skipped: {skill_data['name']} (already exists)")
            skipped_count += 1
            continue
        
        # Create new skill
        skill = SkillMaster(**skill_data)
        db.add(skill)
        print(f"  ✅ Added: {skill_data['name']} ({skill_data['domain'].value})")
        added_count += 1
    
    db.commit()
    
    print(f"\n✨ Seed complete!")
    print(f"   Added: {added_count} skills")
    print(f"   Skipped: {skipped_count} skills (already existed)")
    print(f"   Total: {len(MASTER_SKILLS)} skills in catalog\n")


def main():
    """Main entry point for seed script"""
    print("=" * 60)
    print("MODULE 2: Master Skills Seed Script")
    print("=" * 60)
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Create database session
    db = SessionLocal()
    
    try:
        seed_master_skills(db)
    except Exception as e:
        print(f"\n❌ Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
