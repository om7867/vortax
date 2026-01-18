"""
Main FastAPI application entry point.
Refactored for Database-First Architecture.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api import user, admin, dashboard, skillpath, profile
from app.auth import routes as auth_routes
# MODULE 2: Profile, Skills & Certifications
from app.profile import routes as profile_v2_routes
from app.profile import admin_routes as profile_admin_routes
from app.skills import routes as skills_routes
from app.certifications import routes as certifications_routes
from app.assessments import routes as assessment_routes
from app.scoring import routes as scoring_routes
from app.gap_analysis import routes as gap_analysis_routes
from app.dashboard import routes as dashboard_routes
from app.recommendations import routes as recommendation_routes
from app import all_models
# from app.core.seed import seed_database # Seed is now manual script

# Initialize database tables (Automatic)
# In production, use Alembic. For now, create_all is fine since we have strictly defined models.
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Holistic Agriculture Skill Intelligence System - PathIQ",
    description="ML-powered career guidance database-first architecture with comprehensive profile management",
    version="2.1.0"
)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permissive for local development to resolve persistent CORS issues
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_routes.router, prefix="/auth", tags=["Auth"])
app.include_router(user.router, prefix="/user", tags=["User"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(skillpath.router, prefix="/skillpath", tags=["SkillPath"])
app.include_router(profile.router, prefix="/profile", tags=["Profile"])  # Legacy profile endpoint

# MODULE 2: New Profile, Skills & Certifications endpoints
app.include_router(profile_v2_routes.router, prefix="/api/v2/profile", tags=["Profile V2"])
app.include_router(skills_routes.router, prefix="/api/v2/skills", tags=["Skills V2"])
app.include_router(certifications_routes.router, prefix="/api/v2/certifications", tags=["Certifications V2"])
app.include_router(profile_admin_routes.router, prefix="/api/v2/admin", tags=["Admin - Skills V2"])
app.include_router(assessment_routes.router, prefix="/api/v3/assessments", tags=["Assessments V3"])
app.include_router(scoring_routes.router, prefix="/api/v4/scoring", tags=["Scoring V4"])
app.include_router(gap_analysis_routes.router, prefix="/api/v5/gap-analysis", tags=["Gap Analysis V5"])
app.include_router(dashboard_routes.router, prefix="/api/dashboard", tags=["Unified Dashboard"])
app.include_router(recommendation_routes.router, prefix="/api/v6/recommendations", tags=["Recommendations V6"])

@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "Welcome to the Holistic Agriculture Skill Intelligence System API (v2.0)",
        "docs": "/docs",
        "status": "online"
    }

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
