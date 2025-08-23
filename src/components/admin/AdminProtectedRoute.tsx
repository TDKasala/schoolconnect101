import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2, Shield, AlertCircle } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, profile, loading, error, signOut } = useAuth();

  console.log('AdminProtectedRoute: Auth state', { 
    user: !!user, 
    profile: !!profile, 
    loading, 
    error,
    profileRole: profile?.role,
    profileApproved: profile?.approved 
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-blue mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Vérification des permissions...</p>
          <button 
            onClick={() => signOut()}
            className="text-sm text-brand-blue hover:text-brand-blue-dark underline"
          >
            Annuler et se déconnecter
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur d'authentification</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => signOut()}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('AdminProtectedRoute: No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profil non trouvé</h2>
          <p className="text-gray-600 mb-6">Votre profil utilisateur n'a pas été trouvé. Veuillez contacter un administrateur.</p>
          <button 
            onClick={() => signOut()}
            className="w-full bg-brand-blue text-white py-2 px-4 rounded-lg hover:bg-brand-blue-dark transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  if (!profile.approved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Compte en attente d'approbation</h2>
          <p className="text-gray-600 mb-6">Votre compte doit être approuvé par un administrateur avant d'accéder à cette section.</p>
          <button 
            onClick={() => signOut()}
            className="w-full bg-brand-blue text-white py-2 px-4 rounded-lg hover:bg-brand-blue-dark transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  if (profile.role !== 'platform_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès non autorisé</h2>
          <p className="text-gray-600 mb-4">Vous n'avez pas les permissions nécessaires pour accéder à l'administration de la plateforme.</p>
          <p className="text-sm text-gray-500 mb-6">Rôle actuel: {profile.role}</p>
          <button 
            onClick={() => signOut()}
            className="w-full bg-brand-blue text-white py-2 px-4 rounded-lg hover:bg-brand-blue-dark transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated, approved, and has platform_admin role
  return <>{children}</>;
};
