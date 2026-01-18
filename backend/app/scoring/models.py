"""
Module 4: Skill Scoring & Normalization Engine
Database Models
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Enum as SqEnum, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class ConfidenceLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class SkillScore(Base):
    """
    Current skill competency scores.
    One record per user per skill per test.
    Latest test overrides previous score (history is maintained separately).
    """
    __tablename__ = "skill_scores"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills_master.id"), nullable=False, index=True)
    test_id = Column(UUID(as_uuid=True), ForeignKey("skill_tests.id"), nullable=False, index=True)
    
    # Raw scoring
    raw_score = Column(Integer, nullable=False)  # Actual points earned
    max_score = Column(Integer, nullable=False)  # Maximum possible points
    score_percentage = Column(Float, nullable=False)  # (raw/max) * 100
    
    # Normalized for ML
    normalized_score = Column(Float, nullable=False)  # 0.0 to 1.0
    
    # Confidence classification
    confidence_level = Column(SqEnum(ConfidenceLevel), nullable=False)
    
    # Metadata
    difficulty_weighted = Column(Boolean, default=True, nullable=False)
    evaluated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # Relationships
    user = relationship("app.auth.models.User")
    skill = relationship("app.skills.models.SkillMaster")
    test = relationship("app.assessments.models.SkillTest")
    
    # Ensure one score per user-skill-test combination
    __table_args__ = (
        UniqueConstraint('user_id', 'skill_id', 'test_id', name='uq_user_skill_test'),
        {"extend_existing": True}
    )

class SkillScoreHistory(Base):
    __tablename__ = "skill_score_history"
    __table_args__ = {"extend_existing": True}
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills_master.id"), nullable=False, index=True)
    
    # Score snapshot
    score_percentage = Column(Float, nullable=False)
    normalized_score = Column(Float, nullable=False)
    confidence_level = Column(SqEnum(ConfidenceLevel), nullable=False)
    
    # Timestamp
    recorded_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    
    # Relationships
    user = relationship("app.auth.models.User")
    skill = relationship("app.skills.models.SkillMaster")
