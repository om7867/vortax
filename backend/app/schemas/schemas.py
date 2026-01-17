"""
Pydantic Schemas for API Validation.
"""
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.models.models import SkillCategory
from app.auth.models import UserRole

# --- Token ---
class Token(BaseModel):
    access_token: str
    token_type: str
    username: str
    role: str

class TokenData(BaseModel):
    username: Optional[str] = None

# --- User ---
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True

# --- Skills ---
class SkillBase(BaseModel):
    name: str
    category: SkillCategory
    description: Optional[str] = None

class SkillCreate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: int
    created_by: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Careers ---
class CareerBase(BaseModel):
    title: str
    description: Optional[str] = None
    domain: str = "AGRICULTURE"

class CareerCreate(CareerBase):
    pass

class CareerResponse(CareerBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Mappings ---
class CareerSkillMappingCreate(BaseModel):
    career_id: int
    skill_id: int
    required_level: int # 1-10

# --- User Skills ---
class UserSkillAdd(BaseModel):
    skill_id: int
    proficiency_level: int

class UserSkillResponse(BaseModel):
    id: int
    skill_name: str
    category: str
    proficiency_level: int
    
    class Config:
        from_attributes = True

# --- Dashboard ---
class RecommendationResponse(BaseModel):
    career_id: int
    career_title: str
    match_score: float
    readiness_status: str
    ml_confidence: float
    skill_gaps: List[dict]

class DashboardResponse(BaseModel):
    user: str
    recommendations: List[RecommendationResponse]
