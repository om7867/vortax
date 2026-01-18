"""
Unified models entry point
Ensures all mappers are initialized in the correct order
"""
# Import Base first
from app.core.database import Base

# Import all models
from app.auth.models import User
from app.profile.models import UserProfile, ProfileCompletion
from app.skills.models import SkillMaster, UserSkillProfile
from app.assessments.models import SkillTest, TestQuestion, TestAttempt, SkillTestResult
from app.scoring.models import SkillScore, SkillScoreHistory
from app.gap_analysis.models import Role, RoleSkillRequirement, SkillGapResult, CareerReadinessSnapshot
from app.recommendations.models import LearningResource, Recommendation, UserLearningPlan, TrendingSkill, JobRole, UserLearningProgress
from app.audit.models import ProfileAuditLog

# All models are now registered with Base.metadata
