import sys
import os

print(f"CWD: {os.getcwd()}")
print(f"Path: {sys.path}")

try:
    print("1. Importing Database...")
    from app.core.database import Base
    print("   Database Imported.")

    print("2. Importing Auth Models...")
    from app.auth.models import User
    print("   Auth Models Imported.")

    print("3. Importing Main Models...")
    from app.models.models import Skill
    print("   Main Models Imported.")
    
    print("4. Importing Routes...")
    from app.api import user
    print("   User API Imported.")
    from app.main import app
    print("   Main App Imported.")
    
    print("Success!")
except Exception as e:
    print(f"FAILED: {e}")
    import traceback
    traceback.print_exc()
