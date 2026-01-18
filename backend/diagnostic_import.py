
try:
    print("Importing app.all_models...")
    from app import all_models
    print("Success!")
except Exception as e:
    import traceback
    traceback.print_exc()
