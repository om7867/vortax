"""
Event Bus for Auto-Trigger Pipeline
Handles automated workflows between modules
"""
from sqlalchemy.orm import Session
from uuid import UUID
import logging

from app.scoring.services import ScoringService
from app.gap_analysis.services import GapAnalysisService

logger = logging.getLogger(__name__)

class EventBus:
    """
    Event-driven automation for module integration
    """
    
    @staticmethod
    def trigger_assessment_pipeline(test_id: UUID, user_id: UUID):
        """
        Auto-trigger pipeline after assessment submission
        
        Flow:
        1. Score the test (Module 4)
        2. Run gap analysis (Module 5)
        3. Generate recommendations (Module 6)
        4. Update timeline (Module 7)
        """
        from app.core.database import SessionLocal
        db = SessionLocal()
        try:
            logger.info(f"Starting assessment pipeline for test {test_id}")
            
            # MODULE 6: Recommendation Engine
            from app.recommendations.services import RecommendationService
            
            # Step 1: Score the test
            logger.info("Step 1: Evaluating test scores...")
            scoring_result = ScoringService.evaluate_test(db, test_id, user_id)
            logger.info(f"Scoring complete: {scoring_result['skills_evaluated']} skills")
            
            # Step 2: Run gap analysis
            logger.info("Step 2: Running gap analysis...")
            gap_result = GapAnalysisService.evaluate_gap_analysis(db, user_id)
            logger.info(f"Gap analysis complete: {gap_result['readiness_percentage']}% ready")
            
            # Step 3: Generate recommendations
            logger.info("Step 3: Generating recommendations...")
            recs = RecommendationService.generate_recommendations(db, user_id)
            logger.info(f"Recommendations complete: {len(recs)} generated")
            
            # Step 4: Update timeline (placeholder for now)
            logger.info("Step 4: Updating learning timeline...")
            # TimelineService.update_milestones(db, user_id)
            
            logger.info("Assessment pipeline completed successfully")
            
            return {
                "status": "success",
                "scoring": scoring_result,
                "gap_analysis": gap_result
            }
            
        except Exception as e:
            logger.error(f"Assessment pipeline failed: {str(e)}")
            raise
        finally:
            db.close()
    
    @staticmethod
    def trigger_profile_update_pipeline(db: Session, user_id: UUID):
        """
        Auto-trigger pipeline after profile update
        
        Flow:
        1. Recalculate profile completion
        2. Re-run gap analysis (if target role changed)
        """
        try:
            logger.info(f"Starting profile update pipeline for user {user_id}")
            
            # Re-run gap analysis if user has completed assessment
            try:
                gap_result = GapAnalysisService.evaluate_gap_analysis(db, user_id)
                logger.info(f"Gap analysis updated: {gap_result['readiness_percentage']}% ready")
                return {"status": "success", "gap_analysis": gap_result}
            except:
                logger.info("No gap analysis to update (user hasn't taken assessment)")
                return {"status": "skipped"}
                
        except Exception as e:
            logger.error(f"Profile update pipeline failed: {str(e)}")
            raise
