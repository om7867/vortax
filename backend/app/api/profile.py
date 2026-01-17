from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import UserSkill, Project, Certification, Achievement, Course
from app.auth.models import User

router = APIRouter()

@router.get("/unified")
def get_unified_profile(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Unified User Profile API.
    Aggregates all user data: Skills, Certs, Achievements, Projects, Stats.
    """
    
    # 1. Skills
    skills_data = []
    for us in user.user_skills:
        skills_data.append({
            "name": us.skill.name,
            "level": us.proficiency_level,
            "category": us.skill.category,
            "verified": us.verified
        })
        
    # 2. Certifications
    certs_data = [
        {
            "id": c.id,
            "title": c.title,
            "issuer": c.issuer,
            "date": c.date_earned.strftime("%Y-%m-%d") if c.date_earned else "Present",
            "url": c.url
        } for c in user.certifications
    ]
    
    # 3. Achievements
    achievements_data = [
        {
            "id": a.id,
            "title": a.title,
            "description": a.description,
            "icon": a.badge_icon,
            "date": a.date_earned.strftime("%Y-%m-%d") if a.date_earned else None
        } for a in user.achievements
    ]
    
    # 4. Stats (Calculated)
    total_skills = len(skills_data)
    verified_skills = len([s for s in skills_data if s['verified']])
    
    return {
        "user": {
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name or user.username,
            "role": user.role,
            "target_domain": user.target_domain,
        },
        "stats": {
            "total_skills": total_skills,
            "verified_skills": verified_skills,
            "certifications": len(certs_data),
            "achievements": len(achievements_data)
        },
        "skills": skills_data,
        "certifications": certs_data,
        "achievements": achievements_data,
        # Mocking projects for now as they aren't strictly linked to user in current DB schema
        # Ideally, we would have a UserProject table. 
        "projects": [] 
    }
