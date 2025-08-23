import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Save, 
  AlertTriangle,
  Users,
  Loader2,
  Shield
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  assigned_at: string;
  user: {
    email: string;
    full_name: string;
  };
}

interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
}

interface ConfirmationModal {
  isOpen: boolean;
  title: string;
  message: string;
  action: () => void;
  type: 'danger' | 'warning' | 'info';
}

const AVAILABLE_PERMISSIONS = [
  'content.view',
  'content.create', 
  'content.edit',
  'content.delete',
  'users.view',
  'users.manage',
  'users.moderate',
  'reports.view',
  'reports.manage',
  'settings.view',
  'settings.manage'
];

export const AdminRoles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    permissions: []
  });
  const [confirmModal, setConfirmModal] = useState<ConfirmationModal>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {},
    type: 'info'
  });

  useEffect(() => {
    fetchRoles();
    fetchUserRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRoles(data || []);
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          user:users(email, full_name)
        `);

      if (error) throw error;
      setUserRoles(data || []);
    } catch (err) {
      console.error('Error fetching user roles:', err);
    }
  };

  const handleCreateRole = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .insert({
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions
        })
        .select()
        .single();

      if (error) throw error;

      setRoles([data, ...roles]);
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error('Error creating role:', err);
      setError('Failed to create role');
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;

    try {
      const { data, error } = await supabase
        .from('roles')
        .update({
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingRole.id)
        .select()
        .single();

      if (error) throw error;

      setRoles(roles.map(role => 
        role.id === editingRole.id ? data : role
      ));
      setEditingRole(null);
      resetForm();
    } catch (err) {
      console.error('Error updating role:', err);
      setError('Failed to update role');
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      setRoles(roles.filter(role => role.id !== roleId));
    } catch (err) {
      console.error('Error deleting role:', err);
      setError('Failed to delete role');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: []
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (role: Role) => {
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setEditingRole(role);
  };

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

  const handlePermissionToggle = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleUsageCount = (roleId: string) => {
    return userRoles.filter(ur => ur.role_id === roleId).length;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-600">Loading roles...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Role Management</h1>
          <p className="text-gray-600">Manage user roles and permissions</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </button>
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

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(role)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openConfirmModal(
                    'Delete Role',
                    `Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`,
                    () => handleDeleteRole(role.id),
                    'danger'
                  )}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{role.description}</p>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Permissions:</h4>
              <div className="flex flex-wrap gap-1">
                {role.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {getRoleUsageCount(role.id)} users
              </div>
              <span>Created {formatDate(role.created_at)}</span>
            </div>
          </div>
        ))}
      </div>

      {roles.length === 0 && (
        <div className="text-center py-12">
          <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
          <p className="text-gray-500 mb-4">Create your first role to get started.</p>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Role
          </button>
        </div>
      )}

      {/* Create/Edit Role Modal */}
      {(showCreateModal || editingRole) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingRole ? 'Edit Role' : 'Create New Role'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingRole(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter role name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter role description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {AVAILABLE_PERMISSIONS.map((permission) => (
                    <label key={permission} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission)}
                        onChange={() => handlePermissionToggle(permission)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingRole(null);
                  resetForm();
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={editingRole ? handleUpdateRole : handleCreateRole}
                disabled={!formData.name.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Save className="h-4 w-4 mr-1" />
                {editingRole ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

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
