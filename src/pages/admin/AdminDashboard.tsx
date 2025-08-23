import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { Loader2, AlertCircle, LogOut, Shield, Users, School, Settings } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, profile, loading, error, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication and role-based access
    if (!loading) {
      if (!user || !profile) {
        console.log('AdminDashboard: No user or profile, redirecting to login');
        navigate('/login');
        return;
      }

      if (profile.role !== 'platform_admin') {
        console.log('AdminDashboard: User is not platform_admin, redirecting based on role');
        // Redirect non-admin users based on their role
        switch (profile.role) {
          case 'school_admin':
          case 'teacher':
          case 'parent':
            navigate('/dashboard'); // Regular user dashboard
            break;
          default:
            navigate('/login');
        }
        return;
      }

      if (!profile.approved) {
        console.log('AdminDashboard: User not approved');
        // Could redirect to a "pending approval" page
        navigate('/login');
        return;
      }

      console.log('AdminDashboard: Access granted for platform_admin');
    }
  }, [user, profile, loading, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <button
                onClick={signOut}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4 inline mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard content
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {profile?.full_name || user?.email}
              </span>
              <button
                onClick={signOut}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                <LogOut className="h-4 w-4 inline mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Platform Administration</h2>
              <p className="text-gray-600 mb-8">Welcome to the SchoolConnect admin dashboard</p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Users</h3>
                  <p className="text-gray-600">Manage platform users</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <School className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Schools</h3>
                  <p className="text-gray-600">Manage schools</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <Settings className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                  <p className="text-gray-600">Platform configuration</p>
                </div>
              </div>

              {/* User Info */}
              <div className="bg-white p-6 rounded-lg shadow text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current User Information</h3>
                <div className="space-y-2">
                  <p><strong>Email:</strong> {profile?.email || user?.email}</p>
                  <p><strong>Name:</strong> {profile?.full_name || 'Not set'}</p>
                  <p><strong>Role:</strong> {profile?.role || 'Unknown'}</p>
                  <p><strong>Approved:</strong> {profile?.approved ? 'Yes' : 'No'}</p>
                  <p><strong>User ID:</strong> {profile?.id || user?.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
