"""
Module 4: Skill Scoring & Normalization Engine
Verification Script

Tests the complete scoring flow:
1. Evaluate a test
2. Verify skill scores
3. Check UserSkillProfile updates
4. Retrieve summary
5. Check history
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_module4_scoring():
    print("=" * 60)
    print("MODULE 4: SKILL SCORING VERIFICATION")
    print("=" * 60)
    
    # Step 1: Login
    print("\n--- 1. Login ---")
    login_response = requests.post(
        f"{BASE_URL}/auth/login",
        data={"username": "ommaheshwari1122@gmail.com", "password": "test123"}
    )
    
    if login_response.status_code != 200:
        print(f"Login Failed: {login_response.status_code}")
        return
    
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Login Successful.")
    
    # Step 2: Start Assessment (to get a test_id)
    print("\n--- 2. Start Assessment ---")
    start_response = requests.post(
        f"{BASE_URL}/api/v3/assessments/start",
        headers=headers,
        json={}
    )
    
    if start_response.status_code != 200:
        print(f"Start Failed: {start_response.status_code}")
        print(start_response.text)
        return
    
    test_data = start_response.json()
    test_id = test_data["id"]
    questions = test_data["questions"]
    print(f"Assessment Started! ID: {test_id}")
    print(f"Questions: {len(questions)}")
    
    # Step 3: Submit Assessment (all correct answers for testing)
    print("\n--- 3. Submit Assessment ---")
    answers = [
        {"question_id": q["id"], "selected_option_index": 0}
        for q in questions
    ]
    
    submit_response = requests.post(
        f"{BASE_URL}/api/v3/assessments/submit",
        headers=headers,
        json={"test_id": test_id, "answers": answers}
    )
    
    if submit_response.status_code != 200:
        print(f"Submit Failed: {submit_response.status_code}")
        print(submit_response.text)
        return
    
    submit_data = submit_response.json()
    print("Submission Successful!")
    print(f"Total Score: {submit_data['total_score']}")
    
    # Step 4: Evaluate Test (Module 4)
    print("\n--- 4. Evaluate Test (Module 4) ---")
    evaluate_response = requests.post(
        f"{BASE_URL}/api/v4/scoring/evaluate/{test_id}",
        headers=headers
    )
    
    if evaluate_response.status_code != 200:
        print(f"Evaluation Failed: {evaluate_response.status_code}")
        print(evaluate_response.text)
        return
    
    eval_data = evaluate_response.json()
    print("Evaluation Successful!")
    print(f"Skills Evaluated: {eval_data['skills_evaluated']}")
    print(f"Status: {eval_data['status']}")
    
    # Step 5: Get Score Summary
    print("\n--- 5. Get Score Summary ---")
    summary_response = requests.get(
        f"{BASE_URL}/api/v4/scoring/summary",
        headers=headers
    )
    
    if summary_response.status_code != 200:
        print(f"Summary Failed: {summary_response.status_code}")
        print(summary_response.text)
        return
    
    summary_data = summary_response.json()
    print(f"Overall Score: {summary_data['overall_score']:.2f}")
    print(f"Total Skills Assessed: {summary_data['total_skills_assessed']}")
    print("\nSkill Breakdown:")
    for skill in summary_data['skill_breakdown']:
        print(f"  - {skill['skill_name']}: {skill['score_percentage']:.1f}% ({skill['confidence_level']})")
    
    # Step 6: Get Skill History (for first skill)
    if summary_data['skill_breakdown']:
        first_skill_id = summary_data['skill_breakdown'][0]['skill_id']
        print(f"\n--- 6. Get Skill History ({summary_data['skill_breakdown'][0]['skill_name']}) ---")
        
        history_response = requests.get(
            f"{BASE_URL}/api/v4/scoring/history/{first_skill_id}",
            headers=headers
        )
        
        if history_response.status_code != 200:
            print(f"History Failed: {history_response.status_code}")
            print(history_response.text)
        else:
            history_data = history_response.json()
            print(f"History Points: {len(history_data['history'])}")
            for i, point in enumerate(history_data['history']):
                print(f"  {i+1}. {point['score_percentage']:.1f}% - {point['confidence_level']} ({point['recorded_at']})")
    
    print("\n" + "=" * 60)
    print("MODULE 4 VERIFICATION COMPLETE")
    print("=" * 60)

if __name__ == "__main__":
    test_module4_scoring()
