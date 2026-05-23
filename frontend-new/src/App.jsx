import React from 'react';

import {

  BrowserRouter as Router,

  Routes,

  Route,

  Navigate

} from 'react-router-dom';

import {

  AuthProvider,

  useAuth

} from './context/AuthContext';

// =========================================
// PAGES
// =========================================

import Landing from './pages/Landing';

import Login from './pages/Login';

import Register from './pages/Register';

import Dashboard from './pages/Dashboard';

import Alumni from './pages/Alumni';

import Profile from './pages/Profile';

import Messages from './pages/Messages';

import AdminDashboard from './pages/AdminDashboard';

import BroadcastFeed from './pages/BroadcastFeed';

// =========================================
// COMPONENTS
// =========================================

import Navbar from './components/Navbar';

// =========================================
// PROTECTED ROUTE
// =========================================

const ProtectedRoute = ({
  children
}) => {

  const { user } = useAuth();

  if (!user) {

    return (
      <Navigate to="/login" />
    );

  }

  return children;

};

// =========================================
// ADMIN ROUTE
// =========================================

const AdminRoute = ({
  children
}) => {

  const { user } = useAuth();

  if (!user) {

    return (
      <Navigate to="/login" />
    );

  }

  if (user.role !== 'admin') {

    return (
      <Navigate to="/dashboard" />
    );

  }

  return children;

};

// =========================================
// MAIN APP
// =========================================

function App() {

  return (

    <AuthProvider>

      <Router>

        <div className="app-container">

          {/* NAVBAR */}

          <Navbar />

          {/* ROUTES */}

          <Routes>

            {/* PUBLIC */}

            <Route
              path="/"
              element={<Landing />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            {/* DASHBOARD */}

            <Route
              path="/dashboard"
              element={

                <ProtectedRoute>

                  <Dashboard />

                </ProtectedRoute>

              }
            />

            {/* PROFILE */}

            <Route
              path="/profile"
              element={

                <ProtectedRoute>

                  <Profile />

                </ProtectedRoute>

              }
            />

            {/* ALUMNI */}

            <Route
              path="/alumni"
              element={

                <ProtectedRoute>

                  <Alumni />

                </ProtectedRoute>

              }
            />

            {/* MESSAGES */}

            <Route
              path="/messages"
              element={

                <ProtectedRoute>

                  <Messages />

                </ProtectedRoute>

              }
            />

            {/* OPPORTUNITIES */}

            <Route
              path="/broadcasts"
              element={

                <ProtectedRoute>

                  <BroadcastFeed />

                </ProtectedRoute>

              }
            />

            {/* ADMIN */}

            <Route
              path="/admin"
              element={

                <AdminRoute>

                  <AdminDashboard />

                </AdminRoute>

              }
            />

            {/* FALLBACK */}

            <Route
              path="*"
              element={
                <Navigate to="/" />
              }
            />

          </Routes>

        </div>

      </Router>

    </AuthProvider>

  );

}

export default App;