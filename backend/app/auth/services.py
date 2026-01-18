from sqlalchemy.orm import Session
from app.auth.models import User, LoginHistory
from app.auth.schemas import UserCreate
from app.core.security import get_password_hash, verify_password
from fastapi import Request
import secrets
from datetime import datetime, timedelta
from app.core.mailer import send_reset_password_email

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: UserCreate):
    hashed_pass = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        target_domain=user.target_domain,
        hashed_password=hashed_pass,
        career_goals=user.career_goals
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, username_or_email: str, password: str, request: Request = None):
    # Try username first
    user = get_user_by_username(db, username_or_email)
    if not user:
        # Try email
        user = get_user_by_email(db, username_or_email)
    
    success = False
    if user and verify_password(password, user.hashed_password):
        success = True
    
    # Log History
    if request and user: # If user found, log attempt against that user 
         # (If user not found, we can't log against a user_id, 
         # unless we want to log 'failed login' for unknown user, but schema requires user_id)
         # Requirement says "Every login attempt must be logged". 
         # If user doesn't exist, we skip or handle differently. Here we log if user exists.
         log = LoginHistory(
             user_id=user.id,
             ip_address=request.client.host if request.client else None,
             user_agent=request.headers.get("user-agent"),
             success=success
         )
         db.add(log)
         db.commit()

    if success:
        return user
    return None

def create_password_reset_token(db: Session, email: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    
    token = secrets.token_urlsafe(32)
    user.reset_token = token
    user.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
    db.commit()
    
    # Send actual email
    send_reset_password_email(email, token)
    
    return token

def reset_password(db: Session, token: str, new_password: str):
    user = db.query(User).filter(
        User.reset_token == token,
        User.reset_token_expiry > datetime.utcnow()
    ).first()
    
    if not user:
        return False
    
    user.hashed_password = get_password_hash(new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.commit()
    return True
