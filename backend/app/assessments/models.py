import uuid
import enum
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Enum as SqEnum, JSON, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class TestStatus(str, enum.Enum):
    CREATED = "created"
    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    EVALUATED = "evaluated"
    TIMEOUT = "timeout"

class ConfidenceLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class SkillTest(Base):
    __tablename__ = "skill_tests"
    __table_args__ = {"extend_existing": True}
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    domain = Column(String, nullable=False)
    target_role = Column(String, nullable=False)
    status = Column(SqEnum(TestStatus), default=TestStatus.CREATED, nullable=False)
    total_questions = Column(Integer, default=25, nullable=False)
    total_score = Column(Float, default=0.0) # Final normalized score
    started_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    
    questions = relationship("TestQuestion", back_populates="test", cascade="all, delete-orphan")
    attempts = relationship("TestAttempt", back_populates="test", cascade="all, delete-orphan")
    results = relationship("SkillTestResult", back_populates="test", cascade="all, delete-orphan")

class TestQuestion(Base):
    __tablename__ = "test_questions"
    __table_args__ = {"extend_existing": True}
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    test_id = Column(UUID(as_uuid=True), ForeignKey("skill_tests.id"), nullable=False, index=True)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills_master.id"), nullable=False)
    
    question_text = Column(String, nullable=False)
    options = Column(JSON, nullable=False) # Array of 4 strings
    correct_option_index = Column(Integer, nullable=False) # 0-3
    difficulty = Column(Integer, nullable=False) # 1-5
    ai_generated = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    test = relationship("SkillTest", back_populates="questions")
    skill = relationship("app.skills.models.SkillMaster")

class TestAttempt(Base):
    __tablename__ = "test_attempts"
    __table_args__ = {"extend_existing": True}
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    test_id = Column(UUID(as_uuid=True), ForeignKey("skill_tests.id"), nullable=False, index=True)
    question_id = Column(UUID(as_uuid=True), ForeignKey("test_questions.id"), nullable=False)
    
    selected_option_index = Column(Integer, nullable=False)
    is_correct = Column(Boolean, default=False, nullable=False)
    answered_at = Column(DateTime(timezone=True), server_default=func.now())
    
    test = relationship("SkillTest", back_populates="attempts")
    question = relationship("TestQuestion")

class SkillTestResult(Base):
    __tablename__ = "skill_test_results"
    __table_args__ = {"extend_existing": True}
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    test_id = Column(UUID(as_uuid=True), ForeignKey("skill_tests.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills_master.id"), nullable=False)
    
    score_percentage = Column(Float, nullable=False)
    confidence_level = Column(SqEnum(ConfidenceLevel), nullable=False)
    evaluated_at = Column(DateTime(timezone=True), server_default=func.now())
    
    test = relationship("SkillTest", back_populates="results")
    skill = relationship("app.skills.models.SkillMaster")
