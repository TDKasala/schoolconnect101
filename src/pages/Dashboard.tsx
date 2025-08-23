import React from 'react';
import { useAuth } from '../contexts/SimpleAuthContext';
import { DebugUserInfo } from '../components/DebugUserInfo';
import { Loader2, User, Shield, Building, Users } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, profile, loading, signOut, error } = useAuth();

  console.log('Dashboard: Auth state', { 
    user: !!user, 
    profile: !!profile, 
    loading, 
    error,
    profileRole: profile?.role 
  });

  // Show loading only for a reasonable time
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue-light to-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-blue mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Chargement du tableau de bord...</p>
          <div className="space-y-2">
            <button 
              onClick={() => signOut()}
              className="block mx-auto text-sm text-brand-blue hover:text-brand-blue-dark underline"
            >
              Se déconnecter
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="block mx-auto text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Actualiser la page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue-light to-white">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Erreur d'authentification</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-2">
              <button 
                onClick={() => signOut()}
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
      </div>
    );
  }

  // No user - redirect to login
  if (!user) {
    window.location.href = '/login';
    return null;
  }

  // No profile - show profile missing message
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue-light to-white">
        <div className="text-center max-w-md">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Profil manquant</h2>
            <p className="text-yellow-700 mb-4">
              Votre profil utilisateur n'a pas été trouvé dans la base de données. 
              Veuillez contacter un administrateur.
            </p>
            <button 
              onClick={() => signOut()}
              className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has platform_admin role
  if (profile.role !== 'platform_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue-light to-white">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Accès non autorisé</h2>
            <p className="text-red-600 mb-4">
              Vous n'avez pas les permissions nécessaires pour accéder au tableau de bord administrateur.
              Rôle actuel: {profile.role}
            </p>
            <button 
              onClick={() => signOut()}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'platform_admin':
        return 'Administrateur Plateforme';
      case 'school_admin':
        return 'Administrateur École';
      case 'teacher':
        return 'Enseignant';
      case 'parent':
        return 'Parent';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue-light to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Debug Info */}
        <DebugUserInfo />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenue, {profile.full_name}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-brand-blue-light">
                <User className="h-6 w-6 text-brand-blue" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Profil</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profile.full_name}
                </p>
              </div>
            </div>
          </div>

          {/* Role Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rôle</p>
                <p className="text-lg font-semibold text-gray-900">
                  {getRoleDisplayName(profile.role)}
                </p>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${profile.approved ? 'bg-green-100' : 'bg-yellow-100'}`}>
                <Users className={`h-6 w-6 ${profile.approved ? 'text-green-600' : 'text-yellow-600'}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Statut</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profile.approved ? 'Approuvé' : 'En attente'}
                </p>
              </div>
            </div>
          </div>

          {/* School Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">École</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profile.school_id || 'Non assigné'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Welcome Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Bienvenue sur SchoolConnect
            </h2>
            <p className="text-gray-600 mb-4">
              Votre plateforme de gestion scolaire complète. Accédez à tous vos outils et informations depuis ce tableau de bord.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-brand-blue rounded-full mr-3"></div>
                Gestion des profils utilisateurs
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-brand-blue rounded-full mr-3"></div>
                Système de rôles et permissions
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-brand-blue rounded-full mr-3"></div>
                Interface moderne et intuitive
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Actions rapides
            </h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-brand-blue hover:bg-brand-blue-light transition-colors">
                <div className="font-medium text-gray-900">Modifier le profil</div>
                <div className="text-sm text-gray-600">Mettre à jour vos informations personnelles</div>
              </button>
              
              {profile.role === 'platform_admin' && (
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-brand-blue hover:bg-brand-blue-light transition-colors">
                  <div className="font-medium text-gray-900">Gestion des utilisateurs</div>
                  <div className="text-sm text-gray-600">Approuver et gérer les comptes utilisateurs</div>
                </button>
              )}
              
              {profile.role === 'platform_admin' && (
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-brand-blue hover:bg-brand-blue-light transition-colors">
                  <div className="font-medium text-gray-900">Gestion de l'école</div>
                  <div className="text-sm text-gray-600">Configurer les paramètres de l'école</div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Approval Notice */}
        {!profile.approved && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Compte en attente d'approbation
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Votre compte doit être approuvé par un administrateur avant que vous puissiez accéder à toutes les fonctionnalités. 
                    Vous recevrez une notification par email une fois votre compte approuvé.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
