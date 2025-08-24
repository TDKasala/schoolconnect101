import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { SimpleAuthProvider } from './contexts/SimpleAuthContext';
import { ToastProvider } from './contexts/ToastContext';

// Auth pages
import { Login } from './pages/Login'

// Protected pages
import { Dashboard } from './pages/Dashboard'

// Admin components and pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminNotifications } from './pages/admin/AdminNotifications';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';
import { AdminPlatformMessaging } from './pages/admin/AdminPlatformMessaging';
import { AdminContactCenter } from './pages/admin/AdminContactCenter';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminRoles } from './pages/admin/AdminRoles';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminAIGenerator } from './pages/admin/AdminAIGenerator';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminSupport } from './pages/admin/AdminSupport';

// School Admin components and pages
import { SchoolAdminLayout } from './components/school/SchoolAdminLayout';
import { SchoolDashboard } from './pages/school/SchoolDashboard';
import { SchoolStudents } from './pages/school/SchoolStudents';
import { SchoolTeachers } from './pages/school/SchoolTeachers';
import { SchoolClasses } from './pages/school/SchoolClasses';
import { SchoolAttendance } from './pages/school/SchoolAttendance';
import { SchoolGrades } from './pages/school/SchoolGrades';
import { SchoolPayments } from './pages/school/SchoolPayments';
import { SchoolMessages } from './pages/school/SchoolMessages';
import { SchoolEvents } from './pages/school/SchoolEvents';

function App() {
  return (
    <SimpleAuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
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
                <Route path="platform-messaging" element={<AdminPlatformMessaging />} />
                <Route path="contact-center" element={<AdminContactCenter />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="roles" element={<AdminRoles />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="ai-generator" element={<AdminAIGenerator />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="support" element={<AdminSupport />} />
              </Route>
              
              {/* School Admin routes with layout */}
              <Route path="/school" element={<SchoolAdminLayout />}>
                <Route path="dashboard" element={<SchoolDashboard />} />
                <Route path="students" element={<SchoolStudents />} />
                <Route path="teachers" element={<SchoolTeachers />} />
                <Route path="classes" element={<SchoolClasses />} />
                <Route path="attendance" element={<SchoolAttendance />} />
                <Route path="grades" element={<SchoolGrades />} />
                <Route path="payments" element={<SchoolPayments />} />
                <Route path="messages" element={<SchoolMessages />} />
                <Route path="events" element={<SchoolEvents />} />
              </Route>
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </SimpleAuthProvider>
  )
}

export default App
