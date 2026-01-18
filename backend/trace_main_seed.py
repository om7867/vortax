
import traceback
import sys
import os

sys.path.append(os.getcwd())

try:
    print("Attempting to run main seed.py...")
    from app.core.seed import seed_database
    seed_database()
    print("Main seeding successful!")
except Exception:
    print("--- MAIN SEED ERROR ---")
    traceback.print_exc()
    print("--- END ERROR ---")
