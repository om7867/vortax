import uuid
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Enum as SqEnum, JSON, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base

class UserRole(str, enum.Enum):
    USER = "USER"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = "users"
    __table_args__ = {"extend_existing": True}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    role = Column(SqEnum(UserRole), default=UserRole.USER, nullable=False)
    
    # AgriNova Fields
    target_domain = Column(String, default="Agriculture", nullable=True)
    career_goals = Column(JSON, nullable=True)
    
    # Post-Assessment Flow Fields
    assessment_completed = Column(Boolean, default=False)
    analysis_viewed = Column(Boolean, default=False)
    analysis_generated = Column(Boolean, default=False)
    last_analysis_at = Column(DateTime(timezone=True), nullable=True)
    readiness_percentage = Column(Float, default=0.0)
    latest_assessment_id = Column(UUID(as_uuid=True), nullable=True)
    latest_assessment_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Password Reset Fields
    reset_token = Column(String(255), nullable=True, index=True)
    reset_token_expiry = Column(DateTime(timezone=True), nullable=True)

    # Relationships (Using string references to avoid circular imports during definition)
    # We will define back_populates in other files or use string references here
    login_history = relationship("LoginHistory", back_populates="user", cascade="all, delete-orphan")
    
    # Other relationships will be added via back_populates in their respective models
    # e.g. skills_created, user_skills, etc.

class LoginHistory(Base):
    __tablename__ = "login_history"
    __table_args__ = {"extend_existing": True}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    success = Column(Boolean, default=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="login_history")
