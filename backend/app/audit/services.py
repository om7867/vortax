from sqlalchemy.orm import Session
from app.audit.models import ProfileAuditLog
import uuid

class AuditService:
    @staticmethod
    def log_action(db: Session, actor_id: str, action: str, entity_type: str, entity_id: str = None, changes: dict = None, **kwargs):
        """
        Log a profile-related action to the audit trail.
        Supports both 'changes' and 'metadata' for backward compatibility.
        """
        audit_data = changes or kwargs.get('metadata')
        
        # Ensure IDs are UUID objects if they are strings
        if isinstance(actor_id, str):
            try:
                actor_id = uuid.UUID(actor_id)
            except ValueError:
                pass
        
        if isinstance(entity_id, str):
            try:
                entity_id = uuid.UUID(entity_id)
            except ValueError:
                pass

        log_entry = ProfileAuditLog(
            actor_id=actor_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            changes=audit_data
        )
        db.add(log_entry)
        db.commit()
        return log_entry
