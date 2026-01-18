from pydantic import BaseModel, ConfigDict, HttpUrl
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from app.skills.models import SkillDomain

class CertificationCreate(BaseModel):
    name: str
    issuing_organization: str
    credential_id: Optional[str] = None
    issue_date: datetime
    expiry_date: Optional[datetime] = None
    verification_url: Optional[str] = None
    domain: SkillDomain

class CertificationOut(BaseModel):
    id: UUID
    name: str
    issuing_organization: str
    credential_id: Optional[str] = None
    issue_date: datetime
    expiry_date: Optional[datetime] = None
    verification_url: Optional[str] = None
    domain: SkillDomain
    
    model_config = ConfigDict(from_attributes=True)
