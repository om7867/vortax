from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from app.core.database import get_db
from app.models.models import Skill, UserSkill, Career, CareerSkillRequirement, Course, Project, Job, Assessment, Recommendation
from app.auth.models import User
from app.core.deps import get_current_user

router = APIRouter()

# 1. Gap Analysis for Radar Chart
@router.get("/gap-analysis")
def get_gap_analysis(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    recommendation = db.query(Recommendation).filter(Recommendation.user_id == user.id).order_by(Recommendation.match_score.desc()).first()
    
    if not recommendation:
        target_career = db.query(Career).filter(Career.domain == user.target_domain.upper()).first()
    else:
        target_career = recommendation.career

    if not target_career:
        return {"error": "No career path found"}

    # Get Requirements
    requirements = db.query(CareerSkillRequirement).filter(CareerSkillRequirement.career_id == target_career.id).all()
    
    data = []
    critical_missing = []
    needs_improvement = []

    # Helper: Normalize Skill Score
    def get_normalized_score(user_id, skill_name, base_level):
        score = base_level
        # Bonus: Projects (+1 each)
        # In real app, check association. Here simple count for demo if generic "Projects" exist
        # or verify specific skill text in project description
        # We will assume 'projects' link to skills via JSON 'skills_verified'
        user_projects = db.query(Project).all() # Should be user specific in real app, but we don't have user_projects table, assuming global for now or logic from 'UserSkill'
        # Actually UserSkill has 'evidence', let's use that if populated, or check generic Projects
        
        # Checking Certifications (+2 each)
        for cert in user.certifications:
             # Basic string match
             if skill_name.lower() in cert.title.lower():
                 score += 2
        
        return min(score, 10) # Clamp at 10

    for req in requirements:
        user_skill = db.query(UserSkill).filter(
            UserSkill.user_id == user.id,
            UserSkill.skill_id == req.skill_id
        ).first()
        
        base_level = user_skill.proficiency_level if user_skill else 0
        current_level = get_normalized_score(user.id, req.skill.name, base_level)
        
        # GAP FORMULA: gap = required - current
        gap = req.required_level - current_level
        
        data.append({
            "skill": req.skill.name,
            "required": req.required_level,
            "current": current_level,
            "gap": max(gap, 0),
            "fullMark": 10
        })

        if gap > 0:
            if current_level == 0:
                critical_missing.append(req.skill.name)
            else:
                 needs_improvement.append({
                    "skill": req.skill.name,
                    "current": current_level,
                    "required": req.required_level,
                    "gap": gap
                })

    return {
        "required": {d["skill"]: d["required"] for d in data},
        "user": {d["skill"]: d["current"] for d in data}
    }

@router.get("/high-impact-skills")
def get_high_impact_skills(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    # Reuse Gap Analysis Logic
    # For efficiency, we should refactor gap analysis to a service function.
    # checking /gap-analysis logic...
    # For now, we will re-implement a lightweight version or call internal helper if we had one.
    
    # Mocking real impact calculation based on "Critical" status
    return {
        "total_boost": 43, # Dynamic in real app
        "skills": [
            { "name": "Soil Analytics", "impact": 18 },
            { "name": "ML Basics", "impact": 25 }
        ]
    }

# 2. Personalized Recommendations (Courses & Projects)
@router.get("/recommendations")
def get_recommendations(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Logic: Find gaps, then finding courses/projects that teach those skills
    # 1. Identify Gaps (Reuse logic or simplify)
    user_skills = {us.skill_id: us.proficiency_level for us in user.user_skills}
    
    # Get all skills to map names
    all_skills = {s.name: s.id for s in db.query(Skill).all()}
    
    recommended_courses = []
    recommended_projects = []
    
    # Naive recommendation: Recommend things user hasn't verified
    # In real app, match against 'skills_gained' JSON
    
    courses = db.query(Course).all()
    for course in courses:
        # Check if course teaches a skill user is weak in or missing?
        # For demo, we just return all seeded courses as "High Priority"
        recommended_courses.append({
            "id": course.id,
            "title": course.title,
            "provider": course.provider,
            "difficulty": course.difficulty,
            "skills": course.skills_gained,
            "image": course.image_url,
            "why": "Fills critical gap in " + course.skills_gained[0]
        })

    projects = db.query(Project).all()
    for project in projects:
        recommended_projects.append({
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "skills": project.skills_verified,
            "image": project.image_url
        })
        
    return {
        "courses": recommended_courses,
        "projects": recommended_projects
    }

# 3. Job Matching
@router.get("/jobs")
def get_jobs(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Return jobs sorted by match score
    jobs = db.query(Job).order_by(Job.match_score.desc()).all()
    return jobs

# 4. Learning Journey (Timeline)
# 4. Learning Journey (Timeline)
@router.get("/timeline")
def get_timeline(user: User = Depends(get_current_user)):
    return {
      "steps": [
        { "title": "Profile Analysis", "status": "completed" },
        { "title": "Gap Detection", "status": "completed" },
        { "title": "Learning Plan", "status": "active" },
        { "title": "Project Assignment", "status": "locked" }
      ]
    }

@router.get("/recommendations/smart")
def get_smart_recommendations(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return {
      "recommendations": [
        {
          "type": "project",
          "title": "Build Crop Yield Prediction Model",
          "impact": 22,
          "duration_days": 5,
          "reason": "Fixes ML + Agri Data gap"
        },
        {
          "type": "course",
          "title": "Applied Soil Chemistry 101",
          "impact": 15,
          "duration_days": 14,
          "provider": "Corteva"
        }
      ]
    }

# Legacy History Endpoint (Optional, kept for backward compat if needed)
@router.get("/history")
def get_history(
    user: User = Depends(get_current_user)
):
    # Mock history based on user creation or static data
    # In real app, this comes from AuditLogs or UserSkill.last_updated
    return [
        {
            "id": 1,
            "title": 'Completed "Python for Beginners"',
            "type": "course",
            "date": "2 days ago",
            "skills": ["Python"]
        },
        {
            "id": 2,
            "title": 'Joined AgriNova',
            "type": "milestone",
            "date": "1 week ago",
            "skills": []
        }
    ]

# 5. Assessments
@router.get("/assessment/{skill_id}")
def get_assessment(
    skill_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    assessment = db.query(Assessment).filter(Assessment.skill_id == skill_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="No assessment found for this skill")
    
    return assessment

@router.post("/assessment/submit")
def submit_assessment(
    data: Dict[Any, Any], # {skill_id: 1, score: 80}
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    skill_id = data.get("skill_id")
    score = data.get("score")
    
    if score >= 70:
        # Update User Skill to verified or increase level
        existing_skill = db.query(UserSkill).filter(
            UserSkill.user_id == user.id,
            UserSkill.skill_id == skill_id
        ).first()
        
        if existing_skill:
            existing_skill.proficiency_level = min(existing_skill.proficiency_level + 2, 10)
            existing_skill.verified = True
        else:
            new_skill = UserSkill(
                user_id=user.id,
                skill_id=skill_id,
                proficiency_level=5, # Starter level
                verified=True
            )
            db.add(new_skill)
        
        db.commit()
        return {"status": "passed", "message": "Skill Verified!"}
    
    return {"status": "failed", "message": "Score too low. Try again."}
