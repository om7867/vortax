import psycopg2
import os
from dotenv import load_dotenv

def fix_schema():
    load_dotenv()
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not found")
        return

    # Convert to psycopg2 style if needed
    if db_url.startswith("postgresql+psycopg2://"):
        db_url = db_url.replace("postgresql+psycopg2://", "postgresql://")

    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cur = conn.cursor()
        
        print("Checking columns in profile_completion...")
        cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'profile_completion'")
        columns = [row[0] for row in cur.fetchall()]
        print(f"Existing columns: {columns}")
        
        if 'last_calculated_at' in columns and 'last_updated' not in columns:
            print("Renaming last_calculated_at to last_updated...")
            cur.execute("ALTER TABLE profile_completion RENAME COLUMN last_calculated_at TO last_updated")
            print("Successfully renamed column.")
        elif 'last_updated' in columns:
            print("Column 'last_updated' already exists.")
        else:
            print("Neither 'last_calculated_at' nor 'last_updated' found. Adding 'last_updated'...")
            cur.execute("ALTER TABLE profile_completion ADD COLUMN last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()")
            print("Successfully added column.")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_schema()
