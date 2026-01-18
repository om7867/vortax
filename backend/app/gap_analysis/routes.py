"""
Module 5: Skill Gap Analysis Engine
API Routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import SessionLocal
from app.core.deps import get_current_user
from app.gap_analysis import services, schemas
from app.auth.models import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/evaluate")
def evaluate_gap_analysis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Run complete gap analysis for current user.
    
    This endpoint:
    - Fetches user's target role
    - Compares user skills vs role requirements
    - Calculates weighted readiness percentage
    - Classifies gaps (ACHIEVED/PARTIAL/MISSING)
    - Persists SkillGapResult + CareerReadinessSnapshot
    - Logs audit trail
    
    Used after:
    - Test completion
    - Profile updates
    - Manual refresh
    """
    result = services.GapAnalysisService.evaluate_gap_analysis(
        db=db,
        user_id=current_user.id
    )
    return result

@router.get("/summary", response_model=schemas.GapAnalysisSummary)
def get_gap_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get latest gap analysis summary.
    
    Returns:
    - Overall readiness percentage
    - Skill breakdown with gaps
    - Achievement counts
    
    Used by:
    - Dashboard
    - Profile page
    - Career scorecard
    """
    summary = services.GapAnalysisService.get_summary(
        db=db,
        user_id=current_user.id
    )
    return summary

@router.get("/radar-data", response_model=schemas.RadarChartData)
def get_radar_chart_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get data for radar chart visualization.
    
    Returns skill comparison data for visual display.
    
    Used by:
    - Dashboard radar chart
    - Skill comparison views
    """
    radar_data = services.GapAnalysisService.get_radar_data(
        db=db,
        user_id=current_user.id
    )
    return radar_data

@router.get("/missing-skills", response_model=schemas.MissingSkillsResponse)
def get_missing_skills(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get skills with gaps (for recommendation engine).
    
    Returns:
    - Missing skills (< 60% of requirement)
    - Partial skills (60-99% of requirement)
    
    Used by:
    - Module 6: Recommendation Engine
    - Learning journey planning
    """
    missing = services.GapAnalysisService.get_missing_skills(
        db=db,
        user_id=current_user.id
    )
    return missing

@router.post("/mark-viewed")
def mark_analysis_viewed(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark that the user has viewed their latest skill gap analysis.
    - Required to unlock job recommendations.
    """
    current_user.analysis_viewed = True
    
    from app.audit.services import AuditService
    AuditService.log_action(
        db=db,
        actor_id=current_user.id,
        action="ANALYSIS_VIEWED",
        entity_type="User",
        entity_id=current_user.id
    )
    
    db.commit()
    return {"message": "Analysis marked as viewed"}
