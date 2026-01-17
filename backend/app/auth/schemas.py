from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    target_domain: Optional[str] = "Agriculture"

class UserCreate(UserBase):
    password: str
    career_goals: Optional[List[str]] = None

class UserOut(UserBase):
    id: UUID
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Login History Schema
class LoginHistoryOut(BaseModel):
    id: UUID
    ip_address: Optional[str]
    user_agent: Optional[str]
    success: bool
    timestamp: datetime

    class Config:
        from_attributes = True
