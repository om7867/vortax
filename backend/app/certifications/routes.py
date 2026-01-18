from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import SessionLocal
from app.core.deps import get_current_user
from app.certifications import services, schemas

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/my", response_model=List[schemas.CertificationOut])
def get_my_certifications(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return services.get_user_certifications(db, current_user.id)

@router.post("/add", response_model=schemas.CertificationOut)
def add_certification(
    cert_data: schemas.CertificationCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return services.add_certification(db, current_user.id, cert_data)
