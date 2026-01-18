"""
Admin endpoints for MODULE 2: Profile, Skills & Certifications
Includes skill seeding and management endpoints
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_admin_user
from app.auth.models import User
from app.skills.models import SkillMaster, SkillDomain, SkillCategory
from app.skills.schemas import SkillCreate, SkillResponse


# Initialize router
router = APIRouter(prefix="/admin/skills", tags=["Admin - Skills"])


# Master Skills Data for Seeding
MASTER_SKILLS_DATA = [
    # Healthcare
    {"name": "Medical Imaging Analysis", "domain": "healthcare", "category": "technical", "difficulty_level": 4, "description": "Ability to analyze and interpret medical imaging data"},
    {"name": "Patient Data Management", "domain": "healthcare", "category": "technical", "difficulty_level": 2, "description": "Managing electronic health records"},
    {"name": "Clinical Research Methods", "domain": "healthcare", "category": "analytical", "difficulty_level": 4, "description": "Designing and conducting clinical research"},
    {"name": "Healthcare Data Analytics", "domain": "healthcare", "category": "analytical", "difficulty_level": 3, "description": "Analyzing healthcare data for insights"},
    {"name": "Epidemiology", "domain": "healthcare", "category": "analytical", "difficulty_level": 4, "description": "Study of disease patterns in populations"},
    {"name": "Patient Communication", "domain": "healthcare", "category": "soft", "difficulty_level": 2, "description": "Effective communication with patients"},
    {"name": "Medical Terminology", "domain": "healthcare", "category": "technical", "difficulty_level": 2, "description": "Understanding medical terminology"},
    {"name": "Telemedicine Technology", "domain": "healthcare", "category": "technical", "difficulty_level": 3, "description": "Using telehealth platforms"},
    
    # Agriculture
    {"name": "Soil Analysis", "domain": "agriculture", "category": "technical", "difficulty_level": 3, "description": "Testing and analyzing soil composition"},
    {"name": "Crop Management", "domain": "agriculture", "category": "technical", "difficulty_level": 3, "description": "Planning and managing crop cultivation"},
    {"name": "Precision Agriculture", "domain": "agriculture", "category": "technical", "difficulty_level": 4, "description": "Using GPS and sensors for optimized farming"},
    {"name": "Irrigation Systems", "domain": "agriculture", "category": "technical", "difficulty_level": 3, "description": "Designing irrigation infrastructure"},
    {"name": "Pest Management", "domain": "agriculture", "category": "technical", "difficulty_level": 3, "description": "Integrated pest management strategies"},
    {"name": "Agricultural Economics", "domain": "agriculture", "category": "analytical", "difficulty_level": 3, "description": "Understanding agricultural markets"},
    {"name": "Sustainable Farming Practices", "domain": "agriculture", "category": "technical", "difficulty_level": 3, "description": "Implementing sustainable farming"},
    {"name": "Farm Equipment Operation", "domain": "agriculture", "category": "technical", "difficulty_level": 2, "description": "Operating agricultural machinery"},
    {"name": "Livestock Management", "domain": "agriculture", "category": "technical", "difficulty_level": 3, "description": "Caring for livestock"},
    
    # Urban
    {"name": "Urban Design", "domain": "urban", "category": "technical", "difficulty_level": 4, "description": "Designing urban spaces"},
    {"name": "GIS Mapping", "domain": "urban", "category": "technical", "difficulty_level": 3, "description": "Geographic Information Systems"},
    {"name": "Transportation Planning", "domain": "urban", "category": "analytical", "difficulty_level": 4, "description": "Planning urban transportation"},
    {"name": "Zoning Regulations", "domain": "urban", "category": "technical", "difficulty_level": 3, "description": "Understanding zoning laws"},
    {"name": "Environmental Impact Assessment", "domain": "urban", "category": "analytical", "difficulty_level": 4, "description": "Assessing environmental impacts"},
    {"name": "Community Engagement", "domain": "urban", "category": "soft", "difficulty_level": 3, "description": "Engaging with stakeholders"},
    {"name": "Smart City Technologies", "domain": "urban", "category": "technical", "difficulty_level": 4, "description": "IoT and smart infrastructure"},
    {"name": "Urban Data Analytics", "domain": "urban", "category": "analytical", "difficulty_level": 3, "description": "Analyzing urban data"},
    
    # Common
    {"name": "Python Programming", "domain": "common", "category": "technical", "difficulty_level": 3, "description": "Programming in Python"},
    {"name": "Data Visualization", "domain": "common", "category": "technical", "difficulty_level": 2, "description": "Creating visual data representations"},
    {"name": "Statistical Analysis", "domain": "common", "category": "analytical", "difficulty_level": 3, "description": "Applying statistical methods"},
    {"name": "Machine Learning", "domain": "common", "category": "technical", "difficulty_level": 4, "description": "Building ML models"},
    {"name": "SQL Database Management", "domain": "common", "category": "technical", "difficulty_level": 2, "description": "Working with SQL databases"},
    {"name": "Project Management", "domain": "common", "category": "soft", "difficulty_level": 3, "description": "Managing projects effectively"},
    {"name": "Technical Writing", "domain": "common", "category": "soft", "difficulty_level": 2, "description": "Writing technical documentation"},
    {"name": "Problem Solving", "domain": "common", "category": "soft", "difficulty_level": 2, "description": "Analytical problem-solving"},
    {"name": "Communication Skills", "domain": "common", "category": "soft", "difficulty_level": 2, "description": "Effective communication"},
    {"name": "Critical Thinking", "domain": "common", "category": "analytical", "difficulty_level": 3, "description": "Making reasoned judgments"},
    {"name": "Research Methodology", "domain": "common", "category": "analytical", "difficulty_level": 3, "description": "Conducting systematic research"},
    {"name": "Data Collection", "domain": "common", "category": "technical", "difficulty_level": 2, "description": "Gathering and organizing data"},
    {"name": "Excel Analysis", "domain": "common", "category": "technical", "difficulty_level": 2, "description": "Advanced spreadsheet analysis"},
    {"name": "Presentation Skills", "domain": "common", "category": "soft", "difficulty_level": 2, "description": "Creating effective presentations"},
    {"name": "Teamwork", "domain": "common", "category": "soft", "difficulty_level": 2, "description": "Collaborating in teams"},
]


@router.post("/seed", status_code=status.HTTP_201_CREATED)
async def seed_master_skills(
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Seed the master skills catalog (Admin only).
    
    - **Adds 40+ predefined skills** across all domains
    - **Skips existing skills** (idempotent operation)
    - **Returns summary** of added/skipped skills
    
    Domains:
    - Healthcare (8 skills)
    - Agriculture (9 skills)
    - Urban (8 skills)
    - Common (15 skills)
    """
    added = []
    skipped = []
    
    for skill_data in MASTER_SKILLS_DATA:
        # Check if skill exists
        existing = db.query(SkillMaster).filter(
            SkillMaster.name == skill_data["name"]
        ).first()
        
        if existing:
            skipped.append(skill_data["name"])
            continue
        
        # Create skill
        skill = SkillMaster(
            name=skill_data["name"],
            domain=SkillDomain(skill_data["domain"]),
            category=SkillCategory(skill_data["category"]),
            difficulty_level=skill_data["difficulty_level"],
            description=skill_data.get("description")
        )
        db.add(skill)
        added.append(skill_data["name"])
    
    db.commit()
    
    return {
        "message": "Master skills seeding complete",
        "added_count": len(added),
        "skipped_count": len(skipped),
        "total_skills": len(MASTER_SKILLS_DATA),
        "added_skills": added[:10] if len(added) > 10 else added,  # Show first 10
        "note": f"Showing first 10 of {len(added)} added skills" if len(added) > 10 else None
    }


@router.get("/all", response_model=List[SkillResponse])
async def get_all_master_skills(
    domain: str = None,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Get all master skills (Admin only).
    
    Optional Query Parameters:
    - **domain**: Filter by domain
    """
    query = db.query(SkillMaster)
    
    if domain:
        query = query.filter(SkillMaster.domain == domain)
    
    skills = query.all()
    return skills


@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_master_skill(
    skill_id: str,
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """
    Delete a master skill (Admin only).
    
    Note: This does NOT delete user skill data (by design for ML purposes).
    """
    skill = db.query(SkillMaster).filter(SkillMaster.id == skill_id).first()
    
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )
    
    db.delete(skill)
    db.commit()
    
    return None
