"""
Module 5: Skill Gap Analysis Engine
Database Models
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Enum as SqEnum, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class GapStatus(str, enum.Enum):
    """Status of skill gap relative to role requirement"""
    ACHIEVED = "achieved"              # User meets or exceeds requirement
    NEEDS_IMPROVEMENT = "needs_improvement"  # User has 60%+ of requirement
    MISSING = "missing"                # User has <60% of requirement

class Role(Base):
    __tablename__ = "roles"
    __table_args__ = {"extend_existing": True}
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, nullable=False, unique=True, index=True)
    domain = Column(String, nullable=False, index=True)  # healthcare, agriculture, tech, etc.
    description = Column(Text, nullable=True)
    sector = Column(String, nullable=False, default="Technology") # AgriTech, Data, etc.
    min_readiness_percentage = Column(Float, nullable=False, default=60.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    skill_requirements = relationship("RoleSkillRequirement", back_populates="role", cascade="all, delete-orphan")

class RoleSkillRequirement(Base):
    __tablename__ = "role_skill_requirements"
    __table_args__ = {"extend_existing": True}
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id"), nullable=False, index=True)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills_master.id"), nullable=False, index=True)
    
    # Requirement specifications
    required_score_percentage = Column(Float, nullable=False)  # Minimum score needed (0-100)
    importance_weight = Column(Integer, nullable=False, default=3)  # 1-5, higher = more important
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    role = relationship("Role", back_populates="skill_requirements")
    skill = relationship("SkillMaster")

class SkillGapResult(Base):
    __tablename__ = "skill_gap_results"
    __table_args__ = {"extend_existing": True}
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id"), nullable=False, index=True)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills_master.id"), nullable=False, index=True)
    
    # Scores
    user_score = Column(Float, nullable=False)  # User's current score (0-100)
    required_score = Column(Float, nullable=False)  # Required score for role (0-100)
    gap_percentage = Column(Float, nullable=False)  # required - user (can be negative if exceeded)
    
    # Status
    gap_status = Column(SqEnum(GapStatus), nullable=False)
    
    # Metadata
    evaluated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    
    # Relationships
    user = relationship("User")
    role = relationship("Role")
    skill = relationship("SkillMaster")

class CareerReadinessSnapshot(Base):
    __tablename__ = "career_readiness_snapshots"
    __table_args__ = {"extend_existing": True}
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id"), nullable=False, index=True)
    
    # Readiness metrics
    readiness_percentage = Column(Float, nullable=False)  # 0-100, weighted by importance
    
    # Skill breakdown counts
    achieved_skills_count = Column(Integer, nullable=False, default=0)
    partial_skills_count = Column(Integer, nullable=False, default=0)
    missing_skills_count = Column(Integer, nullable=False, default=0)
    
    # Metadata
    evaluated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    
    # Relationships
    user = relationship("User")
    role = relationship("Role")
