
import requests

# We need a token to call the API
# Let's try to login as admin first
BASE_URL = "http://localhost:8000"

def test_roadmap():
    try:
        # 1. Login
        login_resp = requests.post(f"{BASE_URL}/auth/login", data={
            "username": "admin",
            "password": "admin123"
        })
        if login_resp.status_code != 200:
            print(f"Login failed: {login_resp.status_code} {login_resp.text}")
            return
        
        token = login_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # 2. Call Roadmap
        print("Calling /api/v6/recommendations/roadmap...")
        resp = requests.get(f"{BASE_URL}/api/v6/recommendations/roadmap", headers=headers)
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.text}")
        
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_roadmap()
