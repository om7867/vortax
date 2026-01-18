"""
Quick Test Script for Enterprise Dashboard
Tests the unified dashboard endpoint
"""
import requests
import json

# Configuration
BASE_URL = "http://localhost:8000"
EMAIL = "ommaheshwari1122@gmail.com"  # Your test user
PASSWORD = "password123"  # Identified from test_auth.py

def test_dashboard():
    print("=" * 60)
    print("TESTING ENTERPRISE DASHBOARD")
    print("=" * 60)
    
    # Step 1: Login
    print("\n1. Logging in...")
    # standard FastAPI OAuth2 expects form data
    login_response = requests.post(
        f"{BASE_URL}/auth/login",
        data={"username": EMAIL, "password": PASSWORD, "grant_type": "password"}
    )
    
    if login_response.status_code != 200:
        # try JSON if form fails
        login_response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"username": EMAIL, "password": PASSWORD, "grant_type": "password"}
        )
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(f"   Error: {login_response.text}")
        return
    
    token_resp = login_response.json()
    token = token_resp["access_token"]
    print(f"✓ Login successful")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Step 2: Test Unified Dashboard
    print("\n2. Fetching unified dashboard...")
    dashboard_response = requests.get(
        f"{BASE_URL}/api/dashboard/complete",
        headers=headers
    )
    
    if dashboard_response.status_code != 200:
        print(f"❌ Dashboard failed: {dashboard_response.text}")
        return
    
    data = dashboard_response.json()
    print(f"✓ Dashboard loaded successfully")
    
    # Step 3: Display Results
    print("\n" + "=" * 60)
    print("DASHBOARD DATA")
    print("=" * 60)
    
    print(f"\n📊 PROFILE:")
    print(f"  Completion: {data['profile']['completion_percentage']}%")
    print(f"  Target Role: {data['profile']['target_role']}")
    print(f"  Total Skills: {data['profile']['total_skills']}")
    
    print(f"\n🎯 READINESS:")
    print(f"  Percentage: {data['readiness']['percentage']}%")
    print(f"  Achieved: {data['readiness']['achieved_count']}")
    print(f"  Partial: {data['readiness']['partial_count']}")
    print(f"  Missing: {data['readiness']['missing_count']}")
    
    print(f"\n📈 CAREER SCORECARD:")
    scorecard = data['scorecard']
    print(f"  Skill Growth: {scorecard['skill_growth']}")
    print(f"  Matching Jobs: {scorecard['matching_jobs']}")
    print(f"  Projected Growth: {scorecard['projected_growth']}")
    print(f"  Talent Pool Rank: {scorecard['talent_pool_rank']}")
    
    print(f"\n✅ NEXT STEPS:")
    for i, step in enumerate(data['next_steps'], 1):
        print(f"  {i}. {step['title']}")
        print(f"     {step['description']}")
    
    print("\n" + "=" * 60)
    print("✓ ALL TESTS PASSED - DASHBOARD IS WORKING!")
    print("=" * 60)
    
    # Save full response
    with open("dashboard_response.json", "w") as f:
        json.dump(data, f, indent=2, default=str)
    print("\n📄 Full response saved to: dashboard_response.json")

if __name__ == "__main__":
    test_dashboard()
