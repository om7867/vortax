import os
import sys
from dotenv import load_dotenv

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.database import SessionLocal
from app.auth.services import authenticate_user
from fastapi import Request

def test_manual_auth(username, password):
    db = SessionLocal()
    try:
        print(f"Testing Auth for: {username}")
        # Dummy request
        user = authenticate_user(db, username, password)
        if user:
            print(f"SUCCESS: Authenticated as {user.username}")
        else:
            print(f"FAILED: Could not authenticate {username}")
    finally:
        db.close()

if __name__ == "__main__":
    test_manual_auth("OM11dada", "password123")
    test_manual_auth("OM11dada", "Password123") # Case check
    test_manual_auth("ommaheshwari1122@gmail.com", "password123") # Email check
