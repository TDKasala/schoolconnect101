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
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0 flex-1">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:block text-sm text-gray-600 truncate">
                Welcome, {profile?.full_name || user?.email}
              </span>
              <button
                onClick={signOut}
                className="bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-md hover:bg-red-700 transition-colors text-xs sm:text-sm flex items-center"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="text-center">
              <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-blue-600 mx-auto mb-3 sm:mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Administration Plateforme</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Bienvenue sur le tableau de bord administrateur SchoolConnect</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-center">
                <Users className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 mx-auto mb-3" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Utilisateurs</h3>
                <p className="text-sm text-gray-600 mb-3">Gérer les utilisateurs de la plateforme</p>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="w-full bg-blue-50 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  Gérer les Utilisateurs
                </button>
              </div>
            </div>
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-center">
                <School className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 mx-auto mb-3" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Écoles</h3>
                <p className="text-sm text-gray-600 mb-3">Gérer les établissements scolaires</p>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="w-full bg-green-50 text-green-700 px-3 py-2 rounded-md hover:bg-green-100 transition-colors text-sm font-medium"
                >
                  Gérer les Écoles
                </button>
              </div>
            </div>
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="text-center">
                <Settings className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600 mx-auto mb-3" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Paramètres</h3>
                <p className="text-sm text-gray-600 mb-3">Configuration de la plateforme</p>
                <button
                  onClick={() => navigate('/admin/settings')}
                  className="w-full bg-purple-50 text-purple-700 px-3 py-2 rounded-md hover:bg-purple-100 transition-colors text-sm font-medium"
                >
                  Accéder aux Paramètres
                </button>
              </div>
            </div>
          </div>

          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 text-blue-600 mr-2" />
              Informations Utilisateur Actuel
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-sm font-medium text-gray-500 sm:w-20">Email:</span>
                  <span className="text-sm text-gray-900 break-all">{profile?.email || user?.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-sm font-medium text-gray-500 sm:w-20">Nom:</span>
                  <span className="text-sm text-gray-900">{profile?.full_name || 'Non défini'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-sm font-medium text-gray-500 sm:w-20">Rôle:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {profile?.role === 'platform_admin' ? 'Admin Plateforme' : profile?.role || 'Inconnu'}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-sm font-medium text-gray-500 sm:w-24">Approuvé:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    profile?.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {profile?.approved ? 'Oui' : 'Non'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-sm font-medium text-gray-500 sm:w-24">ID:</span>
                  <span className="text-xs text-gray-600 font-mono break-all">{profile?.id || user?.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
