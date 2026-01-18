"""
Module 4: Skill Scoring & Normalization Engine
Normalization & Scoring Algorithms
"""
from typing import Dict, List
from app.scoring.models import ConfidenceLevel

class ScoringEngine:
    """
    Core scoring algorithms for Module 4.
    All methods are pure functions for reproducibility.
    """
    
    # Difficulty weight mapping (as per spec)
    DIFFICULTY_WEIGHTS = {
        1: 0.5,
        2: 0.75,
        3: 1.0,
        4: 1.25,
        5: 1.5
    }
    
    @staticmethod
    def calculate_question_score(is_correct: bool, difficulty: int) -> float:
        """
        Calculate weighted score for a single question.
        
        Args:
            is_correct: Whether the answer was correct
            difficulty: Question difficulty (1-5)
            
        Returns:
            Weighted score (0 if incorrect, difficulty_weight if correct)
        """
        if not is_correct:
            return 0.0
        
        return ScoringEngine.DIFFICULTY_WEIGHTS.get(difficulty, 1.0)
    
    @staticmethod
    def calculate_max_possible_score(difficulties: List[int]) -> float:
        """
        Calculate maximum possible score for a set of questions.
        
        Args:
            difficulties: List of difficulty levels
            
        Returns:
            Sum of all difficulty weights
        """
        return sum(ScoringEngine.DIFFICULTY_WEIGHTS.get(d, 1.0) for d in difficulties)
    
    @staticmethod
    def calculate_score_percentage(raw_score: float, max_score: float) -> float:
        """
        Convert raw score to percentage.
        
        Args:
            raw_score: Total weighted score earned
            max_score: Maximum possible weighted score
            
        Returns:
            Percentage (0-100)
        """
        if max_score == 0:
            return 0.0
        
        return (raw_score / max_score) * 100.0
    
    @staticmethod
    def normalize_score(score_percentage: float) -> float:
        """
        Normalize percentage score to 0-1 scale for ML models.
        
        Args:
            score_percentage: Score as percentage (0-100)
            
        Returns:
            Normalized score (0.0-1.0)
        """
        return min(max(score_percentage / 100.0, 0.0), 1.0)
    
    @staticmethod
    def assign_confidence_level(score_percentage: float) -> ConfidenceLevel:
        """
        Assign confidence level based on score percentage.
        
        Args:
            score_percentage: Score as percentage (0-100)
            
        Returns:
            ConfidenceLevel enum (LOW, MEDIUM, HIGH)
        """
        if score_percentage >= 80:
            return ConfidenceLevel.HIGH
        elif score_percentage >= 50:
            return ConfidenceLevel.MEDIUM
        else:
            return ConfidenceLevel.LOW
    
    @staticmethod
    def suggest_skill_rating(score_percentage: float) -> int:
        """
        Suggest self-rating based on assessment score.
        Used to update UserSkillProfile.self_rating.
        
        Args:
            score_percentage: Score as percentage (0-100)
            
        Returns:
            Suggested rating (1-5)
        """
        if score_percentage >= 80:
            return 5
        elif score_percentage >= 60:
            return 4
        elif score_percentage >= 40:
            return 3
        elif score_percentage >= 20:
            return 2
        else:
            return 1
    
    @staticmethod
    def calculate_overall_score(skill_scores: List[float]) -> float:
        """
        Calculate overall normalized score across all skills.
        
        Args:
            skill_scores: List of normalized scores (0-1)
            
        Returns:
            Average normalized score
        """
        if not skill_scores:
            return 0.0
        
        return sum(skill_scores) / len(skill_scores)
