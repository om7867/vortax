from app.core.database import engine
from sqlalchemy import text

def list_all_enums():
    with engine.connect() as conn:
        enums = conn.execute(text("SELECT t.typname as type, e.enumlabel as label FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid")).fetchall()
        for e in enums:
            print(f"Type: {e[0]}, Label: {e[1]}")

if __name__ == "__main__":
    list_all_enums()
