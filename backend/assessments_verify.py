import urllib.request
import json
import ssl
import sys

def verify():
    # 0. Setup
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    base_url = "http://localhost:8000"
    
    # 1. Login
    print("--- 1. Login ---")
    login_url = f"{base_url}/auth/login"
    login_body = "username=OM11dada&password=NewPassword123!".encode()
    
    req = urllib.request.Request(login_url, data=login_body, method='POST')
    try:
        with urllib.request.urlopen(req, context=ctx) as f:
            resp = json.loads(f.read().decode())
            token = resp['access_token']
            print("Login Successful.")
    except Exception as e:
        print(f"Login Failed: {e}")
        return

    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    # 2. Start Assessment
    print("\n--- 2. Start Assessment ---")
    start_url = f"{base_url}/api/v3/assessments/start"
    # Empty body for defaults
    req = urllib.request.Request(start_url, data=json.dumps({}).encode(), headers=headers, method='POST')
    
    test_id = None
    questions = []
    
    try:
        with urllib.request.urlopen(req, context=ctx) as f:
            data = json.loads(f.read().decode())
            test_id = data['id']
            questions = data['questions']
            print(f"Assessment Started! ID: {test_id}")
            print(f"Questions received: {len(questions)}")
    except urllib.error.HTTPError as e:
        print(f"Start Failed: {e.code} {e.reason}")
        err_body = e.read().decode()
        print(f"Error Body: {err_body}")
        if e.code == 403:
            print("NOTE: 403 is EXPECTED if profile < 70%.")
            return
        sys.exit(1)

    # 3. Submit Assessment
    print("\n--- 3. Submit Assessment ---")
    if not test_id:
        print("No test ID, skipping submission.")
        return

    answers = []
    for q in questions:
        answers.append({
            "question_id": q['id'],
            "selected_option_index": 0 # Always pick first option
        })
        
    submit_url = f"{base_url}/api/v3/assessments/submit"
    submit_payload = {
        "test_id": test_id,
        "answers": answers
    }
    
    req = urllib.request.Request(submit_url, data=json.dumps(submit_payload).encode(), headers=headers, method='POST')
    
    try:
        with urllib.request.urlopen(req, context=ctx) as f:
            result = json.loads(f.read().decode())
            print("Submission Successful!")
            print(f"Total Score: {result['total_score']}")
            print(f"Status: {result['status']}")
            print("Skill Results:")
            for sr in result['skill_results']:
                print(f" - {sr['skill_name']}: {sr['score_percentage']}% ({sr['confidence_level']})")
    except urllib.error.HTTPError as e:
        print(f"Submit Failed: {e.code} {e.reason}")
        print(e.read().decode())

if __name__ == "__main__":
    verify()
