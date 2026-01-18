"""
Module 4: Skill Scoring & Normalization Engine
Pydantic Schemas
"""
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from uuid import UUID
from app.scoring.models import ConfidenceLevel

# ============================================
# INPUT SCHEMAS
# ============================================

class ScoreEvaluationRequest(BaseModel):
    """Request to evaluate a test (typically triggered internally after submission)"""
    test_id: UUID

# ============================================
# OUTPUT SCHEMAS
# ============================================

class SkillScoreOut(BaseModel):
    """Individual skill score output"""
    skill_id: UUID
    skill_name: str
    raw_score: int
    max_score: int
    score_percentage: float
    normalized_score: float
    confidence_level: ConfidenceLevel
    evaluated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class ScoreSummaryOut(BaseModel):
    """Overall scoring summary for a user"""
    user_id: UUID
    overall_score: float  # Average normalized score across all skills
    total_skills_assessed: int
    skill_breakdown: List[SkillScoreOut]
    
class SkillHistoryPoint(BaseModel):
    """Single historical data point for a skill"""
    score_percentage: float
    normalized_score: float
    confidence_level: ConfidenceLevel
    recorded_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class SkillHistoryOut(BaseModel):
    """Historical progression for a specific skill"""
    skill_id: UUID
    skill_name: str
    history: List[SkillHistoryPoint]
