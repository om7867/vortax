import requests
import sys

BASE_URL = "http://localhost:8001"

def verify_api():
    try:
        # 1. Health Check
        resp = requests.get(f"{BASE_URL}/health")
        if resp.status_code == 200:
            print("SUCCESS: /health endpoint is operational.")
        else:
            print(f"FAIL: /health returned {resp.status_code}")
            sys.exit(1)

        # 2. Root Check
        resp = requests.get(f"{BASE_URL}/")
        if resp.status_code == 200:
            print("SUCCESS: Root endpoint is operational.")
        else:
            print(f"FAIL: Root returned {resp.status_code}")
            sys.exit(1)

    except requests.exceptions.ConnectionError:
        print("FAIL: Could not connect to backend. Is it running?")
        sys.exit(1)

if __name__ == "__main__":
    verify_api()
