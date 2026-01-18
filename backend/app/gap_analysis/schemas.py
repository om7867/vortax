"""
Module 5: Skill Gap Analysis Engine
Pydantic Schemas
"""
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from uuid import UUID
from app.gap_analysis.models import GapStatus

# ============================================
# OUTPUT SCHEMAS
# ============================================

class SkillGapOut(BaseModel):
    """Individual skill gap detail"""
    skill_id: UUID
    skill_name: str
    user_score: float
    required_score: float
    gap_percentage: float
    gap_status: GapStatus
    importance_weight: int
    
    model_config = ConfigDict(from_attributes=True)

class GapAnalysisSummary(BaseModel):
    """Overall gap analysis summary"""
    user_id: UUID
    role_id: UUID
    role_name: str
    readiness_percentage: float
    achieved_skills_count: int
    partial_skills_count: int
    missing_skills_count: int
    evaluated_at: datetime
    skill_gaps: List[SkillGapOut]

class RadarDataPoint(BaseModel):
    """Single data point for radar chart"""
    skill_name: str
    user_score: float
    required_score: float
    gap_status: GapStatus

class RadarChartData(BaseModel):
    """Complete radar chart dataset"""
    role_name: str
    data_points: List[RadarDataPoint]

class MissingSkillOut(BaseModel):
    """Skill with gap (for recommendations)"""
    skill_id: UUID
    skill_name: str
    required_score: float
    user_score: float
    gap_percentage: float
    importance_weight: int
    
    model_config = ConfigDict(from_attributes=True)

class MissingSkillsResponse(BaseModel):
    """List of skills needing improvement"""
    role_name: str
    missing_skills: List[MissingSkillOut]
    partial_skills: List[MissingSkillOut]
