"""
User API Routes.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash
from app.core.deps import get_current_user
from app.models.models import UserSkill, Skill
from app.auth.models import User
from app.schemas.schemas import UserResponse, UserSkillAdd, UserSkillResponse, UserLogin, Token

router = APIRouter()

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """Login and get access token."""
    user = db.query(User).filter(User.username == login_data.username).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.username})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "username": user.username,
        "role": user.role # Extra field not in Token schema? Schema has it!
    }

@router.get("/profile", response_model=UserResponse)
def get_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return current_user

@router.get("/skills", response_model=list[UserSkillResponse])
def get_my_skills(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get logged-in user's skills."""
    return [
        UserSkillResponse(
            id=us.id,
            skill_name=us.skill.name,
            category=us.skill.category,
            proficiency_level=us.proficiency_level
        )
        for us in current_user.user_skills
    ]

@router.post("/skills")
def add_user_skill(skill_data: UserSkillAdd, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Add or update a skill for the user."""
    # Check if skill exists
    skill = db.query(Skill).get(skill_data.skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    existing = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id,
        UserSkill.skill_id == skill_data.skill_id
    ).first()

    if existing:
        existing.proficiency_level = skill_data.proficiency_level
        db.commit()
        return {"msg": "Skill updated"}
    
    new_skill = UserSkill(
        user_id=current_user.id,
        skill_id=skill_data.skill_id,
        proficiency_level=skill_data.proficiency_level
    )
    db.add(new_skill)
    db.commit()
    return {"msg": "Skill added"}
