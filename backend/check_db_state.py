from app.core.database import engine
from sqlalchemy import text

def check_db():
    with engine.connect() as conn:
        # Check tables
        tables = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")).fetchall()
        print(f"Tables: {[t[0] for t in tables]}")
        
        # Check skills_master columns
        if 'skills_master' in [t[0] for t in tables]:
            cols = conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'skills_master'")).fetchall()
            print(f"SkillsMaster columns: {cols}")
            
            rows = conn.execute(text("SELECT * FROM skills_master LIMIT 5")).fetchall()
            print(f"SkillsMaster row sample: {rows}")

if __name__ == "__main__":
    check_db()
