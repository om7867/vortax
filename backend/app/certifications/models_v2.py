import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SqEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
from app.skills.models_v2 import SkillDomain

class CertificationRecord(Base):
    """
    Certifications Table
    
    Stores user certifications with verification metadata.
    """
    __tablename__ = "certification_records"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    issuing_organization = Column(String(255), nullable=False)
    credential_id = Column(String(255), nullable=True)
    issue_date = Column(DateTime(timezone=True), nullable=False)
    expiry_date = Column(DateTime(timezone=True), nullable=True)
    verification_url = Column(String(500), nullable=True)
    domain = Column(SqEnum(SkillDomain, values_callable=lambda x: [e.value for e in x]), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    user = relationship("User", backref="certifications")
