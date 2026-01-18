import pandas as pd
import numpy as np
import os
from sklearn.ensemble import RandomForestRegressor
import pickle

MODEL_FILE = os.path.join(os.path.dirname(__file__), "roadmap_model.pkl")
DATA_FILE = os.path.join(os.path.dirname(__file__), "synthetic_roadmap_data.csv")

class RoadmapEngine:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.is_trained = False
        self._train_if_needed()

    def _train_if_needed(self):
        if os.path.exists(MODEL_FILE):
            with open(MODEL_FILE, "rb") as f:
                self.model = pickle.load(f)
            self.is_trained = True
            print("✅ Roadmap Engine model loaded.")
        elif os.path.exists(DATA_FILE):
            self.train()
        else:
            print("⚠️ No data found for Roadmap Engine training.")

    def train(self):
        if not os.path.exists(DATA_FILE):
            return
            
        df = pd.read_csv(DATA_FILE)
        # Features: user_score, required_score, gap_percentage, importance_weight
        X = df[["user_score", "required_score", "gap_percentage", "importance_weight"]]
        y = df["months_to_master"]
        
        self.model.fit(X, y)
        self.is_trained = True
        
        with open(MODEL_FILE, "wb") as f:
            pickle.dump(self.model, f)
        print("✅ Roadmap Engine trained and saved.")

    def predict_months(self, user_score, required_score, importance_weight):
        if not self.is_trained:
            # Simple fallback logic if ML is not ready
            gap = max(0, required_score - user_score)
            return max(1, round((gap / 10) * (importance_weight / 3), 1))
            
        gap = required_score - user_score
        input_data = pd.DataFrame([{
            "user_score": user_score,
            "required_score": required_score,
            "gap_percentage": gap,
            "importance_weight": importance_weight
        }])
        
        pred = self.model.predict(input_data)[0]
        return max(1, round(float(pred), 1))

# Global instance
roadmap_engine = RoadmapEngine()
