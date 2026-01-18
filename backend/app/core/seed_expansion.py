
"""
Expansion Seeder for AI Skill Intelligence System.
Populates courses, trending skills, and job roles with LinkedIn integration.
"""
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.recommendations.models import LearningResource, TrendingSkill, JobRole, ResourceType, DifficultyLevel, Recommendation, UserLearningPlan
from app.skills.models import SkillMaster, SkillDomain, SkillCategory
import uuid
from app import all_models

def seed_expansion():
    print("Starting AI System expansion seed...")
    db = SessionLocal()
    
    # 1. Fetch some existing skills to link resources to
    skills = db.query(SkillMaster).all()
    if not skills:
        print("No skills found. Please run the main seed.py first.")
        db.close()
        return

    skill_ids = {s.name: s.id for s in skills}
    
    # 2. Seed Trending Skills
    print("Seeding Trending Skills...")
    db.query(TrendingSkill).delete()
    trending = [
        TrendingSkill(skill_name="Regenerative Agriculture", industry="AgriTech", demand_score=92.5, growth_rate=18.4),
        TrendingSkill(skill_name="Neural Link Processing", industry="Technology", demand_score=88.0, growth_rate=22.1),
        TrendingSkill(skill_name="Bio-Data Analytics", industry="HealthTech", demand_score=95.0, growth_rate=15.8),
        TrendingSkill(skill_name="Vertical Farm Automation", industry="AgriTech", demand_score=85.0, growth_rate=12.5),
        TrendingSkill(skill_name="Climate Resilience", industry="AgriTech", demand_score=98.0, growth_rate=25.0),
        TrendingSkill(skill_name="Precision Irrigation", industry="AgriTech", demand_score=89.0, growth_rate=14.2),
        TrendingSkill(skill_name="Agri-Supply Chain AI", industry="Logistics", demand_score=78.5, growth_rate=10.2),
    ]
    db.add_all(trending)
    db.commit()

    # 3. Seed Courses (Detailed Dataset)
    print("Seeding Detailed Courses...")
    # Clear dependent tables first
    db.query(Recommendation).delete()
    db.query(UserLearningPlan).delete()
    db.query(LearningResource).delete()
    
    providers = ["Coursera", "Udemy", "edX", "Pluralsight", "LinkedIn Learning", "PathIQ Academy"]
    
    detailed_courses = [
        # Soil Health
        ("Basics of Soil Microbiology", "Soil Microbiology", DifficultyLevel.BEGINNER, "10 hours"),
        ("Advanced Nutrient Management", "Soil Health", DifficultyLevel.INTERMEDIATE, "15 hours"),
        ("Regenerative Farming Implementation", "Regenerative Agriculture", DifficultyLevel.ADVANCED, "25 hours"),
        
        # Precision Farming
        ("IoT Sensors 101", "IoT Sensors", DifficultyLevel.BEGINNER, "8 hours"),
        ("Satellite Imaging for Crops", "Precision Agriculture", DifficultyLevel.INTERMEDIATE, "20 hours"),
        ("Autonomous Farm Systems", "Automation", DifficultyLevel.ADVANCED, "40 hours"),
        
        # Data & AI
        ("Python for Agriculture", "Python", DifficultyLevel.BEGINNER, "12 hours"),
        ("Predictive Yield Modeling", "Data Analysis", DifficultyLevel.INTERMEDIATE, "30 hours"),
        ("Neural Networks in Botany", "Precision Agriculture", DifficultyLevel.ADVANCED, "50 hours"),
        
        # Sustainability
        ("Climate Resilience in Farming", "Sustainable Agriculture", DifficultyLevel.BEGINNER, "10 hours"),
        ("Water Conservation Technology", "Sustainable Agriculture", DifficultyLevel.INTERMEDIATE, "18 hours"),
        ("Global Agri-Policy Mastery", "Policy", DifficultyLevel.ADVANCED, "22 hours"),
    ]

    resources = []
    for title, skill_name, level, duration in detailed_courses:
        # Match skill ID
        skill_id = None
        for s_name, s_id in skill_ids.items():
            if skill_name.lower() in s_name.lower():
                skill_id = s_id
                break
        
        if not skill_id:
            # Fallback to random skill if exact match not found
            skill_id = list(skill_ids.values())[0]

        resources.append(LearningResource(
            title=title,
            resource_type=ResourceType.COURSE,
            provider=providers[hash(title) % len(providers)],
            skill_id=skill_id,
            difficulty_level=level,
            duration_hours=float(duration.split()[0]),
            duration_estimate=duration,
            external_url=f"https://pathiq.edu/course/{uuid.uuid4().hex[:8]}",
            rating=4.5,
            domain="Agriculture"
        ))
        
        # Also add a PROJECT for each skill
        resources.append(LearningResource(
            title=f"Hands-on {skill_name} Project",
            resource_type=ResourceType.PROJECT,
            provider="PathIQ Labs",
            skill_id=skill_id,
            difficulty_level=level,
            duration_hours=float(duration.split()[0]) * 2,
            duration_estimate=f"{int(duration.split()[0]) * 2} hours",
            external_url=f"https://pathiq.edu/project/{uuid.uuid4().hex[:8]}",
            rating=4.8,
            domain="Agriculture"
        ))

    db.add_all(resources)
    db.commit()

    # 4. Seed Job Roles
    print("Seeding Detailed Job Roles...")
    db.query(JobRole).delete()
    jobs = [
        JobRole(
            title="Precision Ag Data Scientist", 
            company="Harvest Robotics", 
            sector="AgriTech", 
            required_skills=["Precision Agriculture", "Data Analysis", "Python"],
            min_readiness_percentage=75.0,
            linkedin_url="https://www.linkedin.com/jobs/search/?keywords=precision+agriculture"
        ),
        JobRole(
            title="Chief Soil Health Analyst", 
            company="TerraFirma Labs", 
            sector="Environmental", 
            required_skills=["Soil Health", "Microbiology", "Data Analysis"],
            min_readiness_percentage=80.0,
            linkedin_url="https://www.linkedin.com/jobs/search/?keywords=soil+scientist"
        ),
        JobRole(
            title="Sustainability Manager", 
            company="Global Green Corp", 
            sector="Agriculture", 
            required_skills=["Sustainable Agriculture", "Policy"],
            min_readiness_percentage=65.0,
            linkedin_url="https://www.linkedin.com/jobs/search/?keywords=sustainability+agriculture"
        ),
        JobRole(
            title="IoT Farm Systems Engineer", 
            company="SenseCloud Agri", 
            sector="AgriTech", 
            required_skills=["IoT Sensors", "Automation"],
            min_readiness_percentage=70.0,
            linkedin_url="https://www.linkedin.com/jobs/search/?keywords=iot+agriculture"
        ),
        JobRole(
            title="Agronomist - Digital Transformation", 
            company="Bayer Crop Science", 
            sector="AgriTech", 
            required_skills=["Crop Science", "Data Analysis"],
            min_readiness_percentage=60.0,
            linkedin_url="https://www.linkedin.com/jobs/search/?keywords=agronomist"
        ),
    ]
    db.add_all(jobs)
    db.commit()

    print("Expansion seeding complete!")
    db.close()

if __name__ == "__main__":
    seed_expansion()
