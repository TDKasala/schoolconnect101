import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { SimpleAuthProvider } from './contexts/SimpleAuthContext'

// Auth pages
import { Login } from './pages/Login'

// Protected pages
import { Dashboard } from './pages/Dashboard'

// Admin components and pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverview } from './pages/admin/AdminOverview';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminNotifications from './pages/admin/AdminNotifications';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminRoles } from './pages/admin/AdminRoles';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminAIGenerator } from './pages/admin/AdminAIGenerator';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminSupport } from './pages/admin/AdminSupport';

function App() {
  return (
    <SimpleAuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected user routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Admin routes with layout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminOverview />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="audit-logs" element={<AdminAuditLogs />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="roles" element={<AdminRoles />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="ai-generator" element={<AdminAIGenerator />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="support" element={<AdminSupport />} />
            </Route>
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </SimpleAuthProvider>
  )
}

export default App
