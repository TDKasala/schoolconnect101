import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit3, 
  UserCheck, 
  UserX, 
  Trash2, 
  X,
  AlertTriangle,
  Loader2,
  Building,
  School
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../lib/supabase';
import { CreateUserModal } from '../../components/admin/CreateUserModal';
import { CreateSchoolModal } from '../../components/admin/CreateSchoolModal';
import { SchoolService } from '../../services/schoolService';
import { UserService } from '../../services/userService';

interface UserData {
  id: string;
  email: string;
  role: 'platform_admin' | 'school_admin' | 'teacher' | 'parent';
  full_name: string;
  approved: boolean;
  school_id?: string;
  created_at: string;
  last_login?: string;
  school?: {
    id: string;
    name: string;
    code: string;
  };
}

interface School {
  id: string;
  name: string;
  address?: string;
  contact_number?: string;
  email?: string;
  registration_number?: string;
  created_at: string;
  updated_at: string;
}

export const AdminUsers: React.FC = () => {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateSchoolModal, setShowCreateSchoolModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'schools'>('users');
  const [editingRole, setEditingRole] = useState('');
  const [editingSchool, setEditingSchool] = useState('');

  // Check if user has platform_admin role
  if (profile?.role !== 'platform_admin') {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Accès Refusé</h3>
          <p className="text-gray-500">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchUsers();
    fetchSchools();
  }, []);

  const fetchUsers = async () => {
    try {
      // Use UserService to get all users (handles RLS and Admin API fallback)
      const usersData = await UserService.getAll();
      
      // Convert to UserData format expected by the component
      const formattedUsers = usersData.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        approved: user.approved,
        school_id: user.school_id || undefined,
        created_at: user.created_at,
        last_login: user.last_login || undefined,
        school: user.school ? {
          id: user.school.id,
          name: user.school.name,
          code: user.school.code || user.school.registration_number || 'N/A'
        } : undefined
      }));

      setUsers(formattedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      showToast({
        type: 'error',
        title: 'Erreur',
        message: 'Erreur lors du chargement des utilisateurs.'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const schoolsData = await SchoolService.getAll();
      setSchools(schoolsData);
    } catch (err) {
      console.error('Error fetching schools:', err);
    }
  };

  const handleSchoolCreated = (school: School, admin: UserData) => {
    setSchools(prev => [...prev, school]);
    setUsers(prev => [...prev, admin]);
    showToast({
      type: 'success',
      title: 'École Créée',
      message: `L'école "${school.name}" a été créée avec succès avec ${admin.full_name} comme administrateur.`
    });
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole as 'platform_admin' | 'school_admin' | 'teacher' | 'parent' })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole as 'platform_admin' | 'school_admin' | 'teacher' | 'parent' } : user
      ));

      showToast({
        type: 'success',
        title: 'Rôle Mis à Jour',
        message: 'Le rôle de l\'utilisateur a été mis à jour avec succès.'
      });
    } catch (error: any) {
      console.error('Error updating role:', error);
      showToast({
        type: 'error',
        title: 'Erreur',
        message: 'Erreur lors de la mise à jour du rôle.'
      });
    }
  };

  const handleSchoolChange = async (userId: string, newSchoolId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ school_id: newSchoolId || null })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(prev => prev.map(user => {
        if (user.id === userId) {
          const school = schools.find(s => s.id === newSchoolId);
          return { ...user, school_id: newSchoolId || undefined, school };
        }
        return user;
      }));

      showToast({
        type: 'success',
        title: 'École Mise à Jour',
        message: 'L\'école de l\'utilisateur a été mise à jour avec succès.'
      });
    } catch (error: any) {
      console.error('Error updating school:', error);
      showToast({
        type: 'error',
        title: 'Erreur',
        message: 'Erreur lors de la mise à jour de l\'école.'
      });
    }
  };

  const startEditing = (user: UserData) => {
    setEditingUser(user.id);
    setEditingRole(user.role);
    setEditingSchool(user.school_id || '');
  };

  const saveEditing = async () => {
    if (!editingUser) return;

    const user = users.find(u => u.id === editingUser);
    if (!user) return;

    // Update role if changed
    if (editingRole !== user.role) {
      await handleRoleChange(editingUser, editingRole);
    }

    // Update school if changed
    if (editingSchool !== (user.school_id || '')) {
      await handleSchoolChange(editingUser, editingSchool);
    }

    setEditingUser(null);
    setEditingRole('');
    setEditingSchool('');
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setEditingRole('');
    setEditingSchool('');
  };

  const updateUserStatus = async (userId: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ approved, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, approved }
          : user
      ));

      showToast({
        type: 'success',
        title: 'Statut Mis à Jour',
        message: `L'utilisateur a été ${approved ? 'activé' : 'suspendu'} avec succès.`
      });
    } catch (err) {
      console.error('Error updating user status:', err);
      showToast({
        type: 'error',
        title: 'Erreur',
        message: 'Erreur lors de la mise à jour du statut.'
      });
    }
  };

  const handleDeleteUser = async (user: UserData) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.full_name}? Cette action est irréversible.`)) {
      return;
    }

    try {
      // Delete from users table only (auth deletion requires service role)
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (deleteError) throw deleteError;

      // Remove from local state
      setUsers(prev => prev.filter(u => u.id !== user.id));

      showToast({
        type: 'success',
        title: 'Utilisateur Supprimé',
        message: 'L\'utilisateur a été supprimé avec succès.'
      });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      showToast({
        type: 'error',
        title: 'Erreur',
        message: 'Erreur lors de la suppression de l\'utilisateur.'
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'platform_admin': return 'bg-red-100 text-red-800';
      case 'school_admin': return 'bg-blue-100 text-blue-800';
      case 'teacher': return 'bg-green-100 text-green-800';
      case 'parent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (approved: boolean) => {
    return approved 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || 
                         (statusFilter === 'active' && user.approved) ||
                         (statusFilter === 'pending' && !user.approved);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-600">Chargement des utilisateurs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs et Écoles</h1>
            <p className="text-gray-600">Gérer les utilisateurs et les écoles de la plateforme</p>
          </div>
          <div className="flex space-x-3">
            {activeTab === 'schools' && (
              <button
                onClick={() => setShowCreateSchoolModal(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Building className="h-5 w-5 mr-2" />
                Créer École
              </button>
            )}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Créer Utilisateur
            </button>
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
              Utilisateurs ({users.length})
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
              Écoles ({schools.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Search and Filters */}
      {activeTab === 'users' && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les rôles</option>
                <option value="platform_admin">Admin Plateforme</option>
                <option value="school_admin">Admin École</option>
                <option value="teacher">Enseignant</option>
                <option value="parent">Parent</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="pending">En attente</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    École
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créé le
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">ID: {user.id.slice(0, 8)}...</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === user.id ? (
                        <select
                          value={editingRole}
                          onChange={(e) => setEditingRole(e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="platform_admin">Administrateur Plateforme</option>
                          <option value="school_admin">Administrateur École</option>
                          <option value="teacher">Enseignant</option>
                          <option value="parent">Parent</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role === 'platform_admin' ? 'Admin Plateforme' :
                           user.role === 'school_admin' ? 'Admin École' :
                           user.role === 'teacher' ? 'Enseignant' :
                           'Parent'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === user.id ? (
                        <select
                          value={editingSchool}
                          onChange={(e) => setEditingSchool(e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="">Aucune école</option>
                          {schools.map((school) => (
                            <option key={school.id} value={school.id}>
                              {school.name}
                            </option>
                          ))}
                        </select>
                      ) : user.school ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.school.name}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Aucune école assignée</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.approved)}`}>
                        {user.approved ? 'Actif' : 'En attente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {editingUser === user.id ? (
                          <>
                            <button
                              onClick={saveEditing}
                              className="text-green-600 hover:text-green-900"
                              title="Sauvegarder"
                            >
                              <UserCheck className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-gray-400 hover:text-gray-600"
                              title="Annuler"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(user)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Modifier"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            
                            {user.approved ? (
                              <button
                                onClick={() => updateUserStatus(user.id, false)}
                                className="text-orange-600 hover:text-orange-900"
                                title="Suspendre"
                              >
                                <UserX className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => updateUserStatus(user.id, true)}
                                className="text-green-600 hover:text-green-900"
                                title="Activer"
                              >
                                <UserCheck className="h-4 w-4" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="text-red-600 hover:text-red-900"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-gray-500">Essayez d'ajuster vos critères de recherche ou de filtre.</p>
            </div>
          )}
        </div>
      )}

      {/* Schools Table */}
      {activeTab === 'schools' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    École
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Administrateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créée le
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schools.map((school) => {
                  const schoolAdmin = users.find(user => user.school_id === school.id && user.role === 'school_admin');
                  return (
                    <tr key={school.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {school.name}
                          </div>
                          {school.registration_number && (
                            <div className="text-sm text-gray-500">N° {school.registration_number}</div>
                          )}
                          <div className="text-xs text-gray-400">ID: {school.id.slice(0, 8)}...</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          {school.email && (
                            <div className="text-sm text-gray-900">{school.email}</div>
                          )}
                          {school.contact_number && (
                            <div className="text-sm text-gray-500">{school.contact_number}</div>
                          )}
                          {school.address && (
                            <div className="text-xs text-gray-400">{school.address}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {schoolAdmin ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">{schoolAdmin.full_name}</div>
                            <div className="text-sm text-gray-500">{schoolAdmin.email}</div>
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Actif
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-red-500">Aucun administrateur assigné</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(school.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            title="Modifier"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {schools.length === 0 && (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune école trouvée</h3>
              <p className="text-gray-500">Commencez par créer votre première école.</p>
            </div>
          )}
        </div>
      )}

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={fetchUsers}
        schools={schools}
      />

      {/* Create School Modal */}
      <CreateSchoolModal
        isOpen={showCreateSchoolModal}
        onClose={() => setShowCreateSchoolModal(false)}
        onSuccess={handleSchoolCreated}
      />
    </div>
  );
};
