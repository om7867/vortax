import requests
import json

def verify_assessment():
    login_url = "http://127.0.0.1:8000/auth/login"
    start_url = "http://127.0.0.1:8000/api/v3/assessments/start"
    
    # 1. Login
    print("1. Logging in...")
    login_payload = {
        "username": "ommaheshwari1122@gmail.com",
        "password": "password123"
    }
    r = requests.post(login_url, data=login_payload)
    if r.status_code != 200:
        print(f"❌ Login failed: {r.status_code} - {r.text}")
        return
    
    token = r.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    print("✓ Login successful")
    
    # 2. Start Assessment
    print("2. Starting assessment...")
    r = requests.post(start_url, headers=headers, json={})
    
    if r.status_code == 200:
        print("✓ Assessment start successful")
        print(json.dumps(r.json(), indent=2))
    else:
        print(f"❌ Assessment start failed: {r.status_code}")
        print(f"Response Body: {r.text}")

if __name__ == "__main__":
    verify_assessment()
