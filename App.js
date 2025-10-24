import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import LecturerReport from './pages/LecturerReport'
import ReportsView from './pages/ReportsView'
import Classes from './pages/Classes'
import Monitoring from './pages/Monitoring'
import Rating from './pages/Rating'
import Courses from './pages/Courses'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <div className="container-fluid p-0">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/report" element={
              <ProtectedRoute allowedRoles={['lecturer']}>
                <LecturerReport />
              </ProtectedRoute>
            } />
            
            <Route path="/reports" element={
              <ProtectedRoute allowedRoles={['lecturer', 'prl', 'pl']}>
                <ReportsView />
              </ProtectedRoute>
            } />
            
            <Route path="/classes" element={
              <ProtectedRoute allowedRoles={['lecturer', 'prl', 'pl']}>
                <Classes />
              </ProtectedRoute>
            } />
            
            <Route path="/monitoring" element={
              <ProtectedRoute>
                <Monitoring />
              </ProtectedRoute>
            } />
            
            <Route path="/rating" element={
              <ProtectedRoute>
                <Rating />
              </ProtectedRoute>
            } />
            
            <Route path="/courses" element={
              <ProtectedRoute allowedRoles={['prl', 'pl']}>
                <Courses />
              </ProtectedRoute>
            } />

            {/* Fallback route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  )
}

export default App