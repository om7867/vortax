import json
import os
import random
from typing import List, Dict

# Mocking OpenAI for now to ensure functionality without API Key during dev
# In production, this would use `openai.ChatCompletion.create`

class AIGenerator:
    @staticmethod
    def generate_question(skill_name: str, domain: str, difficulty: int) -> Dict:
        """
        Generates a single multiple choice question for a given skill.
        Returns a dict with: question_text, options (4), correct_option_index (0-3).
        """
        
        # PROMPT TEMPLATE (For real AI)
        prompt = f"""
        Generate a multiple-choice question for skill '{skill_name}' 
        in domain '{domain}' at difficulty level {difficulty}/5.
        Provide:
        - Question
        - 4 options
        - Correct answer index
        Return strictly valid JSON.
        """
        
        # MOCK RESPONSE (For reliable dev testing without costs)
        # This simulates a "smart" response
        
        topics = {
            "Python": ["decorators", "generators", "list comprehensions", "GIL"],
            "React": ["hooks", "virtual DOM", "state management", "props"],
            "SQL": ["joins", "indexes", "transactions", "normalization"],
            "Agriculture": ["crop rotation", "soil pH", "irrigation", "pest control"]
        }
        
        relevant_topics = [t for k, v in topics.items() if k.lower() in skill_name.lower() or k.lower() in domain.lower() for t in v]
        topic = random.choice(relevant_topics) if relevant_topics else "general concepts"
        
        question = f"What is the primary function of {topic} in the context of {skill_name}?"
        options = [
            f"To optimize {topic} performance",
            f"To disable {topic} features",
            f"To debug {topic} errors",
            f"To visualize {topic} data"
        ]
        
        return {
            "question_text": question,
            "options": options,
            "correct_option_index": 0, # Keeping it simple for mock
            "difficulty": difficulty,
            "ai_generated": True
        }

    @staticmethod
    def generate_test_suite(skills: List[Dict]) -> List[Dict]:
        """
        Generates 25 questions (5 per skill)
        skills input: [{'name': 'Python', 'domain': 'Tech', 'difficulty': 3}, ...]
        """
        questions = []
        for skill in skills:
            for _ in range(5):
                q = AIGenerator.generate_question(
                    skill['name'], 
                    skill['domain'], 
                    skill['difficulty']
                )
                q['skill_id'] = skill['id']
                questions.append(q)
        return questions
