import os
import sys
from sqlalchemy import text
from dotenv import load_dotenv

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.database import SessionLocal

def check_specific_user(email):
    db = SessionLocal()
    try:
        print(f"--- Checking for User: {email} ---")
        sql = text("SELECT id, username, email FROM users WHERE email = :email")
        result = db.execute(sql, {"email": email})
        row = result.fetchone()
        if row:
            print(f"FOUND: ID: {row[0]}, Username: {row[1]}, Email: {row[2]}")
        else:
            print("NOT FOUND in database.")
        print("--- End ---")
    finally:
        db.close()

if __name__ == "__main__":
    check_specific_user("ommaheshwari1122@gmail.com")
