# AgriNova - Holistic Agriculture Skill Intelligence System

AgriNova is an AI-powered platform designed to align academic and professional skills with industry needs in **Agriculture**, **Healthcare**, and **Smart Cities**. It provides real-time skill gap analysis, readiness tracking, and ML-driven career recommendations.

## 🚀 Features

### Core Platform
- **Holistic Assessment**: Tracks skills across the Health-Agri-Urban nexus.
- **AI Career Guidance**: `Scikit-Learn` based recommendation engine predicts ideal career paths.
- **Smart Dashboard**: Visualizes "Ready", "Near Ready", and "Developing" status for various roles.
- **Audit Logging**: Fully auditable system actions for security and compliance.

### Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Recharts.
- **Backend**: Python FastAPI, SQLAlchemy, PostgreSQL.
- **Data Science**: Scikit-Learn (Decision Trees), NumPy.
- **Security**: JWT Authentication, Bcrypt Password Hashing.

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL Database

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Activate venv (Windows: venv\Scripts\activate, Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
*Note: Ensure `.env` is configured with your `DATABASE_URL`.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Access the app at `http://localhost:5173`.

## 📂 Project Structure

- `backend/app/models`: Database schema (Users, Skills, Careers, AuditLog).
- `backend/app/ml`: Machine Learning logic (`predictor.py`).
- `backend/app/api`: REST API endpoints (Auth, Admin, Dashboard).
- `frontend/src/pages`: React Pages (Home, SignupWizard, Dashboard, Admin).
- `frontend/src/components`: Reusable UI components (shadcn/ui style).

## 🔮 Future Roadmap
- Integration with LinkedIn API for auto-profile import.
- Advanced Deep Learning models for skill trajectory prediction.
- Corporate portal for employers to post real-time requirements.

---
**Designed by Jugal A. | AgriNova Team**
