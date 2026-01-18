from pydantic import BaseModel, ConfigDict, HttpUrl
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from app.profile.models import EducationLevel, DomainInterest, ExperienceLevel

class UserProfileBase(BaseModel):
    full_name: str
    education_level: EducationLevel
    field_of_study: str
    domain_interest: DomainInterest
    target_role: str
    experience_level: ExperienceLevel
    years_of_experience: int = 0
    location: Optional[str] = None

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileOut(UserProfileBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class ProfileHeaderOut(BaseModel):
    full_name: str
    target_role: str
    domain: str
    location: Optional[str] = None
    profile_verified: bool = False

class ProfileCompletionOut(BaseModel):
    profile_score: int
    missing_sections: List[str]
    last_updated: datetime

    model_config = ConfigDict(from_attributes=True)

class ProfessionalIntentUpdate(BaseModel):
    domain_interest: DomainInterest
    target_role: str
    experience_level: ExperienceLevel

class ProfileEligibilityOut(BaseModel):
    eligible: bool
    reason: Optional[str] = None

class CareerScorecardOut(BaseModel):
    skill_growth_percentage: int
    matching_jobs_count: int

# Full Profile Response Schema
class UserProfileFullOut(BaseModel):
    profile: UserProfileOut
    skills: List[dict] # Will contain formatted skill data from service
    certifications: List[dict] # Will contain formatted cert data from service
    completion: ProfileCompletionOut

    model_config = ConfigDict(from_attributes=True)
