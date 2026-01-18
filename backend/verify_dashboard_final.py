import requests
import json

BASE_URL = "http://127.0.0.1:8000"
EMAIL = "ommaheshwari1122@gmail.com"
PASSWORD = "password123"

def verify():
    print("1. Logging in...")
    login_data = {
        "username": EMAIL,
        "password": PASSWORD,
        "grant_type": "password"
    }
    r = requests.post(f"{BASE_URL}/auth/login", data=login_data)
    if r.status_code != 200:
        print(f"Login failed: {r.status_code} - {r.text}")
        return
    
    token = r.json()["access_token"]
    print("✓ Login successful")
    
    print("2. Fetching dashboard...")
    headers = {"Authorization": f"Bearer {token}"}
    r = requests.get(f"{BASE_URL}/api/dashboard/complete", headers=headers)
    
    if r.status_code == 200:
        print("✓ Dashboard fetch successful")
        with open("dashboard_result.json", "w") as f:
            json.dump(r.json(), f, indent=2)
        print("✓ Result saved to dashboard_result.json")
    else:
        print(f"❌ Dashboard fetch failed: {r.status_code}")
        print(f"Response Body: {r.text}")

if __name__ == "__main__":
    verify()
