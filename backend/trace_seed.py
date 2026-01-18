
import traceback
import sys
import os

# Add the current directory to sys.path to allow app.* imports
sys.path.append(os.getcwd())

try:
    print("Attempting to run seed_expansion...")
    from app.core.seed_expansion import seed_expansion
    seed_expansion()
    print("Seed expansion successful!")
except Exception:
    print("--- SEED EXPANSION ERROR ---")
    traceback.print_exc()
    print("--- END ERROR ---")
