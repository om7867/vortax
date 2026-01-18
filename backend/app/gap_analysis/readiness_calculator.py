"""
Module 5: Skill Gap Analysis Engine
Readiness Calculator - Weighted Formula
"""
from typing import List, Dict, Tuple
from app.gap_analysis.models import GapStatus

class ReadinessCalculator:
    """
    Core algorithms for gap analysis and readiness calculation.
    All methods are pure functions for reproducibility.
    """
    
    @staticmethod
    def calculate_gap(user_score: float, required_score: float) -> float:
        """
        Calculate gap percentage.
        
        Args:
            user_score: User's current score (0-100)
            required_score: Required score for role (0-100)
            
        Returns:
            Gap percentage (negative if user exceeds requirement)
        """
        return required_score - user_score
    
    @staticmethod
    def determine_gap_status(user_score: float, required_score: float) -> GapStatus:
        """
        Determine gap status based on achievement level.
        
        Rules:
        - user_score >= required_score → ACHIEVED
        - user_score >= required_score * 0.6 → NEEDS_IMPROVEMENT
        - user_score < required_score * 0.6 → MISSING
        
        Args:
            user_score: User's current score (0-100)
            required_score: Required score for role (0-100)
            
        Returns:
            GapStatus enum
        """
        if user_score >= required_score:
            return GapStatus.ACHIEVED
        elif user_score >= (required_score * 0.6):
            return GapStatus.NEEDS_IMPROVEMENT
        else:
            return GapStatus.MISSING
    
    @staticmethod
    def calculate_weighted_readiness(
        skill_scores: List[Tuple[float, float, int]]
    ) -> float:
        """
        Calculate overall readiness using weighted formula.
        
        Formula:
        For each skill:
          contribution = min(user_score / required_score, 1) × importance_weight
        
        readiness = (sum(contribution) / sum(importance_weight)) × 100
        
        Args:
            skill_scores: List of (user_score, required_score, importance_weight) tuples
            
        Returns:
            Readiness percentage (0-100)
        """
        if not skill_scores:
            return 0.0
        
        total_contribution = 0.0
        total_weight = 0
        
        for user_score, required_score, weight in skill_scores:
            # Calculate achievement ratio (capped at 1.0)
            if required_score > 0:
                achievement_ratio = min(user_score / required_score, 1.0)
            else:
                achievement_ratio = 1.0 if user_score > 0 else 0.0
            
            # Weight the contribution
            contribution = achievement_ratio * weight
            total_contribution += contribution
            total_weight += weight
        
        if total_weight == 0:
            return 0.0
        
        # Convert to percentage and clamp
        readiness = (total_contribution / total_weight) * 100.0
        return min(max(readiness, 0.0), 100.0)
    
    @staticmethod
    def count_by_status(gap_statuses: List[GapStatus]) -> Dict[str, int]:
        """
        Count skills by gap status.
        
        Args:
            gap_statuses: List of GapStatus values
            
        Returns:
            Dictionary with counts for each status
        """
        counts = {
            "achieved": 0,
            "needs_improvement": 0,
            "missing": 0
        }
        
        for status in gap_statuses:
            if status == GapStatus.ACHIEVED:
                counts["achieved"] += 1
            elif status == GapStatus.NEEDS_IMPROVEMENT:
                counts["needs_improvement"] += 1
            elif status == GapStatus.MISSING:
                counts["missing"] += 1
        
        return counts
