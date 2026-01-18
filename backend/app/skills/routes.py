from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import SessionLocal
from app.core.deps import get_current_user
from app.skills import services, schemas

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/available", response_model=List[schemas.SkillMasterOut])
def get_available_skills(
    domain: str = None,
    db: Session = Depends(get_db)
):
    return services.get_available_skills(db, domain)

@router.get("/my", response_model=List[schemas.UserSkillOut])
def get_my_skills(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return services.get_user_skills(db, current_user.id)

@router.post("/add", response_model=schemas.UserSkillOut)
def add_skill(
    skill_data: schemas.UserSkillAdd,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return services.add_user_skill(db, current_user.id, skill_data)

@router.delete("/{id}")
def delete_skill(
    id: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success = services.remove_user_skill(db, current_user.id, id)
    if not success:
        raise HTTPException(status_code=404, detail="Skill not found in your profile")
    return {"message": "Skill removed successfully"}
