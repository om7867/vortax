import numpy as np

def create_feature_vector(user_skills: dict, total_skills_count: int = 3) -> np.ndarray:
    """
    Converts a user's skill profile into a feature vector for the model.
    
    Args:
        user_skills (dict): Mapping of skill_id to proficiency level.
        total_skills_count (int): Total dimensions (should match training data).
        
    Returns:
        np.ndarray: A vector representing skill levels.
    """
    # In a real system, we need a consistent mapping of index -> skill_id
    # For this placeholder, we assume skills 1, 2, 3 correspond to indices 0, 1, 2
    
    vector = np.zeros(total_skills_count)
    
    for skill_id, proficiency in user_skills.items():
        # Simple mapping: skill_id 1 -> index 0, etc.
        # Adjust logic to match actual database/training features
        idx = skill_id - 1 
        if 0 <= idx < total_skills_count:
            vector[idx] = proficiency
            
    return vector
