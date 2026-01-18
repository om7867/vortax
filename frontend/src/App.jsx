import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import EnterpriseDashboard from './pages/Dashboard/EnterpriseDashboard';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SignupWizard from './pages/SignupWizard';
import GapAnalysis from './pages/GapAnalysis';
import Recommendations from './pages/Recommendations';
import SkillAssessment from './pages/SkillAssessment';
import LearningJourney from './pages/LearningJourney';
import ResetPassword from './pages/ResetPassword';

import UserProfile from './pages/UserProfile';
import StartTest from './pages/Assessment/StartTest';
import TestInterface from './pages/Assessment/TestInterface';
import TestResult from './pages/Assessment/TestResult';
import SkillsDashboard from './pages/Scoring/SkillsDashboard';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <>
      <Navbar />
      <div className="pt-16">
        {children}
      </div>
    </>
  );
};

// RecommendationsGuard removed to allow direct access to recommendations as per user request

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupWizard />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <EnterpriseDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          {/* PathIQ Routes */}
          <Route
            path="/skills/gap-analysis"
            element={
              <ProtectedRoute>
                <GapAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <Recommendations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skills/assessment"
            element={
              <ProtectedRoute>
                <StartTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment/test/:testId"
            element={
              <ProtectedRoute>
                <TestInterface />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assessment/result/:testId"
            element={
              <ProtectedRoute>
                <TestResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skills/dashboard"
            element={
              <ProtectedRoute>
                <SkillsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning-journey"
            element={
              <ProtectedRoute>
                <LearningJourney />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
