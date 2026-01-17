from sqlalchemy.orm import Session
from app.models.models import AuditLog
from fastapi import Request
import json
import logging

def create_audit_log(
    db: Session,
    action: str,
    user_id: int = None,
    entity: str = None,
    entity_id: int = None,
    payload: dict = None,
    ip_address: str = None
):
    try:
        log_entry = AuditLog(
            user_id=user_id,
            action=action,
            entity=entity,
            entity_id=entity_id,
            payload=payload,
            ip_address=ip_address
        )
        db.add(log_entry)
        db.commit()
    except Exception as e:
        logging.error(f"Failed to create audit log: {e}")
        db.rollback()

def log_action(
    db: Session, 
    user_id: str, 
    action: str, 
    entity: str = None, 
    entity_id: int = None,
    detail: dict = None
):
    """Simple wrapper for business logic logging"""
    create_audit_log(
        db=db,
        user_id=user_id,
        action=action,
        entity=entity,
        entity_id=entity_id,
        payload=detail
    )
