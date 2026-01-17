"""
ML Career Prediction Module.
Refactored to be DB-Driven using SQLAlchemy.
"""
import numpy as np
from sklearn.linear_model import LogisticRegression
from app.ml.dataset_loader import load_training_data
from app.ml.feature_engineering import create_feature_vector
from app.core.database import SessionLocal
from app.models.models import MLTrainingData, Career, Skill
import pickle
import os
import json

MODEL_PATH = "backend/app/ml/model.pkl"

class CareerPredictor:
    def __init__(self):
        self.model = LogisticRegression(max_iter=1000)
        self.is_trained = False
        self.skill_count = 7 # Matches seed
        self.train() 

    def train(self):
        """Train model from DB data. Populate DB if empty."""
        db = SessionLocal()
        try:
            # Check if training data exists
            if db.query(MLTrainingData).count() == 0:
                print("[INFO] No training data in DB. Populating from synthetic loader...")
                self._populate_training_data(db)
            
            # Fetch data from DB
            data_rows = db.query(MLTrainingData).all()
            
            X = []
            y = []
            
            # Create feature matrix and label vector
            for row in data_rows:
                X.append(row.feature_vector)
                # We need the career title for sklearn training? 
                # Actually sklearn can train on IDs, naming is better for debug.
                # Let's use IDs to be robust.
                y.append(row.label_career_id) 
            
            X = np.array(X)
            y = np.array(y)
            
            if len(X) > 0:
                self.model.fit(X, y)
                self.is_trained = True
                print("[INFO] Model trained successfully from DB.")
            else:
                print("[WARN] No training data found even after population attempt.")

        except Exception as e:
            print(f"[ERROR] Training failed: {e}")
        finally:
            db.close()

    def _populate_training_data(self, db):
        """Helper to populate ML tables from synthetic loader."""
        X_synth, y_synth = load_training_data()
        
        # cache career map
        careers = db.query(Career).all()
        career_map = {c.title: c.id for c in careers}
        
        count = 0
        for features, label_title in zip(X_synth, y_synth):
            if label_title not in career_map:
                continue
                
            entry = MLTrainingData(
                user_id=1, # Admin user ID 1 placeholder
                feature_vector=features.tolist(),
                label_career_id=career_map[label_title]
            )
            db.add(entry)
            count += 1
            
        db.commit()
        print(f"[INFO] Populated {count} training records to DB.")

    def predict_career(self, user_skills: dict) -> dict:
        """
        Predict using DB-trained model. Returns dictionary.
        """
        if not self.is_trained:
            return {"confidence": 0, "predicted_career_id": None}
            
        try:
            # Ensure proper vector size
            vector = create_feature_vector(user_skills, self.skill_count)
            
            # Predict
            pred_career_id = self.model.predict([vector])[0]
            probs = self.model.predict_proba([vector])[0]
            confidence = float(np.max(probs))
            
            return {
                "predicted_career_id": int(pred_career_id),
                "confidence": confidence
            }
        except Exception as e:
            print(f"[ERROR] Prediction error: {e}")
            return {"confidence": 0, "predicted_career_id": None}

predictor = CareerPredictor()
