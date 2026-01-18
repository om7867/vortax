import os
import sys
from sqlalchemy import text
from dotenv import load_dotenv

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.database import engine

def inspect_enums():
    """Query Postgres to see the actual values defined in custom Enum types"""
    enum_types = ["educationlevel", "domaininterest", "experiencelevel", "skilldomain", "skillcategory", "skillsource"]
    
    print("--- Database Enum Inspection ---")
    
    with engine.connect() as conn:
        for enum_type in enum_types:
            try:
                # Query to get values for a specific enum type in Postgres
                sql = text(f"""
                    SELECT e.enumlabel
                    FROM pg_type t 
                    JOIN pg_enum e ON t.oid = e.enumtypid  
                    WHERE t.typname = '{enum_type}'
                    ORDER BY e.enumsortorder;
                """)
                result = conn.execute(sql)
                values = [row[0] for row in result]
                print(f"{enum_type}: {values}")
            except Exception as e:
                print(f"{enum_type}: Error or type does not exist - {e}")
    
    print("--- End Inspection ---")

if __name__ == "__main__":
    inspect_enums()
