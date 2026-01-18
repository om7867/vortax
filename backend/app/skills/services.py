from sqlalchemy.orm import Session
from app.skills.models import SkillMaster, UserSkillProfile, SkillSource
from app.skills.schemas import UserSkillAdd
from app.profile.completion_engine import ProfileCompletionService
from app.audit.services import AuditService
from datetime import datetime

def get_available_skills(db: Session, domain: str = None):
    query = db.query(SkillMaster)
    if domain:
        query = query.filter(SkillMaster.domain == domain)
    return query.all()

def get_user_skills(db: Session, user_id: str):
    # Join with SkillMaster to get names
    results = db.query(UserSkillProfile, SkillMaster.name, SkillMaster.domain, SkillMaster.category)\
        .join(SkillMaster, UserSkillProfile.skill_id == SkillMaster.id)\
        .filter(UserSkillProfile.user_id == user_id).all()
    
    output = []
    for usp, name, domain, cat in results:
        output.append({
            "id": usp.id,
            "skill_id": usp.skill_id,
            "skill_name": name,
            "skill_domain": domain,
            "skill_category": cat,
            "self_rating": usp.self_rating,
            "verified": usp.verified,
            "source": usp.source,
            "last_assessed_at": usp.last_assessed_at
        })
    return output

def add_user_skill(db: Session, user_id: str, skill_data: UserSkillAdd):
    # Check if exists
    usp = db.query(UserSkillProfile).filter(
        UserSkillProfile.user_id == user_id,
        UserSkillProfile.skill_id == skill_data.skill_id
    ).first()
    
    if usp:
        usp.self_rating = skill_data.self_rating
        usp.last_assessed_at = datetime.utcnow()
        action = "skill_updated"
    else:
        usp = UserSkillProfile(
            user_id=user_id,
            skill_id=skill_data.skill_id,
            self_rating=skill_data.self_rating,
            source=SkillSource.MANUAL,
            verified=False
        )
        db.add(usp)
        action = "skill_added"
    
    db.commit()
    db.refresh(usp)
    
    # Audit
    AuditService.log_action(db, user_id, action, "UserSkillProfile", usp.id, skill_data.model_dump(mode='json'))
    
    # Recalculate completion
    ProfileCompletionService.calculate_score(db, user_id)
    
    # Return formatted dict matching UserSkillOut
    skill = db.query(SkillMaster).filter(SkillMaster.id == usp.skill_id).first()
    
    try:
        return {
            "id": usp.id,
            "skill_id": usp.skill_id,
            "skill_name": skill.name,
            "skill_domain": skill.domain,
            "skill_category": skill.category,
            "self_rating": usp.self_rating,
            "verified": usp.verified,
            "source": usp.source,
            "last_assessed_at": usp.last_assessed_at
        }
    except Exception as e:
        raise e

def remove_user_skill(db: Session, user_id: str, skill_id: str):
    usp = db.query(UserSkillProfile).filter(
        UserSkillProfile.user_id == user_id,
        UserSkillProfile.id == skill_id # Using the USP ID
    ).first()
    
    if usp:
        skill_ref_id = usp.id
        db.delete(usp)
        db.commit()
        
        # Audit
        AuditService.log_action(db, user_id, "skill_removed", "UserSkillProfile", skill_ref_id)
        
        # Recalculate completion
        ProfileCompletionService.calculate_score(db, user_id)
        return True
    return False
