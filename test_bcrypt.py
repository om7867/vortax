try:
    print("DEBUG: Attempting to import bcrypt...")
    import bcrypt
    print("DEBUG: bcrypt imported successfully")
    
    password = b"a" * 73
    print(f"DEBUG: Attempting to hash 73-char password with bcrypt...")
    try:
        bcrypt.hashpw(password, bcrypt.gensalt())
        print("DEBUG: Successfully hashed 73-char password (unexpected!)")
    except ValueError as e:
        print(f"DEBUG: Caught expected ValueError from bcrypt: {e}")
        
except Exception as e:
    print(f"DEBUG: Top-level error in test_bcrypt.py: {e}")
