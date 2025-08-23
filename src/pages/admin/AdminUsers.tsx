import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Edit3, 
  UserCheck, 
  UserX, 
  AlertTriangle,
  X,
  Check,
  Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface UserData {
  id: string;
  email: string;
  role: 'platform_admin' | 'school_admin' | 'teacher' | 'parent';
  full_name: string;
  approved: boolean;
  created_at: string;
  last_login?: string;
  auth_created_at?: string;
}

interface ConfirmationModal {
  isOpen: boolean;
  title: string;
  message: string;
  action: () => void;
  type: 'danger' | 'warning' | 'info';
}

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmationModal>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {},
    type: 'info'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from users table (profile data)
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileError) {
        throw profileError;
      }

      // Fetch from auth.users for additional metadata
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) {
        console.warn('Could not fetch auth users:', authError);
        // Continue with profile data only
        setUsers(profileData || []);
      } else {
        // Merge profile and auth data
        const mergedUsers = (profileData || []).map(profile => {
          const authUser = authData.users.find(auth => auth.id === profile.id);
          return {
            ...profile,
            auth_created_at: authUser?.created_at,
            last_login: authUser?.last_sign_in_at
          };
        });
        setUsers(mergedUsers);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: newRole as any }
          : user
      ));

      setEditingUser(null);
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role');
    }
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
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'approved' && user.approved) ||
                         (statusFilter === 'pending' && !user.approved);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const openConfirmModal = (title: string, message: string, action: () => void, type: 'danger' | 'warning' | 'info' = 'info') => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      action,
      type
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      title: '',
      message: '',
      action: () => {},
      type: 'info'
    });
  };

  const handleSuspendUser = (user: UserData) => {
    openConfirmModal(
      'Suspend User',
      `Are you sure you want to suspend ${user.full_name} (${user.email})? They will lose access to the platform.`,
      () => updateUserStatus(user.id, false),
      'danger'
    );
  };

  const handleActivateUser = (user: UserData) => {
    openConfirmModal(
      'Activate User',
      `Are you sure you want to activate ${user.full_name} (${user.email})? They will regain access to the platform.`,
      () => updateUserStatus(user.id, true),
      'info'
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-600">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage platform users, roles, and permissions</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="platform_admin">Platform Admin</option>
              <option value="school_admin">School Admin</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="approved">Active</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
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
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="platform_admin">Platform Admin</option>
                        <option value="school_admin">School Admin</option>
                        <option value="teacher">Teacher</option>
                        <option value="parent">Parent</option>
                      </select>
                    ) : (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.approved)}`}>
                      {user.approved ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {editingUser === user.id ? (
                        <button
                          onClick={() => setEditingUser(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingUser(user.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      )}
                      
                      {user.approved ? (
                        <button
                          onClick={() => handleSuspendUser(user)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <UserX className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivateUser(user)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <UserCheck className="h-4 w-4" />
                        </button>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              {confirmModal.type === 'danger' && (
                <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              )}
              <h3 className="text-lg font-medium text-gray-900">
                {confirmModal.title}
              </h3>
            </div>
            <p className="text-gray-600 mb-6">{confirmModal.message}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmModal.action();
                  closeConfirmModal();
                }}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  confirmModal.type === 'danger' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
