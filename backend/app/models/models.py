"""
Shim for backward compatibility.
Redirects old model names to new unified models or provides stubs.
"""
import uuid
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base

# Aliases for new models
from app.auth.models import User as UserAuth
from app.skills.models import SkillMaster as Skill, UserSkillProfile as UserSkill, SkillCategory
from app.gap_analysis.models import Role as Career, RoleSkillRequirement as CareerSkillRequirement
from app.recommendations.models import LearningResource as Course, Recommendation, UserLearningPlan
from app.assessments.models import SkillTest as Assessment

User = UserAuth

class Project(Base):
    __tablename__ = "projects"
    __table_args__ = {"extend_existing": True}
    id = Column(Integer, primary_key=True)
    title = Column(String)
    skills_verified = Column(JSON)

class Job(Base):
    __tablename__ = "jobs"
    __table_args__ = {"extend_existing": True}
    id = Column(Integer, primary_key=True)
    title = Column(String)
    match_score = Column(Float)

class Certification(Base):
    __tablename__ = "certifications"
    __table_args__ = {"extend_existing": True}
    id = Column(Integer, primary_key=True)
    title = Column(String)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

class MLTrainingData(Base):
    __tablename__ = "ml_training_data"
    __table_args__ = {"extend_existing": True}
    id = Column(Integer, primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    feature_vector = Column(JSON)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    __table_args__ = {"extend_existing": True}
    id = Column(Integer, primary_key=True)
    action = Column(String)
    payload = Column(JSON)

# Achievement might also be used
class Achievement(Base):
    __tablename__ = "achievements"
    __table_args__ = {"extend_existing": True}
    id = Column(Integer, primary_key=True)
    title = Column(String)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
