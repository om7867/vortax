"""
Dataset loader for ML training.
Generates synthetic training data aligned with DB schema (7 skills).
"""
import numpy as np

def load_training_data():
    """
    Returns features and labels for the 7-skill DB schema.
    
    Skills Order (Indices 0-6):
    0: Soil Health
    1: Crop Science
    2: Irrigation Systems
    3: Pest Control
    4: Data Analysis
    5: Precision Agriculture
    6: IoT Sensors
    
    Careers:
    - Agronomist
    - Soil Scientist
    - Precision Agriculture Specialist
    - Farm Manager
    """
    
    # 7 dimension vectors
    X = np.array([
        # Agronomist (High Soil, Crop, Pest)
        [9, 9, 6, 8, 5, 5, 4],
        [8, 9, 7, 7, 6, 4, 3],
        [9, 8, 5, 9, 5, 3, 2],
        
        # Soil Scientist (Very High Soil, Mod Crop)
        [10, 6, 4, 5, 8, 5, 4],
        [9, 7, 5, 6, 9, 6, 5],
        [10, 5, 3, 4, 7, 4, 3],
        
        # Precision Ag Specialist (High Precision, IoT, Data)
        [5, 6, 8, 4, 9, 9, 9],
        [6, 7, 9, 5, 8, 9, 8],
        [4, 5, 7, 3, 9, 10, 10],
        
        # Farm Manager (Balanced, Mod everything)
        [6, 7, 6, 5, 5, 4, 4],
        [7, 8, 7, 6, 6, 5, 5],
        [5, 6, 5, 4, 4, 3, 3],
    ])
    
    y = np.array([
        "Agronomist", "Agronomist", "Agronomist",
        "Soil Scientist", "Soil Scientist", "Soil Scientist",
        "Precision Agriculture Specialist", "Precision Agriculture Specialist", "Precision Agriculture Specialist",
        "Farm Manager", "Farm Manager", "Farm Manager"
    ])
    
    return X, y
