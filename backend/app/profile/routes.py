from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import SessionLocal
from app.core.deps import get_current_user
from app.profile import services, schemas
from app.skills.services import get_user_skills
from app.certifications.services import get_user_certifications

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/me", response_model=schemas.UserProfileFullOut)
def get_full_profile(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Fetch full profile data including skills, certs, and completion.
    This is the primary endpoint for the UserProfile page.
    """
    profile = services.get_profile(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    skills = get_user_skills(db, current_user.id)
    certifications = get_user_certifications(db, current_user.id)
    completion = services.get_completion_status(db, current_user.id)
    
    # Pydantic will handle the conversion if ConfigDict(from_attributes=True) is set
    return {
        "profile": profile,
        "skills": skills,
        "certifications": certifications,
        "completion": completion
    }

@router.post("", response_model=schemas.UserProfileOut)
def update_profile(
    profile_data: schemas.UserProfileCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return services.create_or_update_profile(db, current_user.id, profile_data)

@router.get("/header", response_model=schemas.ProfileHeaderOut)
def get_profile_header(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = services.get_profile(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    completion = services.get_completion_status(db, current_user.id)
    
    return {
        "full_name": profile.full_name,
        "target_role": profile.target_role,
        "domain": profile.domain_interest,
        "location": profile.location,
        "profile_verified": completion.profile_score >= 70
    }

@router.get("/completion-status", response_model=schemas.ProfileCompletionOut)
def get_completion_status(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return services.get_completion_status(db, current_user.id)

@router.patch("/intent", response_model=schemas.UserProfileOut)
def update_professional_intent(
    intent_data: schemas.ProfessionalIntentUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = services.update_intent(db, current_user.id, intent_data)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.get("/eligibility", response_model=schemas.ProfileEligibilityOut)
def check_eligibility(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    completion = services.get_completion_status(db, current_user.id)
    eligible = completion.profile_score >= 70
    
    reason = None
    if not eligible:
        missing = completion.missing_sections
        reason = f"Complete your profile to unlock Skill Tests. Missing: {', '.join(missing)}"
        
    return {
        "eligible": eligible,
        "reason": reason
    }

@router.get("/scorecard", response_model=schemas.CareerScorecardOut)
def get_scorecard(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Dummy calculation for now as per requirements
    # Matching jobs could be fetched from Module 7 table if exists
    return {
        "skill_growth_percentage": 24, # Constant for now
        "matching_jobs_count": 12      # Constant for now
    }
