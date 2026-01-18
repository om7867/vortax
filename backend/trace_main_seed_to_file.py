
import traceback
import sys
import os

sys.path.append(os.getcwd())

with open("seed_error.txt", "w", encoding="utf-8") as f:
    try:
        f.write("Attempting to run main seed.py...\n")
        from app.core.seed import seed_database
        seed_database()
        f.write("Main seeding successful!\n")
    except Exception as e:
        f.write("--- MAIN SEED ERROR ---\n")
        traceback.print_exc(file=f)
        f.write(f"\nError object: {str(e)}\n")
        f.write("--- END ERROR ---\n")
print("Done logging. Check seed_error.txt")
