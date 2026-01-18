import uuid
import enum
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Enum as SqEnum, UniqueConstraint, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class SkillDomain(str, enum.Enum):
    HEALTHCARE = "healthcare"
    AGRICULTURE = "agriculture"
    URBAN = "urban"
    TECHNOLOGY = "technology"
    FINANCE = "finance"
    EDUCATION = "education"
    COMMON = "common"

class SkillCategory(str, enum.Enum):
    TECHNICAL = "technical"
    ANALYTICAL = "analytical"
    SOFT = "soft"

class SkillSource(str, enum.Enum):
    MANUAL = "manual"
    TEST = "test"
    PROJECT = "project"
    CERTIFICATION = "certification"

class SkillMaster(Base):
    __tablename__ = "skills_master"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    domain = Column(SqEnum(SkillDomain, values_callable=lambda x: [e.value for e in x]), nullable=False, index=True)
    category = Column(SqEnum(SkillCategory, values_callable=lambda x: [e.value for e in x]), nullable=False, index=True)
    difficulty_level = Column(Integer, nullable=False)  # 1-5 scale
    description = Column(String(1000), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    user_skill_profiles = relationship("UserSkillProfile", back_populates="skill")
    
    __table_args__ = (
        CheckConstraint('difficulty_level >= 1 AND difficulty_level <= 5', name='skill_diff_range'),
        {"extend_existing": True}
    )

class UserSkillProfile(Base):
    __tablename__ = "user_skill_profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills_master.id"), nullable=False, index=True)
    self_rating = Column(Integer, nullable=False)  # 1-5 scale
    source = Column(SqEnum(SkillSource, values_callable=lambda x: [e.value for e in x]), nullable=False, default=SkillSource.MANUAL)
    verified = Column(Boolean, nullable=False, default=False)
    last_assessed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    user = relationship("User", backref="skills_inventory")
    skill = relationship("SkillMaster", back_populates="user_skill_profiles")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'skill_id', name='uniq_user_skill'),
        CheckConstraint('self_rating >= 1 AND self_rating <= 5', name='skill_rating_range'),
        {"extend_existing": True}
    )
