import os
import sys
from sqlalchemy import text
from dotenv import load_dotenv

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.database import SessionLocal, engine

def sync_schema():
    db = SessionLocal()
    try:
        print("--- Checking and Syncing User Schema ---")
        
        # Check if columns exist
        check_sql = text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name IN ('reset_token', 'reset_token_expiry')
        """)
        result = db.execute(check_sql)
        existing_cols = [row[0] for row in result]
        
        if 'reset_token' not in existing_cols:
            print("Adding column: reset_token")
            db.execute(text("ALTER TABLE users ADD COLUMN reset_token VARCHAR(255)"))
        
        if 'reset_token_expiry' not in existing_cols:
            print("Adding column: reset_token_expiry")
            db.execute(text("ALTER TABLE users ADD COLUMN reset_token_expiry TIMESTAMP WITH TIME ZONE"))
            
        db.commit()
        print("Schema sync complete!")
        print("--- End ---")
    finally:
        db.close()

if __name__ == "__main__":
    sync_schema()
