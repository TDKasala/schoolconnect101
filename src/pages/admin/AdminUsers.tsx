import React, { useState } from 'react';
import { 
  Users, 
  AlertTriangle,
  School
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { UserList } from '../../components/admin/UserList';
import { SchoolList } from '../../components/admin/SchoolList';
import { Helmet } from 'react-helmet-async';

export const AdminUsers: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'schools'>('users');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to trigger a refresh
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Check if user has platform_admin role
  if (profile?.role !== 'platform_admin') {
    return (
      <>
        <Helmet>
          <title>Accès Refusé | SchoolConnect</title>
        </Helmet>
        <div className="p-6">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Accès Refusé</h3>
            <p className="text-gray-500">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Utilisateurs et Écoles | SchoolConnect</title>
      </Helmet>
      
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs et Écoles</h1>
              <p className="text-gray-600">Gérer les utilisateurs et les écoles de la plateforme</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="h-5 w-5 inline mr-2" />
                Utilisateurs
              </button>
              <button
                onClick={() => setActiveTab('schools')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'schools'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <School className="h-5 w-5 inline mr-2" />
                Écoles
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'users' && (
          <UserList refreshTrigger={refreshTrigger} />
        )}
        
        {activeTab === 'schools' && (
          <SchoolList refreshTrigger={refreshTrigger} />
        )}
      </div>
    </>
  );
};
