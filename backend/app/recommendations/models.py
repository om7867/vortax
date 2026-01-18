"""
Module 6: Recommendation Engine Models
"""
import uuid
import enum
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum as SqEnum, Float, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class ResourceType(str, enum.Enum):
    COURSE = "course"
    PROJECT = "project"
    CERTIFICATION = "certification"

class DifficultyLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class RecommendationPriority(str, enum.Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class LearningPlanStatus(str, enum.Enum):
    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class LearningResource(Base):
    __tablename__ = "learning_resources"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String(255), nullable=False)
    resource_type = Column(SqEnum(ResourceType), nullable=False)
    provider = Column(String(100), nullable=False)  # Coursera, Udemy, etc.
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills_master.id"), nullable=False, index=True)
    difficulty_level = Column(SqEnum(DifficultyLevel), nullable=False)
    duration_estimate = Column(String(100), nullable=True)  # e.g., "4 weeks", "10 hours"
    duration_hours = Column(Float, nullable=True) # Explicit numeric hours
    external_url = Column(String(500), nullable=True)
    rating = Column(Float, nullable=True, default=4.5)
    domain = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    skill = relationship("app.skills.models.SkillMaster")
    
    __table_args__ = {"extend_existing": True}

class TrendingSkill(Base):
    __tablename__ = "trending_skills"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    skill_name = Column(String(255), nullable=False, unique=True)
    industry = Column(String(100), nullable=False) # AgriTech, HealthTech, etc.
    demand_score = Column(Float, nullable=False) # 0-100
    growth_rate = Column(Float, nullable=False) # Percentage e.g. 15.5
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class JobRole(Base):
    __tablename__ = "job_roles_catalog" # Distinct from gap_analysis roles
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    sector = Column(String(100), nullable=False)
    required_skills = Column(JSON, nullable=False) # List of skill names/ids
    min_readiness_percentage = Column(Float, nullable=False, default=60.0)
    linkedin_url = Column(String(500), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class UserLearningProgress(Base):
    __tablename__ = "user_learning_progress"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills_master.id"), nullable=False, index=True)
    planned_hours = Column(Float, nullable=False, default=0.0)
    completed_hours = Column(Float, nullable=False, default=0.0)
    progress_percentage = Column(Float, nullable=False, default=0.0)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("app.auth.models.User")
    skill = relationship("app.skills.models.SkillMaster")

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    resource_id = Column(UUID(as_uuid=True), ForeignKey("learning_resources.id"), nullable=False)
    recommendation_type = Column(SqEnum(ResourceType), nullable=False)
    priority = Column(SqEnum(RecommendationPriority), nullable=False)
    reason = Column(Text, nullable=False)
    gap_percentage = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    user = relationship("app.auth.models.User")
    resource = relationship("LearningResource")
    
    __table_args__ = {"extend_existing": True}

class UserLearningPlan(Base):
    __tablename__ = "user_learning_plan"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    resource_id = Column(UUID(as_uuid=True), ForeignKey("learning_resources.id"), nullable=False)
    status = Column(SqEnum(LearningPlanStatus), nullable=False, default=LearningPlanStatus.PLANNED)
    added_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    user = relationship("app.auth.models.User")
    resource = relationship("LearningResource")
    
    __table_args__ = {"extend_existing": True}
class LearningRoadmap(Base):
    __tablename__ = "learning_roadmap"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills_master.id"), nullable=False, index=True)
    
    month = Column(Integer, nullable=False) # Timeline marker (1, 2, 3...)
    action = Column(String(500), nullable=False) # e.g., "Master Basics", "Obtain Certification"
    resource_type = Column(SqEnum(ResourceType), nullable=False)
    link = Column(String(500), nullable=True) # External resource URL
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    user = relationship("app.auth.models.User")
    skill = relationship("app.skills.models.SkillMaster")
    
    __table_args__ = {"extend_existing": True}
