import requests
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.auth.models import User, LoginHistory
import sys

BASE_URL = "http://localhost:8000"

def verify_auth():
    print("🔐 Verifying Auth Module V2...")
    
    # 1. Signup
    signup_data = {
        "username": "testuser_uuid",
        "email": "uuid@test.com",
        "password": "password123",
        "full_name": "Test UUID User"
    }
    try:
        r = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
        if r.status_code == 200:
            print("✅ Signup Successful")
            tokens = r.json()
            print(f"   Token: {tokens.get('access_token')[:20]}...")
            
            # Check Cookie
            if "access_token" in r.cookies:
                print("✅ HttpOnly Cookie Set (Signup)")
            else:
                 print("⚠️  No Cookie in Signup response (Check backend)")
        elif r.status_code == 400:
             print("ℹ️  User already exists (Skipping signup)")
        else:
            print(f"❌ Signup Failed: {r.text}")
            return
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return

    # 2. Login
    login_data = {
        "username": "testuser_uuid",
        "password": "password123"
    }
    r = requests.post(f"{BASE_URL}/auth/login", data=login_data)
    if r.status_code == 200:
        print("✅ Login Successful")
        
        # Check Cookie
        cookie = r.cookies.get("access_token")
        if cookie:
            print(f"✅ HttpOnly Cookie Found: {cookie[:20]}...")
        else:
            print("❌ HttpOnly Cookie MISSING in Login Response")
        
        # 2.5 Verify Token with Protected Route
        print("\n🔍 Verifying Token Validity via /auth/me...")
        # Use the access token from body or cookie?
        # The script gets token from body JSON
        token_val = r.json().get("access_token")
        headers = {"Authorization": f"Bearer {token_val}"}
        
        r_me = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        if r_me.status_code == 200:
            print(f"✅ /auth/me Successful: {r_me.json()['username']}")
        else:
            print(f"❌ /auth/me Failed: {r_me.status_code} - {r_me.text}")
            
    else:
        print(f"❌ Login Failed: {r.text}")
        return

    # 3. Verify DB Records
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == "testuser_uuid").first()
        if user:
            print(f"✅ User Found in DB: ID={user.id} (Type: {type(user.id)})")
            
            # Check History
            history = db.query(LoginHistory).filter(LoginHistory.user_id == user.id).all()
            print(f"✅ Login History Records: {len(history)}")
            for h in history:
                print(f"   - {h.timestamp} | IP: {h.ip_address} | Success: {h.success}")
        else:
            print("❌ User NOT found in DB")
    finally:
        db.close()

if __name__ == "__main__":
    verify_auth()
