import os
import sys
from sqlalchemy import text
from dotenv import load_dotenv

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.database import SessionLocal, engine

def check_login_history():
    db = SessionLocal()
    try:
        print("--- Recent Login History ---")
        sql = text("""
            SELECT l.timestamp, u.username, l.ip_address, l.success 
            FROM login_history l
            LEFT JOIN users u ON l.user_id = u.id
            ORDER BY l.timestamp DESC
            LIMIT 10
        """)
        result = db.execute(sql)
        for row in result:
            print(f"Time: {row[0]}, Username: {row[1]}, IP: {row[2]}, Success: {row[3]}")
        print("--- End ---")
    finally:
        db.close()

if __name__ == "__main__":
    check_login_history()
