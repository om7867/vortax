from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.core.deps import get_db
from app.auth.services import (
    create_user, authenticate_user, get_user_by_username, 
    get_user_by_email, create_password_reset_token, reset_password as reset_password_svc
)
from app.auth.schemas import UserCreate, Token, UserOut, ForgotPasswordRequest, ResetPasswordRequest
from app.core.security import create_access_token
from app.auth.models import User
from app.core.security import ALGORITHM, SECRET_KEY
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Helper to get current user from token (Duplicated from deps temporarily to break circular dependency refactor)
# Ideally this moves to a shared location, but for now logic is here.
# Actually, let's use the one in deps, but deps needs to import User from auth.models
# We will fix deps imports later.

@router.post("/signup", response_model=Token)
def signup(user: UserCreate, response: Response, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_username = get_user_by_username(db, user.username)
    if db_username:
         raise HTTPException(status_code=400, detail="Username already taken")

    new_user = create_user(db, user)
    
    access_token = create_access_token(subject=str(new_user.id)) # Use UUID as subject
    
    # Set HttpOnly Cookie
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        # secure=True, # Enable in HTTPS
        samesite="lax"
    )
    
    return {"access_token": access_token, "token_type": "bearer", "role": new_user.role}

@router.post("/login", response_model=Token)
def login(response: Response, request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password, request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(subject=str(user.id))
    
    # Set HttpOnly Cookie
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        # secure=True, 
        samesite="lax"
    )
    
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserOut)
def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # Basic inline validation for speed, should be in deps
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
             raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    user = db.query(User).filter(User.id == user_id).first() # UUID match
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    # We return 200 even if email not found for security (prevent email enumeration)
    create_password_reset_token(db, request.email)
    return {"message": "If an account exists with this email, a reset link has been generated."}

@router.post("/reset-password")
def reset_user_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    success = reset_password_svc(db, request.token, request.new_password)
    if not success:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    return {"message": "Password updated successfully"}
