"""
Unified Dashboard API Routes
"""
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.deps import get_current_user
from app.dashboard.unified_service import UnifiedDashboardService
from app.auth.models import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/complete")
def get_complete_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get complete dashboard data (all modules integrated)
    
    Returns:
    - Profile status
    - Career readiness
    - Skill scores
    - Gap analysis
    - Career scorecard
    - Next steps
    
    This is the MAIN endpoint for the enterprise dashboard
    """
    dashboard_data = UnifiedDashboardService.get_complete_dashboard(
        db=db,
        user_id=current_user.id
    )
    return dashboard_data
