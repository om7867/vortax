
from app.core.database import engine
from sqlalchemy import text

def update_db():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS analysis_generated BOOLEAN DEFAULT FALSE"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS last_analysis_at TIMESTAMP WITH TIME ZONE"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS readiness_percentage FLOAT DEFAULT 0.0"))
            conn.commit()
            print("Successfully updated users table.")
        except Exception as e:
            print(f"Error updating table: {e}")

if __name__ == "__main__":
    update_db()
