import uuid
import enum
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum as SqEnum, JSON, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

# ============================================================
# ENUMS - Re-exported for compatibility
# ============================================================

class EducationLevel(str, enum.Enum):
    SECONDARY = "secondary"
    DIPLOMA = "diploma"
    ASSOCIATE = "associate"
    BACHELOR = "bachelor"
    MASTER = "master"
    PHD = "phd"
    POST_GRAD = "post_grad"
    SPECIALIZED = "specialized"

class DomainInterest(str, enum.Enum):
    HEALTHCARE = "healthcare"
    AGRICULTURE = "agriculture"
    URBAN = "urban"
    TECHNOLOGY = "technology"
    FINANCE = "finance"
    EDUCATION = "education"
    COMMON = "common"

class ExperienceLevel(str, enum.Enum):
    ENTRY = "entry"
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

# ============================================================
# MODELS
# ============================================================

class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    education_level = Column(SqEnum(EducationLevel, values_callable=lambda x: [e.value for e in x]), nullable=False)
    field_of_study = Column(String(255), nullable=False)
    domain_interest = Column(SqEnum(DomainInterest, values_callable=lambda x: [e.value for e in x]), nullable=False)
    target_role = Column(String(255), nullable=False)
    experience_level = Column(SqEnum(ExperienceLevel, values_callable=lambda x: [e.value for e in x]), nullable=False)
    years_of_experience = Column(Integer, nullable=False, default=0)
    location = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    user = relationship("User", backref="profile_v2")
    
    __table_args__ = (
        CheckConstraint('years_of_experience >= 0', name='check_years_pos'),
        {"extend_existing": True}
    )

class ProfileCompletion(Base):
    __tablename__ = "profile_completion"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True, index=True)
    profile_score = Column(Integer, nullable=False, default=0)  # 0-100
    missing_sections = Column(JSON, nullable=False, default=list)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    user = relationship("User", backref="completion_v2")
    
    __table_args__ = (
        CheckConstraint('profile_score >= 0 AND profile_score <= 100', name='check_score_range_v2'),
        {"extend_existing": True}
    )
