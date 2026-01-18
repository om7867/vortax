from sqlalchemy.orm import Session
from app.profile.models import UserProfile, ProfileCompletion
from app.profile.schemas import UserProfileCreate, ProfessionalIntentUpdate
from app.profile.completion_engine import ProfileCompletionService
from app.audit.services import AuditService
from sqlalchemy.dialects.postgresql import UUID

def get_profile(db: Session, user_id: str):
    return db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

def create_or_update_profile(db: Session, user_id: str, profile_data: UserProfileCreate):
    profile = get_profile(db, user_id)
    
    if profile:
        # Update existing
        for key, value in profile_data.model_dump().items():
            setattr(profile, key, value)
        action = "profile_updated"
    else:
        # Create new
        profile = UserProfile(user_id=user_id, **profile_data.model_dump())
        db.add(profile)
        action = "profile_created"
    
    db.commit()
    db.refresh(profile)
    
    # Audit log
    AuditService.log_action(db, user_id, action, "UserProfile", profile.id, profile_data.model_dump())
    
    # Recalculate completion
    ProfileCompletionService.calculate_score(db, user_id)
    
    return profile

def update_intent(db: Session, user_id: str, intent_data: ProfessionalIntentUpdate):
    profile = get_profile(db, user_id)
    if not profile:
        return None
    
    for key, value in intent_data.model_dump().items():
        setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    
    # Audit
    AuditService.log_action(db, user_id, "intent_updated", "UserProfile", profile.id, intent_data.model_dump())
    
    # Recalculate completion
    ProfileCompletionService.calculate_score(db, user_id)
    
    return profile

def get_completion_status(db: Session, user_id: str):
    return ProfileCompletionService.calculate_score(db, user_id)
