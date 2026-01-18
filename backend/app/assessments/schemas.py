from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict
from uuid import UUID
from datetime import datetime
from app.assessments.models import TestStatus, ConfidenceLevel

# --- INPUT SCHEMAS ---

class TestCreate(BaseModel):
    domain: Optional[str] = None # Optional override, else from profile
    target_role: Optional[str] = None # Optional override

class AnswerSubmit(BaseModel):
    question_id: UUID
    selected_option_index: int

class TestSubmission(BaseModel):
    test_id: UUID
    answers: List[AnswerSubmit]

# --- OUTPUT SCHEMAS ---

class TestQuestionOut(BaseModel):
    id: UUID
    skill_name: str
    question_text: str
    options: List[str]
    # Correct answer hidden from frontend
    
    model_config = ConfigDict(from_attributes=True)

class SkillTestOut(BaseModel):
    id: UUID
    status: TestStatus
    total_questions: int
    started_at: datetime
    questions: Optional[List[TestQuestionOut]] = None
    
    model_config = ConfigDict(from_attributes=True)

class SkillResultOut(BaseModel):
    skill_id: UUID
    skill_name: str
    score_percentage: float
    confidence_level: ConfidenceLevel

class TestResultOut(BaseModel):
    test_id: UUID
    total_score: float
    status: TestStatus
    submitted_at: Optional[datetime]
    skill_results: List[SkillResultOut]
    
    model_config = ConfigDict(from_attributes=True)
