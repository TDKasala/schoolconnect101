import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Loader2, User, Mail, Building, Shield, CheckCircle, XCircle, Edit2, Save, X } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, profile, loading, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editData, setEditData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue-light to-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-blue mx-auto mb-4" />
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue-light to-white">
        <div className="text-center">
          <p className="text-gray-600">Profil non trouvé</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setEditData({
      first_name: profile.first_name,
      last_name: profile.last_name,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      first_name: profile.first_name,
      last_name: profile.last_name,
    });
  };

  const handleSave = async () => {
    setIsUpdating(true);
    const { error } = await updateProfile(editData);
    
    if (!error) {
      setIsEditing(false);
    }
    
    setIsUpdating(false);
  };

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

  const getStatusColor = (approved: boolean) => {
    return approved ? 'text-green-600' : 'text-yellow-600';
  };

  const getStatusIcon = (approved: boolean) => {
    return approved ? CheckCircle : XCircle;
  };

  const getStatusText = (approved: boolean) => {
    return approved ? 'Approuvé' : 'En attente d\'approbation';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue-light to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-blue to-brand-blue-dark px-6 py-8">
            <div className="flex items-center">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-brand-blue" />
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-white">
                  {profile.first_name} {profile.last_name}
                </h1>
                <p className="text-brand-blue-light mt-1">
                  {getRoleDisplayName(profile.role)}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Informations personnelles
                  </h2>
                  {!isEditing && (
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 text-brand-blue hover:text-brand-blue-dark transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                      Modifier
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.first_name}
                        onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {profile.first_name}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.last_name}
                        onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                      />
                    ) : (
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {profile.last_name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="flex items-center gap-2 text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {profile.email}
                    </div>
                  </div>

                  {/* Edit Actions */}
                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={isUpdating}
                        className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-brand-blue-dark transition-colors disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Sauvegarder
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Annuler
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Informations du compte
                </h2>

                <div className="space-y-4">
                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rôle
                    </label>
                    <div className="flex items-center gap-2 text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      <Shield className="h-4 w-4 text-gray-400" />
                      {getRoleDisplayName(profile.role)}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statut
                    </label>
                    <div className={`flex items-center gap-2 ${getStatusColor(profile.approved)} bg-gray-50 px-3 py-2 rounded-md`}>
                      {React.createElement(getStatusIcon(profile.approved), { className: "h-4 w-4" })}
                      {getStatusText(profile.approved)}
                    </div>
                  </div>

                  {/* School */}
                  {profile.school_id && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        École
                      </label>
                      <div className="flex items-center gap-2 text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        <Building className="h-4 w-4 text-gray-400" />
                        {profile.school_id}
                      </div>
                    </div>
                  )}

                  {/* Account Created */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compte créé le
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {new Date(profile.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Approval Notice */}
            {!profile.approved && (
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Compte en attente d'approbation
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Votre compte doit être approuvé par un administrateur avant que vous puissiez accéder à toutes les fonctionnalités de la plateforme.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
