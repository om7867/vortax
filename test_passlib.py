try:
    print("DEBUG: Attempting to import passlib...")
    from passlib.context import CryptContext
    print("DEBUG: passlib imported successfully")
    
    print("DEBUG: Initializing CryptContext with bcrypt...")
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    print("DEBUG: CryptContext initialized successfully")
    
    password = "a" * 80
    print(f"DEBUG: Attempting to hash 80-char password with passlib...")
    try:
        h = pwd_context.hash(password)
        print("DEBUG: Successfully hashed 80-char password (unexpected!)")
    except ValueError as e:
        print(f"DEBUG: Caught expected ValueError from passlib/bcrypt: {e}")
        
except Exception as e:
    print(f"DEBUG: Top-level error in test_passlib.py: {e}")
    import traceback
    traceback.print_exc()
