import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def verify_dashboard():
    print("🔍 Testing Data-Driven Dashboard Endpoints...")
    
    # 1. Login
    login_data = {"username": "admin", "password": "admin123"}
    try:
        r = requests.post(f"{BASE_URL}/auth/login", data=login_data)
        if r.status_code != 200:
            print(f"❌ Login Failed: {r.status_code} - {r.text}")
            return
        token = r.json().get("access_token")
        print(f"✅ Login Success.")
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return

    headers = {"Authorization": f"Bearer {token}"}
    
    endpoints = [
        "/dashboard/ai-insight",
        "/skillpath/high-impact-skills",
        "/skillpath/gap-analysis",
        "/skillpath/timeline",
        "/skillpath/recommendations/smart"
    ]
    
    for ep in endpoints:
        print(f"   Test {ep}...", end="")
        try:
            r = requests.get(f"{BASE_URL}{ep}", headers=headers)
            if r.status_code == 200:
                print("✅ OK")
            else:
                print(f"❌ Failed ({r.status_code})")
                print(r.text)
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    verify_dashboard()
