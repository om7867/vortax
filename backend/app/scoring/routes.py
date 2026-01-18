"""
Module 4: Skill Scoring & Normalization Engine
API Routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import SessionLocal
from app.core.deps import get_current_user
from app.scoring import services, schemas
from app.auth.models import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/evaluate/{test_id}")
def evaluate_test(
    test_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Evaluate a submitted test and generate skill scores.
    
    This endpoint:
    - Calculates difficulty-weighted scores
    - Normalizes to 0-1 scale
    - Assigns confidence levels
    - Updates UserSkillProfile
    - Creates history records
    - Logs audit trail
    
    Security: Only test owner can evaluate
    Idempotency: Cannot evaluate same test twice
    """
    result = services.ScoringService.evaluate_test(
        db=db,
        test_id=test_id,
        user_id=current_user.id
    )
    return result

@router.get("/summary", response_model=schemas.ScoreSummaryOut)
def get_score_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get overall scoring summary for the current user.
    
    Returns:
    - Overall normalized score (average across all skills)
    - Total skills assessed
    - Detailed breakdown per skill
    
    Used by:
    - Dashboard analytics
    - Profile completion
    - Skill radar charts
    """
    summary = services.ScoringService.get_user_summary(
        db=db,
        user_id=current_user.id
    )
    return summary

@router.get("/history/{skill_id}", response_model=schemas.SkillHistoryOut)
def get_skill_history(
    skill_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get historical progression for a specific skill.
    
    Returns chronological score data for:
    - Trend analysis
    - Growth tracking
    - Analytics charts
    
    Security: Only returns data for current user
    """
    history = services.ScoringService.get_skill_history(
        db=db,
        user_id=current_user.id,
        skill_id=skill_id
    )
    return history
