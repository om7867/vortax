from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.security import SECRET_KEY, ALGORITHM
from app.auth.models import User
from app.auth.schemas import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        print(f"DEBUG: Token received: {token[:10]}...")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"DEBUG: Decoded Payload: {payload}")
        user_id: str = payload.get("sub")
        if user_id is None:
            print("DEBUG: No 'sub' in payload")
            raise credentials_exception
    except JWTError as e:
        print(f"DEBUG: JWT Decode Error: {e}")
        raise credentials_exception
    
    print(f"DEBUG: Querying User ID: {user_id}")
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        print("DEBUG: User not found in DB")
        raise credentials_exception
    print(f"DEBUG: User found: {user.username}")
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    # Add active check if needed
    return current_user

async def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user
