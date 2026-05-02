import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { WebLogin } from './components/web/auth/WebLogin';
import { WebRegister } from './components/web/auth/WebRegister';

import { WebStudentLayout } from './components/web/student/WebStudentLayout';
import { WebStudentDashboard } from './components/web/student/WebStudentDashboard';
import { WebStudentBorrows } from './components/web/student/WebStudentBorrows';

import { WebOfficerLayout } from './components/web/officer/WebOfficerLayout';
import { WebOfficerDashboard } from './components/web/officer/WebOfficerDashboard';
import { WebOfficerItems } from './components/web/officer/WebOfficerItems';
import { WebOfficerTransactions } from './components/web/officer/WebOfficerTransactions';

import Profile from './components/Profile';
import { getCurrentUser, isAuthenticated } from './api/auth';
import './App.css';

function ProtectedRoute({ allowedRole, children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/web/login" replace />;
  }

  const user = getCurrentUser();
  const role = user?.role?.toLowerCase();

  if (allowedRole && role !== allowedRole) {
    if (role === 'student') return <Navigate to="/web/student/dashboard" replace />;
    if (role === 'officer') return <Navigate to="/web/officer/dashboard" replace />;
    return <Navigate to="/web/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/web/login" replace />} />
        <Route path="/web/login" element={<WebLogin />} />
        <Route path="/web/register" element={<WebRegister />} />

        <Route
          path="/web/student/dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <WebStudentLayout>
                <WebStudentDashboard />
              </WebStudentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/web/student/borrows"
          element={
            <ProtectedRoute allowedRole="student">
              <WebStudentLayout>
                <WebStudentBorrows />
              </WebStudentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/web/student/profile"
          element={
            <ProtectedRoute allowedRole="student">
              <WebStudentLayout>
                <Profile />
              </WebStudentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/web/officer/dashboard"
          element={
            <ProtectedRoute allowedRole="officer">
              <WebOfficerLayout>
                <WebOfficerDashboard />
              </WebOfficerLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/web/officer/items"
          element={
            <ProtectedRoute allowedRole="officer">
              <WebOfficerLayout>
                <WebOfficerItems />
              </WebOfficerLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/web/officer/transactions"
          element={
            <ProtectedRoute allowedRole="officer">
              <WebOfficerLayout>
                <WebOfficerTransactions />
              </WebOfficerLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/web/officer/profile"
          element={
            <ProtectedRoute allowedRole="officer">
              <WebOfficerLayout>
                <Profile />
              </WebOfficerLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/web/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;