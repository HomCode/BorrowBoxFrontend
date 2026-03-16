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
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/web/login" />} />
        <Route path="/web/login" element={<WebLogin />} />
        <Route path="/web/register" element={<WebRegister />} />

        <Route
          path="/web/student/dashboard"
          element={
            <WebStudentLayout>
              <WebStudentDashboard />
            </WebStudentLayout>
          }
        />

        <Route
          path="/web/student/borrows"
          element={
            <WebStudentLayout>
              <WebStudentBorrows />
            </WebStudentLayout>
          }
        />

        <Route
          path="/web/student/profile"
          element={
            <WebStudentLayout>
              <Profile />
            </WebStudentLayout>
          }
        />

        <Route
          path="/web/officer/dashboard"
          element={
            <WebOfficerLayout>
              <WebOfficerDashboard />
            </WebOfficerLayout>
          }
        />

        <Route
          path="/web/officer/items"
          element={
            <WebOfficerLayout>
              <WebOfficerItems />
            </WebOfficerLayout>
          }
        />

        <Route
          path="/web/officer/transactions"
          element={
            <WebOfficerLayout>
              <WebOfficerTransactions />
            </WebOfficerLayout>
          }
        />

        <Route
          path="/web/officer/profile"
          element={
            <WebOfficerLayout>
              <Profile />
            </WebOfficerLayout>
          }
        />

        <Route path="*" element={<Navigate to="/web/login" />} />
      </Routes>
    </Router>
  );
}

export default App;