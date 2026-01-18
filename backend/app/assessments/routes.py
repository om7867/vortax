"""
Module 3: AI-Powered Skill Assessment Engine
API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import SessionLocal
from app.core.deps import get_current_user
from app.assessments import services, schemas
from app.auth.models import User
from app.core.event_bus import EventBus


router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/start", response_model=schemas.SkillTestOut)
def start_assessment(
    test_data: schemas.TestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Start a new skill assessment"""
    result = services.AssessmentService.start_assessment(
        db=db,
        user_id=current_user.id,
        domain_override=test_data.domain,
        role_override=test_data.target_role
    )
    return result

@router.post("/submit", response_model=schemas.TestResultOut)
def submit_assessment(
    submission: schemas.TestSubmission,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Submit assessment answers
    AUTO-TRIGGERS: Scoring → Gap Analysis → Recommendations
    """
    result = services.AssessmentService.submit_assessment(
        db=db,
        user_id=current_user.id,
        submission=submission
    )
    
    # AUTO-TRIGGER PIPELINE in background
    background_tasks.add_task(
        EventBus.trigger_assessment_pipeline,
        test_id=submission.test_id,
        user_id=current_user.id
    )
    
    return result

@router.get("/result/{test_id}", response_model=schemas.TestResultOut)
def get_result(
    test_id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the detailed results of a completed assessment.
    """
    return services.AssessmentService.get_result(db, test_id)
