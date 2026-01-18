import random
import uuid
import json
import pandas as pd
from datetime import datetime

# Skills from seed.py
SKILLS = [
    "Soil Health", "Crop Science", "Irrigation Systems", "Pest Control",
    "Data Analysis", "Precision Agriculture", "IoT Sensors", "Farm Management",
    "Python", "Machine Learning", "SQL", "React", "FastAPI"
]

ROLES = ["Agronomist", "Software Engineer", "Data Scientist", "ML Engineer", "Farm Manager"]

def generate_synthetic_data(num_samples=150):
    data = []
    
    for _ in range(num_samples):
        user_id = str(uuid.uuid4())
        target_role = random.choice(ROLES)
        
        # Random skill profile
        user_skills = {skill: random.randint(0, 100) for skill in SKILLS}
        
        # Requirements (mock benchmarks)
        requirements = {skill: random.randint(60, 90) for skill in SKILLS}
        
        for skill in SKILLS:
            u_score = user_skills[skill]
            r_score = requirements[skill]
            gap = r_score - u_score
            
            # Label: months_to_master (ML target)
            # Higher gap + high importance = more months
            importance = random.randint(1, 5)
            
            if gap <= 0:
                months = 0
                intensity = "ACHIEVED"
            else:
                # Prediction logic: 10% gap = 0.5 month, importance adds multiplier
                months = max(1, round((gap / 10) * (importance / 3), 1))
                if months > 6:
                    intensity = "HIGH"
                elif months > 3:
                    intensity = "MEDIUM"
                else:
                    intensity = "LOW"
            
            data.append({
                "user_id": user_id,
                "target_role": target_role,
                "skill_name": skill,
                "user_score": u_score,
                "required_score": r_score,
                "gap_percentage": gap,
                "importance_weight": importance,
                "months_to_master": months,
                "learning_intensity": intensity
            })
            
    return pd.DataFrame(data)

if __name__ == "__main__":
    df = generate_synthetic_data(200)
    df.to_csv("app/ml/synthetic_roadmap_data.csv", index=False)
    print(f"✅ Generated {len(df)} records for training.")
