"""
Module 6: Recommendation Engine - Prioritizer
Logic for assigning priority to recommendations
"""
from .models import RecommendationPriority

class RecommendationPrioritizer:
    @staticmethod
    def calculate_priority(importance_weight: int, gap_percentage: float, is_core: bool = False) -> RecommendationPriority:
        """
        Assign priority based on skill importance and gap size
        
        Logic:
        - HIGH: Core skill, high importance (>=4), or large gap (>50%)
        - MEDIUM: Moderate gap (20-50%) or importance 3
        - LOW: Small gap (<20%) or importance <3
        """
        if is_core or importance_weight >= 4 or gap_percentage > 50:
            return RecommendationPriority.HIGH
        
        if importance_weight == 3 or gap_percentage >= 20:
            return RecommendationPriority.MEDIUM
            
        return RecommendationPriority.LOW
