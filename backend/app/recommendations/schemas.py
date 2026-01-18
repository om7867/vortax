"""
Module 6: Recommendation Engine Schemas
"""
from pydantic import BaseModel, HttpUrl
from uuid import UUID
from datetime import datetime
from typing import List, Optional
from .models import ResourceType, DifficultyLevel, RecommendationPriority, LearningPlanStatus

class LearningResourceBase(BaseModel):
    title: str
    resource_type: ResourceType
    provider: str
    skill_id: UUID
    difficulty_level: DifficultyLevel
    duration_estimate: Optional[str] = None
    external_url: Optional[str] = None
    domain: Optional[str] = None

class LearningResourceOut(LearningResourceBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class RecommendationOut(BaseModel):
    id: UUID
    user_id: UUID
    resource_id: UUID
    recommendation_type: ResourceType
    priority: RecommendationPriority
    reason: str
    gap_percentage: float
    created_at: datetime
    resource: LearningResourceOut

    class Config:
        from_attributes = True

class RecommendationSummary(BaseModel):
    courses: List[RecommendationOut]
    projects: List[RecommendationOut]
    certifications: List[RecommendationOut]

class LearningPlanCreate(BaseModel):
    resource_id: UUID

class LearningPlanOut(BaseModel):
    id: UUID
    user_id: UUID
    resource_id: UUID
    status: LearningPlanStatus
    added_at: datetime
    completed_at: Optional[datetime] = None
    resource: LearningResourceOut

    class Config:
        from_attributes = True

class JobRecommendation(BaseModel):
    id: str
    title: str
    company: str
    sector: str
    match_score: float
    reason: str
    linkedin_url: str

class ProgressUpdate(BaseModel):
    skill_id: UUID
    completed_hours: float

class UserLearningProgressOut(BaseModel):
    skill_id: UUID
    skill_name: str
    planned_hours: float
    completed_hours: float
    progress_percentage: float
    last_updated: datetime

    class Config:
        from_attributes = True
