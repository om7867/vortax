from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set. Please configure it for PostgreSQL.")

# Ensure we are using PostgreSQL
if not DATABASE_URL.startswith("postgresql"):
    # Handle case where scheme might be 'postgres://' which SQLAlchemy < 1.4 deprecated in favor of 'postgresql://'
    # But usually it's fine. If user provides sqlite, we should warn or error strictly as requested.
    if DATABASE_URL.startswith("sqlite"):
         raise ValueError("SQLite is not supported. Please use PostgreSQL.")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
