import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class ProfileAuditLog(Base):
    """
    Profile Audit Log
    
    Tracks all profile-related actions for security and auditing.
    """
    __tablename__ = "profile_audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    actor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    action = Column(String(100), nullable=False, index=True)  # e.g., "skill_added"
    entity_type = Column(String(50), nullable=False)  # e.g., "UserSkillProfile"
    entity_id = Column(UUID(as_uuid=True), nullable=True)
    changes = Column(JSON, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    
    actor = relationship("User", backref="audit_actions")
