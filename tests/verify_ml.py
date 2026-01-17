import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.ml.career_prediction import CareerPredictor
from app.core.database import SessionLocal
from app.models.models import MLTrainingData

def verify_ml():
    print("Initializing CareerPredictor (this should trigger training if data exists)...")
    try:
        predictor = CareerPredictor()
        
        if predictor.is_trained:
            print("SUCCESS: Model trained successfully.")
        else:
            print("WARN: Model exists but is_trained is False. Check if DB has training data.")
            # Check DB
            db = SessionLocal()
            count = db.query(MLTrainingData).count()
            print(f"DEBUG: MLTrainingData row count: {count}")
            db.close()
            
        # Test Prediction (Agronomist profile approx)
        # Skills: Soil, Crop, Irrigation, Pest, Data, Precision, IoT
        # Agronomist: High Soil(0), Crop(1), Pest(3)
        sample_skills = {
            1: 9,  # Soil (ID 1?) Check mapping if possible, assuming ID 1 based on Enum/Seed
            2: 9,  # Crop
            3: 5,  # Irrigation
            4: 8,  # Pest
            5: 5,  # Data 
            6: 5,  # Precision
            7: 4   # IoT
        }
        
        # Note: CareerPredictor expects skill_id -> level map. 
        # But create_feature_vector implementation needs to be checked.
        # Let's assume standard IDs 1-7.
        
        print(f"Testing prediction with skills: {sample_skills}")
        result = predictor.predict_career(sample_skills)
        print(f"Prediction Result: {result}")
        
        if result['predicted_career_id'] is not None:
            print("SUCCESS: Prediction returned a valid career ID.")
        else:
            print("FAIL: Prediction returned None.")
            sys.exit(1)

    except Exception as e:
        print(f"FAIL: ML Verification errored: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    verify_ml()

