import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2, AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireApproval?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireApproval = false,
  allowedRoles = [],
  redirectTo = '/login'
}) => {
  const { user, profile, loading, error } = useAuth();
  const location = useLocation();
  const [profileTimeout, setProfileTimeout] = useState(false);

  // Set timeout for profile loading to prevent infinite loading
  useEffect(() => {
    if (user && !profile && !loading) {
      const timer = setTimeout(() => {
        console.warn('ProtectedRoute: Profile loading timeout');
        setProfileTimeout(true);
      }, 10000); // 10 second timeout

      return () => clearTimeout(timer);
    }
  }, [user, profile, loading]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue-light to-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-blue mx-auto mb-4" />
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Handle profile loading timeout or error
  if (requireAuth && user && !profile && (profileTimeout || error)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue-light to-white">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur de chargement</h2>
            <p className="text-gray-600 mb-6">
              {error || 'Impossible de charger votre profil utilisateur.'}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-brand-blue text-white py-2 px-4 rounded-lg hover:bg-brand-blue-dark transition-colors"
              >
                Actualiser la page
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Se reconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading for profile only briefly
  if (requireAuth && user && !profile && !profileTimeout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue-light to-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-blue mx-auto mb-4" />
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  // Check if approval is required
  if (requireApproval && profile && !profile.approved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue-light to-white">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Compte en attente d'approbation</h2>
            <p className="text-gray-600 mb-6">
              Votre compte a été créé avec succès mais doit être approuvé par un administrateur avant que vous puissiez accéder à la plateforme.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Vous recevrez un email de confirmation une fois votre compte approuvé.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-brand-blue text-white py-2 px-4 rounded-lg hover:bg-brand-blue-dark transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check role-based access
  if (allowedRoles.length > 0 && profile && !allowedRoles.includes(profile.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue-light to-white">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Rôle requis: {allowedRoles.join(', ')}
            </p>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-brand-blue text-white py-2 px-4 rounded-lg hover:bg-brand-blue-dark transition-colors"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  // All checks passed, render the protected content
  return <>{children}</>;
};
