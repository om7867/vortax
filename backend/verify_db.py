
from app.core.database import engine
from sqlalchemy import inspect
import sys

def check_columns():
    inspector = inspect(engine)
    columns = [c['name'] for c in inspector.get_columns('users')]
    required = ['assessment_completed', 'analysis_viewed', 'latest_assessment_id', 'latest_assessment_at']
    missing = [r for r in required if r not in columns]
    
    if not missing:
        print("SUCCESS: All columns found.")
    else:
        print(f"MISSING: {missing}")
        # Try to add missing columns if they are missing
        # This is a bit risky but helped since create_all doesn't update
        from sqlalchemy import text
        with engine.connect() as conn:
            for col in missing:
                try:
                    if col == 'assessment_completed' or col == 'analysis_viewed':
                        conn.execute(text(f"ALTER TABLE users ADD COLUMN {col} BOOLEAN DEFAULT FALSE"))
                    elif col == 'latest_assessment_id':
                        conn.execute(text(f"ALTER TABLE users ADD COLUMN {col} UUID"))
                    elif col == 'latest_assessment_at':
                        conn.execute(text(f"ALTER TABLE users ADD COLUMN {col} TIMESTAMP WITH TIME ZONE"))
                    print(f"Added column: {col}")
                except Exception as e:
                    print(f"Error adding {col}: {e}")
            conn.commit()

if __name__ == "__main__":
    try:
        check_columns()
    except Exception as e:
        print(f"Script error: {e}")
