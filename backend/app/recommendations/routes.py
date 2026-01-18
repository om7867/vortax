"""
Module 6: Recommendation Engine API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict

from app.core.database import SessionLocal
from app.core.deps import get_current_user
from app.auth.models import User
from . import schemas, services

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=schemas.RecommendationSummary)
def get_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetch all skill recommendations for the current user.
    Groups results into courses, projects, and certifications.
    """
    # Generate/Refresh recommendations first if none exist
    summary = services.RecommendationService.get_recommendations_summary(db, current_user.id)
    
    if not any(summary.values()):
        services.RecommendationService.generate_recommendations(db, current_user.id)
        summary = services.RecommendationService.get_recommendations_summary(db, current_user.id)
        
    return summary

@router.post("/add-to-plan", response_model=schemas.LearningPlanOut)
def add_to_learning_plan(
    plan_data: schemas.LearningPlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Adds a recommended resource to the user's learning plan"""
    return services.RecommendationService.add_to_learning_plan(
        db=db,
        user_id=current_user.id,
        resource_id=plan_data.resource_id
    )

@router.get("/progress/summary", response_model=List[schemas.UserLearningProgressOut])
def get_progress_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch user's current learning progress for all active skills"""
    return services.ProgressService.get_user_progress(db, current_user.id)

@router.post("/progress/update", response_model=schemas.UserLearningProgressOut)
def update_learning_progress(
    update_data: schemas.ProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update learning hours for a specific skill and recalculate readiness"""
    return services.ProgressService.update_progress(
        db=db,
        user_id=current_user.id,
        skill_id=update_data.skill_id,
        completed_hours=update_data.completed_hours
    )

@router.get("/learning-plan", response_model=List[schemas.LearningPlanOut])
def get_learning_plan(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch the user's current learning roadmap/plan"""
    return services.RecommendationService.get_learning_plan(db, current_user.id)

@router.get("/roadmap")
def get_personalized_roadmap(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch the AI-generated month-wise learning roadmap"""
    return services.RecommendationService.generate_personalized_roadmap(db, current_user.id)

@router.get("/jobs", response_model=List[schemas.JobRecommendation])
def get_job_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch job recommendations based on readiness percentage (>=70%)"""
    return services.RecommendationService.get_job_recommendations(db, current_user.id)
