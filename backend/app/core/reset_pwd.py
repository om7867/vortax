import os
import sys
from sqlalchemy.orm import Session
from dotenv import load_dotenv

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.database import SessionLocal, engine
from app.auth.models import User
from app.core.security import get_password_hash

def reset_password(username, new_password):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        if not user:
             user = db.query(User).filter(User.email == username).first()
        
        if user:
            print(f"Resetting password for {user.username}...")
            user.hashed_password = get_password_hash(new_password)
            db.commit()
            print("Successfully updated password!")
        else:
            print(f"User {username} not found.")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python backend/app/core/reset_pwd.py <username/email> <new_password>")
    else:
        reset_password(sys.argv[1], sys.argv[2])
