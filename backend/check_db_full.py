from app.core.database import engine
from sqlalchemy import text

def check_db_full():
    with engine.connect() as conn:
        cols = conn.execute(text("SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_name = 'skills_master'")).fetchall()
        for col in cols:
            print(f"Column: {col[0]}, Type: {col[1]}, UDT: {col[2]}")
        
        # Check Enums
        enums = conn.execute(text("SELECT n.nspname as schema, t.typname as type, e.enumlabel as label FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace")).fetchall()
        print(f"Enums: {enums}")

if __name__ == "__main__":
    check_db_full()
