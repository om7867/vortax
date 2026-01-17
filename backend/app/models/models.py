"""
Database Models for Holistic Agriculture Skill Intelligence System.
Strict implementation of normalized schema.
"""
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum as SqEnum, JSON, DateTime, UniqueConstraint, Float, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import enum
from app.core.database import Base
from app.auth.models import User # Import User from new module

# Enums
class SkillCategory(str, enum.Enum):
    SOIL = "Soil"
    CROP = "Crop"
    TECHNOLOGY = "Technology"
    BUSINESS = "Business"

# 2. Skills Table
class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    category = Column(SqEnum(SkillCategory), nullable=False)
    description = Column(Text)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id")) # UUID FK
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    # User.skills_created needs to be defined in auth/models or via backref here.
    # Since User is in another file, we use primaryjoin or string reference carefully.
    creator = relationship("User", backref="skills_created") 
    career_requirements = relationship("CareerSkillRequirement", back_populates="skill")
    user_skills = relationship("UserSkill", back_populates="skill")

# 3. Careers Table
class Career(Base):
    __tablename__ = "careers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text)
    domain = Column(String, default="AGRICULTURE", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    skill_requirements = relationship("CareerSkillRequirement", back_populates="career")
    recommendations = relationship("Recommendation", back_populates="career")
    training_data = relationship("MLTrainingData", back_populates="career")

# 4. Career Skill Requirements Table
class CareerSkillRequirement(Base):
    __tablename__ = "career_skill_requirements"

    id = Column(Integer, primary_key=True, index=True)
    career_id = Column(Integer, ForeignKey("careers.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    required_level = Column(Integer, nullable=False) # 1-10

    # Relationships
    career = relationship("Career", back_populates="skill_requirements")
    skill = relationship("Skill", back_populates="career_requirements")

    # Constraints
    __table_args__ = (UniqueConstraint('career_id', 'skill_id', name='_career_skill_uc'),)

# 5. User Skills Table
class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False) # UUID FK
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    proficiency_level = Column(Integer, nullable=False) # 1-10
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="user_skills")
    skill = relationship("Skill", back_populates="user_skills")

    # Constraints
    __table_args__ = (UniqueConstraint('user_id', 'skill_id', name='_user_skill_uc'),)

    # New Verification Fields
    verified = Column(Boolean, default=False)
    evidence = Column(JSON, nullable=True) # links to projects/certs

# 6. Recommendations Table
class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False) # UUID FK
    career_id = Column(Integer, ForeignKey("careers.id"), nullable=False)
    match_score = Column(Float, nullable=False)
    readiness_status = Column(String, nullable=False) # Ready, Near Ready, Developing
    ml_confidence = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", backref="recommendations")
    career = relationship("Career", back_populates="recommendations")

# 7. ML Training Data Table
class MLTrainingData(Base):
    __tablename__ = "ml_training_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False) # UUID FK
    feature_vector = Column(JSON, nullable=False)
    label_career_id = Column(Integer, ForeignKey("careers.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", backref="training_data")
    career = relationship("Career", back_populates="training_data")

# 8. Audit Logs Table
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True) # UUID FK
    action = Column(String, nullable=False, index=True)
    entity = Column(String, nullable=True) # e.g., "Skill", "User"
    entity_id = Column(Integer, nullable=True)
    payload = Column(JSON, nullable=True)
    ip_address = Column(String, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", backref="audit_logs")

# 9. Courses Table
class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    provider = Column(String, nullable=False) # e.g. Coursera, Udemy
    difficulty = Column(String, nullable=False) # Beginner, Intermediate, Advanced
    skills_gained = Column(JSON, nullable=False) # ["Python", "Data Analysis"]
    url = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# 10. Projects Table
class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String, nullable=False)
    skills_verified = Column(JSON, nullable=False) # ["Python", "FASTAPI"]
    image_url = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# 11. Assessments Table
class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    title = Column(String, nullable=False)
    question_bank = Column(JSON, nullable=False) # List of {question, options, answer}
    passing_score = Column(Integer, default=70)
    
    skill = relationship("Skill")

# 12. Jobs Table
class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    location = Column(String, nullable=False)
    skills_required = Column(JSON, nullable=False) # ["Python", "AgriTech"]
    match_score = Column(Float, default=0.0) # Calculated dynamically usually, but stored for listing 
    posted_at = Column(DateTime(timezone=True), server_default=func.now())
    apply_url = Column(String, nullable=True)

# 13. Certifications Table (New)
class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False) # UUID
    title = Column(String, nullable=False)
    issuer = Column(String, nullable=False)
    date_earned = Column(DateTime(timezone=True), nullable=True)
    url = Column(String, nullable=True)
    
    # Relationship
    user = relationship("User", backref="certifications")

# 14. Achievements Table (New)
class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False) # UUID
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    date_earned = Column(DateTime(timezone=True), server_default=func.now())
    badge_icon = Column(String, default="award") # lucide icon name
    
    # Relationship
    user = relationship("User", backref="achievements")
