import traceback
from app.core.database import engine, Base
from app.auth.models import User
from app.profile.models import UserProfile
from app.skills.models import SkillMaster, UserSkillProfile
from app.scoring.models import SkillScore
from app.gap_analysis.models import SkillGapResult
from app.recommendations.models import LearningResource

try:
    print("Initializing mappers...")
    from sqlalchemy.orm import configure_mappers
    configure_mappers()
    print("Mappers initialized successfully!")
except Exception as e:
    print("Error during mapper initialization:")
    traceback.print_exc()
