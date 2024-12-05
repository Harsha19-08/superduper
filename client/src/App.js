import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AssignmentProvider } from './context/AssignmentContext';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AssignmentProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/student-dashboard"
                element={
                  <ProtectedRoute userType="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/faculty-dashboard"
                element={
                  <ProtectedRoute userType="faculty">
                    <FacultyDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </AssignmentProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
