import React from 'react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import AlumniDashboard from './AlumniDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'alumni') {
    return <AlumniDashboard />;
  }

  return <StudentDashboard />;
};

export default Dashboard;