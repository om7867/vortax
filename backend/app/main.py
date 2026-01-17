"""
Main FastAPI application entry point.
Refactored for Database-First Architecture.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api import user, admin, dashboard, skillpath, profile
from app.auth import routes as auth_routes
# from app.core.seed import seed_database # Seed is now manual script

# Initialize database tables (Automatic)
# In production, use Alembic. For now, create_all is fine since we have strictly defined models.
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Holistic Agriculture Skill Intelligence System",
    description="ML-powered career guidance database-first architecture",
    version="2.0.0"
)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ], 
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
app.include_router(profile.router, prefix="/profile", tags=["Profile"])

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
