from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from app.skills.models import SkillDomain, SkillCategory, SkillSource

class SkillMasterOut(BaseModel):
    id: UUID
    name: str
    domain: SkillDomain
    category: SkillCategory
    difficulty_level: int
    description: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class UserSkillAdd(BaseModel):
    skill_id: UUID
    self_rating: int

class UserSkillOut(BaseModel):
    id: UUID
    skill_id: UUID
    skill_name: str
    skill_domain: SkillDomain
    skill_category: SkillCategory
    self_rating: int
    verified: bool
    source: SkillSource
    last_assessed_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
class SkillCreate(BaseModel):
    name: str
    domain: SkillDomain
    category: SkillCategory
    difficulty_level: int
    description: Optional[str] = None

class SkillResponse(SkillMasterOut):
    pass
