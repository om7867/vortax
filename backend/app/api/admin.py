"""
Admin API Routes.
Strict DB-driven management of skills and careers.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.deps import get_db, get_current_admin_user
from app.models.models import Skill, Career, CareerSkillRequirement, AuditLog, Recommendation
from app.auth.models import User, UserRole
from app.schemas.schemas import SkillCreate, SkillResponse, CareerCreate, CareerResponse, CareerSkillMappingCreate
from app.core.audit import log_action

router = APIRouter()

@router.post("/skills", response_model=SkillResponse)
def create_skill(skill: SkillCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """Create a new skill."""
    if db.query(Skill).filter(Skill.name == skill.name).first():
        raise HTTPException(status_code=400, detail="Skill already exists")
    
    new_skill = Skill(
        name=skill.name,
        category=skill.category,
        description=skill.description,
        created_by=current_user.id
    )
    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)
    
    log_action(db, user_id=current_user.id, action="CREATE_SKILL", entity="Skill", entity_id=new_skill.id, detail={"name": new_skill.name})
    
    return new_skill

@router.post("/careers", response_model=CareerResponse)
def create_career(career: CareerCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """Create a new career."""
    if db.query(Career).filter(Career.title == career.title).first():
        raise HTTPException(status_code=400, detail="Career already exists")
    
    new_career = Career(
        title=career.title,
        description=career.description,
        domain=career.domain
    )
    db.add(new_career)
    db.commit()
    db.refresh(new_career)
    
    log_action(db, user_id=current_user.id, action="CREATE_CAREER", entity="Career", entity_id=new_career.id, detail={"title": new_career.title})

    return new_career

@router.post("/career-skill")
def map_career_skill(mapping: CareerSkillMappingCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """Map a skill to a career with a requirement level."""
    # exist check
    if not db.query(Career).get(mapping.career_id):
        raise HTTPException(status_code=404, detail="Career not found")
    if not db.query(Skill).get(mapping.skill_id):
        raise HTTPException(status_code=404, detail="Skill not found")
        
    # unique constraint check manually for clean error
    exists = db.query(CareerSkillRequirement).filter(
        CareerSkillRequirement.career_id == mapping.career_id,
        CareerSkillRequirement.skill_id == mapping.skill_id
    ).first()
    
    if exists:
        # update
        exists.required_level = mapping.required_level
        log_action(db, user_id=current_user.id, action="UPDATE_CAREER_SKILL", entity="CareerSkillRequirement", entity_id=exists.id)
        db.commit()
        return {"msg": "Mapping updated"}
        
    new_mapping = CareerSkillRequirement(
        career_id=mapping.career_id,
        skill_id=mapping.skill_id,
        required_level=mapping.required_level
    )
    db.add(new_mapping)
    db.commit()
    
    log_action(db, user_id=current_user.id, action="CREATE_CAREER_SKILL", entity="CareerSkillRequirement", entity_id=new_mapping.id)
    
    return {"msg": "Mapping created"}

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    """Get System Analytics."""
    total_users = db.query(func.count(User.id)).scalar()
    total_skills = db.query(func.count(Skill.id)).scalar()
    total_careers = db.query(func.count(Career.id)).scalar()
    total_recommendations = db.query(func.count(Recommendation.id)).scalar()
    
    # Recent Audit Logs
    recent_logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(10).all()
    
    return {
        "metrics": {
            "users": total_users,
            "skills": total_skills,
            "careers": total_careers,
            "recommendations": total_recommendations
        },
        "recent_activity": [
            {
                "action": log.action,
                "user": log.user.username if log.user else "System",
                "timestamp": log.timestamp,
                "details": log.payload
            }
            for log in recent_logs
        ]
    }
