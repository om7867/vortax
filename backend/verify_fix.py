import urllib.request
import json
import ssl

def verify():
    # 1. Login
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    login_url = "http://localhost:8000/auth/login"
    login_data = "username=OM11dada&password=NewPassword123%21".encode() # %21 is ! escaped if needed, but standard urlencode
    # Actually for application/x-www-form-urlencoded, ! is safe usually, but let's just use standard string if json? No auth is form data.
    # Requests uses form data.
    
    # Constructing post data for login (body)
    login_body = "username=OM11dada&password=NewPassword123!".encode()
    
    req = urllib.request.Request(login_url, data=login_body, method='POST')
    # Default header for form data might be needed
    # req.add_header('Content-Type', 'application/x-www-form-urlencoded')
    
    try:
        with urllib.request.urlopen(req, context=ctx) as f:
            resp = json.loads(f.read().decode())
            token = resp['access_token']
            print("Login Successful. Token obtained.")
    except Exception as e:
        print(f"Login Failed: {e}")
        return

    # 2. Delete Skill (Cleanup/Idempotency)
    print("Cleaning up existing skill...")
    skill_id = "ab38d505-d13f-4916-9231-0274d25ceeba"
    delete_url = f"http://localhost:8000/api/v2/skills/{skill_id}"
    req = urllib.request.Request(delete_url, method='DELETE')
    req.add_header('Authorization', f'Bearer {token}')
    try:
        with urllib.request.urlopen(req, context=ctx) as f:
            print("Cleanup successful.")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print("Skill not found during cleanup (OK).")
        else:
            print(f"Cleanup Failed: {e.code} {e.reason}")

    # 3. Add Skill
    print("Adding skill...")
    skill_url = "http://localhost:8000/api/v2/skills/add"
    skill_data = json.dumps({
        "skill_id": skill_id,
        "self_rating": 3
    }).encode()
    
    req = urllib.request.Request(skill_url, data=skill_data, method='POST')
    req.add_header('Authorization', f'Bearer {token}')
    req.add_header('Content-Type', 'application/json')
    
    try:
        with urllib.request.urlopen(req, context=ctx) as f:
            resp_text = f.read().decode()
            print(f"Add Skill Response: {resp_text}")
            print("SUCCESS: Skill added.")
    except urllib.error.HTTPError as e:
        print(f"Add Skill Failed: {e.code} {e.reason}")
        print(e.read().decode())
    except Exception as e:
        print(f"Add Skill Error: {e}")

if __name__ == "__main__":
    verify()
