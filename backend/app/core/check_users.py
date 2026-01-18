import os
import sys
from sqlalchemy import text
from dotenv import load_dotenv

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.database import SessionLocal, engine

def check_users():
    db = SessionLocal()
    try:
        print("--- User Accounts in Database ---")
        sql = text("SELECT id, username, email, full_name, role FROM users")
        result = db.execute(sql)
        for row in result:
            print(f"ID: {row[0]}, Username: {row[1]}, Email: {row[2]}, Name: {row[3]}, Role: {row[4]}")
        print("--- End ---")
    finally:
        db.close()

if __name__ == "__main__":
    check_users()
