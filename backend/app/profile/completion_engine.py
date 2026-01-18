from sqlalchemy.orm import Session
from sqlalchemy import func
from app.profile.models import UserProfile, ProfileCompletion
from app.skills.models import UserSkillProfile
from app.certifications.models import CertificationRecord
import json
from datetime import datetime

class ProfileCompletionService:
    @staticmethod
    def calculate_score(db: Session, user_id: str):
        """
        Calculate profile completion score based on business rules:
        - Basic Profile (full_name, education, field) -> 30%
        - Skill Inventory (>= 5 skills) -> 40%
        - Certifications (>= 1 certificate) -> 20%
        - Professional Intent (domain + role) -> 10%
        """
        score = 0
        missing = []
        
        # 1. Basic Profile (30%)
        profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if profile and profile.full_name and profile.education_level and profile.field_of_study:
            score += 30
        else:
            missing.append("basic_profile")
            
        # 2. Professional Intent (10%)
        if profile and profile.domain_interest and profile.target_role:
            score += 10
        else:
            missing.append("intent_panel")
            
        # 3. Skill Inventory (40% - needs >= 5 skills)
        skill_count = db.query(UserSkillProfile).filter(UserSkillProfile.user_id == user_id).count()
        if skill_count >= 5:
            score += 40
        else:
            missing.append(f"skills_need_{5 - skill_count}_more")
            
        # 4. Certifications (20% - needs >= 1)
        cert_count = db.query(CertificationRecord).filter(CertificationRecord.user_id == user_id).count()
        if cert_count >= 1:
            score += 20
        else:
            missing.append("certifications")
            
        # Update or Create Completion Record
        try:
            completion = db.query(ProfileCompletion).filter(ProfileCompletion.user_id == user_id).first()
            if not completion:
                completion = ProfileCompletion(user_id=user_id)
                db.add(completion)
                
            completion.profile_score = score
            completion.missing_sections = missing
            db.commit()
            db.refresh(completion)
            return completion
        except Exception as e:
            db.rollback()
            raise e
