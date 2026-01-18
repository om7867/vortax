
import traceback
import sys
import os

sys.path.append(os.getcwd())

with open("expansion_error.txt", "w", encoding="utf-8") as f:
    try:
        f.write("Attempting to run seed_expansion.py...\n")
        from app.core.seed_expansion import seed_expansion
        seed_expansion()
        f.write("Expansion seeding successful!\n")
    except Exception as e:
        f.write("--- EXPANSION SEED ERROR ---\n")
        traceback.print_exc(file=f)
        f.write(f"\nError object: {str(e)}\n")
        f.write("--- END ERROR ---\n")
print("Done logging. Check expansion_error.txt")
