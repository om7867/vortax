"""
Dashboard API.
Core logic for Gap Analysis and Recommendations.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.models.models import Career, CareerSkillRequirement, UserSkill, Recommendation
from app.auth.models import User
from app.schemas.schemas import DashboardResponse, RecommendationResponse
from app.ml.predictor import predictor

router = APIRouter()

@router.get("/", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get User Dashboard.
    Performs real-time gap analysis and updates recommendation tables.
    """
    # 1. Fetch all User Skills
    user_skills_map = {us.skill_id: us.proficiency_level for us in current_user.user_skills}
    
    # ML Prediction
    user_skill_names = [us.skill.name for us in current_user.user_skills]
    predicted_career, confidence = predictor.predict(user_skill_names)
    
    # 2. Fetch all Careers and their requirements
    careers = db.query(Career).all()
    recommendation_results = []
    
    for career in careers:
        requirements = db.query(CareerSkillRequirement).filter(
            CareerSkillRequirement.career_id == career.id
        ).all()
        
        if not requirements:
            continue

        total_reqs = len(requirements)
        met_reqs = 0
        gaps = []

        for req in requirements:
            user_level = user_skills_map.get(req.skill_id, 0)
            if user_level >= req.required_level:
                met_reqs += 1
            else:
                gaps.append({
                    "skill_id": req.skill_id,
                    "skill_name": req.skill.name,
                    "gap": req.required_level - user_level,
                    "required": req.required_level,
                    "current": user_level
                })
        
        match_score = (met_reqs / total_reqs) * 100 if total_reqs > 0 else 0
        
        # Readiness Logic
        if match_score >= 80:
            status = "Ready"
        elif match_score >= 60:
            status = "Near Ready"
        else:
            status = "Developing"

        # ML Confidence
        ml_conf = confidence if career.title == predicted_career else 0.0

        # Persist to DB (Update or Create)
        rec_entry = db.query(Recommendation).filter(
            Recommendation.user_id == current_user.id,
            Recommendation.career_id == career.id
        ).first()

        if rec_entry:
            rec_entry.match_score = match_score
            rec_entry.readiness_status = status
            rec_entry.ml_confidence = ml_conf
        else:
            rec_entry = Recommendation(
                user_id=current_user.id,
                career_id=career.id,
                match_score=match_score,
                readiness_status=status,
                ml_confidence=ml_conf
            )
            db.add(rec_entry)
        
        recommendation_results.append(
            RecommendationResponse(
                career_id=career.id,
                career_title=career.title,
                match_score=match_score,
                readiness_status=status,
                ml_confidence=ml_conf,
                skill_gaps=gaps
            )
        )
    
    db.commit()
    
    # Sort by match score
    recommendation_results.sort(key=lambda x: x.match_score, reverse=True)

    return DashboardResponse(
        user=current_user.username,
        recommendations=recommendation_results
    )

@router.get("/ai-insight")
def get_ai_insight(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Detailed AI Insight for Top Banner.
    """
    # Reuse logic to get match score
    # Ideally refactor `get_dashboard` to shared service, but for now duplicate/call
    # We'll just fetch the latest recommendation
    rec = db.query(Recommendation).filter(Recommendation.user_id == current_user.id).order_by(Recommendation.match_score.desc()).first()
    
    readiness = int(rec.match_score) if rec else 0
    role = rec.career.title if rec else "Agronomist"
    
    # Calculate Projected Growth & Time Estimate
    # Mock Logic: Growth = Missing Skills * 14%, Time = Missing Skills * 7 days
    # Need gaps
    growth = 28 # Default mockup start
    days = 14
    
    if rec:
        reqs = db.query(CareerSkillRequirement).filter(CareerSkillRequirement.career_id == rec.career_id).all()
        user_skills_map = {us.skill_id: us.proficiency_level for us in current_user.user_skills}
        
        missing_count = 0
        total_gap = 0
        for r in reqs:
            ul = user_skills_map.get(r.skill_id, 0)
            if ul < r.required_level:
                missing_count += 1
                total_gap += (r.required_level - ul)
        
        if missing_count > 0:
            growth = min(missing_count * 14, 100 - readiness)
            days = missing_count * 7
    
    return {
        "role": role,
        "readiness": readiness,
        "projected_growth": growth,
        "time_estimate_days": days,
        "talent_pool_rank": "Top 5%" # Mock for demo
    }
