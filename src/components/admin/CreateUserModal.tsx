import React, { useState } from 'react';
import { X, Save, User, Mail, Shield, School as SchoolIcon } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../lib/supabase';

interface School {
  id: string;
  name: string;
  code: string;
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  schools: School[];
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  schools
}) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'teacher' as 'platform_admin' | 'school_admin' | 'teacher' | 'parent',
    school_id: '',
    approved: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create user in auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true
      });

      if (authError) throw authError;

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: formData.email,
          full_name: formData.full_name,
          role: formData.role,
          school_id: formData.school_id || null,
          approved: formData.approved,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (profileError) throw profileError;

      showToast({
        type: 'success',
        title: 'Utilisateur Créé',
        message: 'Le nouvel utilisateur a été créé avec succès.'
      });

      onSave();
      onClose();
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        full_name: '',
        role: 'teacher',
        school_id: '',
        approved: true
      });
    } catch (error: any) {
      console.error('Error creating user:', error);
      showToast({
        type: 'error',
        title: 'Erreur',
        message: error.message || 'Erreur lors de la création de l\'utilisateur.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <User className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Créer Nouvel Utilisateur
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="utilisateur@exemple.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de Passe *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Minimum 6 caractères"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Nom Complet *
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Prénom Nom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Shield className="h-4 w-4 inline mr-1" />
              Rôle *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="teacher">Enseignant</option>
              <option value="school_admin">Administrateur École</option>
              <option value="parent">Parent</option>
              <option value="platform_admin">Administrateur Plateforme</option>
            </select>
          </div>

          {(formData.role === 'school_admin' || formData.role === 'teacher') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <SchoolIcon className="h-4 w-4 inline mr-1" />
                École
              </label>
              <select
                name="school_id"
                value={formData.school_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner une école</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name} ({school.code})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              name="approved"
              id="approved"
              checked={formData.approved}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="approved" className="ml-2 block text-sm text-gray-700">
              Approuver automatiquement l'utilisateur
            </label>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Création...' : 'Créer Utilisateur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
