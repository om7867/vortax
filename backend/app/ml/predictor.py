import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import MultiLabelBinarizer
import joblib
import os

# Mock Training Data for Health-Agri-Urban Nexus
# Features: [Soil Science, Crop Mgmt, Technology, Data Analysis, Biology, Urban Planning, IoT]
TRAINING_DATA = [
    (["Soil Science", "Crop Mgmt", "Technology"], "Agronomist"),
    (["Data Analysis", "Technology", "Biology"], "Agricultural Data Analyst"),
    (["Technology", "IoT", "Crop Mgmt"], "Precision Ag Specialist"),
    (["Biology", "Data Analysis", "Healthcare"], "Health Informatics Specialist"),
    (["Urban Planning", "IoT", "Technology"], "Smart City Architect"),
    (["Urban Planning", "Data Analysis"], "Urban Planner"),
    (["Healthcare", "Biology"], "Medical Researcher")
]

class CareerPredictor:
    def __init__(self):
        self.model = DecisionTreeClassifier()
        self.mlb = MultiLabelBinarizer()
        self.is_trained = False
        
    def train(self):
        """Train the model on the static dataset."""
        X_raw = [x[0] for x in TRAINING_DATA]
        y_raw = [x[1] for x in TRAINING_DATA]
        
        # Transform features to binary vector
        X = self.mlb.fit_transform(X_raw)
        self.model.fit(X, y_raw)
        self.is_trained = True
        print("ML Model Trained Successfully")

    def predict(self, skills: list[str]):
        """Predict career based on skill list."""
        if not self.is_trained:
            self.train()
            
        # Transform input
        # Note: In real app, we need to handle unknown skills carefully
        # Here fit_transform re-learns classes, so for prediction we must use transform
        # We need to ensure the mlb was fitted on ALL possible skills.
        # For this prototype, we re-fit on training + input to ensure shape match, 
        # but in prod we would persist the encoder.
        
        # Better approach for Prototype:
        # Just use the trained encoder. If skill not in known classes, it is ignored (default behavior of some encoders)
        # MLB throws error for unknown if not configured. 
        # Let's simple try strict transform and handle error
        try:
             X_in = self.mlb.transform([skills])
             prediction = self.model.predict(X_in)
             probabilities = self.model.predict_proba(X_in)
             confidence = np.max(probabilities)
             return prediction[0], confidence
        except Exception as e:
            # Fallback for empty or unknown skills
            print(f"Prediction error: {e}")
            return "General Specialist", 0.0

predictor = CareerPredictor()
# Train on import for readiness
predictor.train()
