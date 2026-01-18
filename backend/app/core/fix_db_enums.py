"""
Definitive Database Enum Fix
Standardizes all Postgres Enum labels to lowercase to match the Python models.
"""
import os
import sys
from sqlalchemy import text
from dotenv import load_dotenv

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.database import engine

def fix_enums():
    # Mapping of enum type to labels that need lowercasing
    enum_labels = {
        "educationlevel": ["SECONDARY", "DIPLOMA", "ASSOCIATE", "BACHELOR", "MASTER", "PHD", "POST_GRAD", "SPECIALIZED"],
        "domaininterest": ["HEALTHCARE", "AGRICULTURE", "URBAN", "COMMON", "TECHNOLOGY", "FINANCE", "EDUCATION"],
        "experiencelevel": ["ENTRY", "BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"],
        "skilldomain": ["HEALTHCARE", "AGRICULTURE", "URBAN", "COMMON", "TECHNOLOGY", "FINANCE", "EDUCATION"],
        "skillcategory": ["TECHNICAL", "ANALYTICAL", "SOFT"],
        "skillsource": ["MANUAL", "TEST", "PROJECT", "CERTIFICATION"]
    }

    print("--- Starting Comprehensive Enum Normalization ---")
    
    with engine.connect() as conn:
        # 1. Lowercase existing labels
        for enum_type, labels in enum_labels.items():
            print(f"Normalizing type: {enum_type}...")
            for label in labels:
                try:
                    # Rename uppercase to lowercase if it exists
                    # We use a subquery to check if the label exists before renaming
                    sql = text(f"""
                        DO $$
                        BEGIN
                            IF EXISTS (
                                SELECT 1 FROM pg_enum e 
                                JOIN pg_type t ON t.oid = e.enumtypid 
                                WHERE t.typname = '{enum_type}' AND e.enumlabel = '{label}'
                            ) THEN
                                ALTER TYPE {enum_type} RENAME VALUE '{label}' TO '{label.lower()}';
                            END IF;
                        END
                        $$;
                    """)
                    conn.execute(sql)
                    print(f"  v Lowercased '{label}'")
                except Exception as e:
                    # Likely already exists as lowercase or other constraint
                    print(f"  ! Skip '{label}': {e}")
        
        # 2. Add missing lowercase labels just in case
        extra_missing = {
            "educationlevel": ["secondary", "diploma", "associate", "bachelor", "master", "phd", "post_grad", "specialized"],
            "domaininterest": ["healthcare", "agriculture", "urban", "technology", "finance", "education", "common"],
            "experiencelevel": ["entry", "beginner", "intermediate", "advanced", "expert"],
            "skilldomain": ["healthcare", "agriculture", "urban", "technology", "finance", "education", "common"]
        }
        
        for enum_type, values in extra_missing.items():
            for value in values:
                try:
                    sql = text(f"ALTER TYPE {enum_type} ADD VALUE IF NOT EXISTS '{value}'")
                    conn.execute(sql)
                    print(f"  + Ensured '{value}' exists in {enum_type}")
                except Exception as e:
                    pass

        conn.commit()
    
    print("--- Normalization Complete ---")

if __name__ == "__main__":
    fix_enums()
