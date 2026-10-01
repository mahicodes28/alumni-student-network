import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// PAGES
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import AdminDashboard from './pages/AdminDashboard';
import BroadcastFeed from './pages/BroadcastFeed';
import Mentors from './pages/Mentors';
import CareerAI from './pages/CareerAI';
import CareerSimulator from './pages/CareerSimulator';
import SkillGap from './pages/SkillGap';
import Roadmap from './pages/Roadmap';
import Learning from './pages/Learning';
import Opportunities from './pages/Opportunities';
import ResumeAI from './pages/ResumeAI';
import MockInterview from './pages/MockInterview';
import GovernmentJobs from './pages/GovernmentJobs';

// COMPONENTS
import Navbar from './components/Navbar';

// PROTECTED ROUTE
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

// DASHBOARD ROUTE (Redirects Admin to /admin)
const DashboardRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }
  return children;
};

// ADMIN ROUTE
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

// PUBLIC ROUTE
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            {/* DASHBOARD */}
            <Route path="/dashboard" element={<DashboardRoute><Dashboard /></DashboardRoute>} />

            {/* CAREERPATH AI MODULES */}
            <Route path="/career-ai" element={<ProtectedRoute><CareerAI /></ProtectedRoute>} />
            <Route path="/career-assistant" element={<Navigate to="/career-ai" />} />
            <Route path="/career-simulator" element={<ProtectedRoute><CareerSimulator /></ProtectedRoute>} />
            <Route path="/skill-gap" element={<ProtectedRoute><SkillGap /></ProtectedRoute>} />
            <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
            <Route path="/learning" element={<ProtectedRoute><Learning /></ProtectedRoute>} />
            <Route path="/opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
            <Route path="/broadcasts" element={<ProtectedRoute><BroadcastFeed /></ProtectedRoute>} />
            <Route path="/mentors" element={<ProtectedRoute><Mentors /></ProtectedRoute>} />
            <Route path="/alumni" element={<Navigate to="/mentors" />} />
            <Route path="/resume-ai" element={<ProtectedRoute><ResumeAI /></ProtectedRoute>} />
            <Route path="/mock-interview" element={<ProtectedRoute><MockInterview /></ProtectedRoute>} />
            <Route path="/government-jobs" element={<ProtectedRoute><GovernmentJobs /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* ADMIN */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;