import React, { useState, useEffect } from 'react';
import { X, Save, UserCheck } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/SimpleAuthContext';

interface Teacher {
  id?: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  hire_date: string;
  status: 'active' | 'inactive' | 'on_leave';
  subjects?: string[];
  qualifications?: string;
  salary_amount?: number;
  school_id?: string;
}

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  teacher?: Teacher | null;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  onSave,
  teacher
}) => {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Teacher>({
    employee_number: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    hire_date: new Date().toISOString().split('T')[0],
    status: 'active',
    subjects: [],
    qualifications: '',
    salary_amount: 0
  });

  useEffect(() => {
    if (teacher) {
      setFormData({
        ...teacher,
        hire_date: teacher.hire_date?.split('T')[0] || '',
        subjects: teacher.subjects || []
      });
    } else {
      setFormData({
        employee_number: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        hire_date: new Date().toISOString().split('T')[0],
        status: 'active',
        subjects: [],
        qualifications: '',
        salary_amount: 0
      });
    }
  }, [teacher, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!profile?.school_id) {
        throw new Error('ID école manquant');
      }

      const teacherData = {
        ...formData,
        school_id: profile.school_id
      };

      if (teacher?.id) {
        // Update existing teacher
        const { error } = await supabase
          .from('teachers' as any)
          .update(teacherData)
          .eq('id', teacher.id);

        if (error) throw error;

        showToast({
          type: 'success',
          title: 'Enseignant mis à jour',
          message: 'Les informations de l\'enseignant ont été mises à jour avec succès.'
        });
      } else {
        // Create new teacher
        const { error } = await supabase
          .from('teachers' as any)
          .insert([teacherData]);

        if (error) throw error;

        showToast({
          type: 'success',
          title: 'Enseignant ajouté',
          message: 'Le nouvel enseignant a été ajouté avec succès.'
        });
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving teacher:', error);
      showToast({
        type: 'error',
        title: 'Erreur',
        message: error.message || 'Erreur lors de la sauvegarde de l\'enseignant.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const subjects = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    setFormData(prev => ({ ...prev, subjects }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <UserCheck className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              {teacher ? 'Modifier Enseignant' : 'Ajouter Enseignant'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro Employé *
              </label>
              <input
                type="text"
                name="employee_number"
                value={formData.employee_number}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: EMP001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="on_leave">En Congé</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'Embauche *
              </label>
              <input
                type="date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salaire (FC)
              </label>
              <input
                type="number"
                name="salary_amount"
                value={formData.salary_amount || ''}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Montant en Francs Congolais"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matières Enseignées
            </label>
            <input
              type="text"
              value={formData.subjects?.join(', ') || ''}
              onChange={handleSubjectsChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: Mathématiques, Français, Sciences (séparées par des virgules)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qualifications
            </label>
            <textarea
              name="qualifications"
              value={formData.qualifications || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Diplômes, certifications, expérience..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse
            </label>
            <textarea
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Adresse complète de l'enseignant"
            />
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
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
