import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2, Shield, User, Settings, LogOut } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  approved: boolean;
}

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('AdminDashboard: Checking authentication...');
      
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('AdminDashboard: Session error:', sessionError);
        setError('Session check failed');
        setLoading(false);
        return;
      }

      if (!session?.user) {
        console.log('AdminDashboard: No session, redirecting to login');
        navigate('/login');
        return;
      }

      console.log('AdminDashboard: Session found, user ID:', session.user.id);
      setUser(session.user);

      // Try to get user profile
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('AdminDashboard: Profile error:', profileError);
          if (profileError.code === '42P17') {
            setError('Database configuration error. Please contact administrator.');
          } else if (profileError.code === 'PGRST116') {
            setError('User profile not found. Please contact administrator.');
          } else {
            setError(`Profile error: ${profileError.message}`);
          }
        } else {
          console.log('AdminDashboard: Profile loaded:', profileData);
          setProfile(profileData);
          
          // Check if user is platform admin
          if (profileData.role !== 'platform_admin') {
            setError(`Access denied. Required role: platform_admin, your role: ${profileData.role}`);
          }
        }
      } catch (profileErr) {
        console.error('AdminDashboard: Profile fetch failed:', profileErr);
        setError('Failed to load user profile');
      }

      setLoading(false);
    } catch (err) {
      console.error('AdminDashboard: Auth check failed:', err);
      setError('Authentication check failed');
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Sign out error:', err);
      window.location.href = '/login';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur d'accès</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={handleSignOut}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Se déconnecter
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile || profile.role !== 'platform_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès non autorisé</h2>
          <p className="text-gray-600 mb-4">
            Vous devez être administrateur de plateforme pour accéder à cette section.
          </p>
          {profile && (
            <p className="text-sm text-gray-500 mb-6">Rôle actuel: {profile.role}</p>
          )}
          <button 
            onClick={handleSignOut}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Administration SchoolConnect
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span>{profile.full_name}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tableau de bord administrateur
          </h2>
          <p className="text-gray-600">
            Bienvenue dans l'interface d'administration de SchoolConnect
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Utilisateurs</h3>
                <p className="text-sm text-gray-600">Gérer les comptes utilisateurs</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Settings className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Écoles</h3>
                <p className="text-sm text-gray-600">Gérer les établissements</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Paramètres</h3>
                <p className="text-sm text-gray-600">Configuration système</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations système</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Utilisateur connecté:</span>
              <span className="font-medium">{profile.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rôle:</span>
              <span className="font-medium">{profile.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Statut:</span>
              <span className="font-medium text-green-600">
                {profile.approved ? 'Approuvé' : 'En attente'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
