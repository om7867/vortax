import os
import sys
from sqlalchemy import text
from dotenv import load_dotenv

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.database import SessionLocal

def audit_auth_state():
    db = SessionLocal()
    try:
        print("--- Auth System Audit ---")
        
        # 1. Check Users
        print("\n[Users]")
        sql_users = text("SELECT id, username, email, hashed_password, role FROM users")
        users = db.execute(sql_users).fetchall()
        for u in users:
            # Mask part of the hash for privacy but show prefix
            hash_preview = f"{u[3][:10]}..." if u[3] else "EMPTY"
            print(f"User: {u[1]}, Email: {u[2]}, Role: {u[4]}, Hash: {hash_preview}")
        
        # 2. Check Login History
        print("\n[Recent Login Attempts]")
        sql_history = text("""
            SELECT l.timestamp, u.username, l.ip_address, l.success, l.user_agent 
            FROM login_history l
            LEFT JOIN users u ON l.user_id = u.id
            ORDER BY l.timestamp DESC
            LIMIT 5
        """)
        history = db.execute(sql_history).fetchall()
        for h in history:
            print(f"Time: {h[0]}, User: {h[1]}, Success: {h[3]}, IP: {h[2]}")
            
        print("\n--- Audit Complete ---")
    finally:
        db.close()

if __name__ == "__main__":
    audit_auth_state()
