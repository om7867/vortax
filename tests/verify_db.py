from sqlalchemy import create_engine, inspect
import sys
import os
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.core.database import SQLALCHEMY_DATABASE_URL

def verify_db():
    # Point to the correct database file depending on env
    # But now we should load from .env similarly to database.py
    load_dotenv(os.path.join(os.getcwd(), 'backend', '.env'))
    db_url = os.getenv("DATABASE_URL")
    
    # If using verify_db.py, we might need to adjust for local testing if env is not loaded 
    # But importing from app.core.database is cleaner if it handles it.
    # However, app.core.database uses relative imports which might fail if run from root?
    # Let's try importing engine directly if possible, or replicate logic.
    
    # Replicating logic for robust script independent of app:
    if not db_url:
        print("FAIL: DATABASE_URL not set in env.")
        sys.exit(1)
        
    print(f"Connecting to: {db_url}")
    
    engine = create_engine(db_url)
    inspector = inspect(engine)
    
    tables = inspector.get_table_names()
    print(f"Found tables: {tables}")
    
    required_tables = [
        "users", "skills", "careers", 
        "career_skill_requirements", "user_skills", 
        "recommendations", "ml_training_data"
    ]
    
    missing = [t for t in required_tables if t not in tables]
    
    if missing:
        print(f"FAIL: Missing tables: {missing}")
        sys.exit(1)
    else:
        print("SUCCESS: All required tables present.")
        
    # Check for data
    with engine.connect() as conn:
        from sqlalchemy import text
        user_count = conn.execute(text("SELECT COUNT(*) FROM users")).scalar()
        skill_count = conn.execute(text("SELECT COUNT(*) FROM skills")).scalar()
        career_count = conn.execute(text("SELECT COUNT(*) FROM careers")).scalar()
        
        print(f"Stats: Users={user_count}, Skills={skill_count}, Careers={career_count}")
        
        if user_count == 0 or skill_count == 0:
            print("WARN: Database tables exist but appear empty.")


if __name__ == "__main__":
    verify_db()
