"""
Module 6: Recommendation Engine - Reason Generator
Logic for generating dynamic textual explanations
"""

class ReasonGenerator:
    @staticmethod
    def generate_gap_reason(skill_name: str, user_score: float, required_score: float) -> str:
        """
        Generate a reason based on the skill gap
        
        Example:
        "Recommended because your current skill level in 
        Precision Agriculture is 42%, while the role requires 75%."
        """
        # Format scores to integers for readability
        user_p = int(user_score)
        req_p = int(required_score)
        
        return f"Recommended because your current skill level in {skill_name} is {user_p}%, while the role requires {req_p}%."

    @staticmethod
    def generate_confidence_reason(skill_name: str, confidence: str) -> str:
        """Generate reason based on low confidence score"""
        return f"Prioritized because your confidence level in {skill_name} is marked as {confidence}, suggesting a need for foundational reinforcement."

    @staticmethod
    def generate_job_reason(match_score: float, role_name: str) -> str:
        """Generate reason for job match"""
        match_p = int(match_score * 100)
        return f"This {role_name} position is a {match_p}% match based on your verified skills and certifications."
