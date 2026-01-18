from sqlalchemy.orm import Session
from app.certifications.models import CertificationRecord
from app.certifications.schemas import CertificationCreate
from app.profile.completion_engine import ProfileCompletionService
from app.audit.services import AuditService

def get_user_certifications(db: Session, user_id: str):
    return db.query(CertificationRecord).filter(CertificationRecord.user_id == user_id).all()

def add_certification(db: Session, user_id: str, cert_data: CertificationCreate):
    cert = CertificationRecord(
        user_id=user_id,
        **cert_data.model_dump()
    )
    db.add(cert)
    db.commit()
    db.refresh(cert)
    
    # Audit
    AuditService.log_action(db, user_id, "certification_added", "CertificationRecord", cert.id, cert_data.model_dump())
    
    # Recalculate completion
    ProfileCompletionService.calculate_score(db, user_id)
    
    return cert
