import React, { useState, useEffect } from 'react';
import { X, Save, User } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/SimpleAuthContext';

interface Student {
  id?: string;
  student_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'male' | 'female';
  grade_level: string;
  section?: string;
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
  address?: string;
  enrollment_date: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  school_id?: string;
}

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  student?: Student | null;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  student
}) => {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Student>({
    student_number: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'male',
    grade_level: '',
    section: '',
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    address: '',
    enrollment_date: new Date().toISOString().split('T')[0],
    status: 'active'
  });

  useEffect(() => {
    if (student) {
      setFormData({
        ...student,
        date_of_birth: student.date_of_birth?.split('T')[0] || '',
        enrollment_date: student.enrollment_date?.split('T')[0] || ''
      });
    } else {
      setFormData({
        student_number: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: 'male',
        grade_level: '',
        section: '',
        parent_name: '',
        parent_phone: '',
        parent_email: '',
        address: '',
        enrollment_date: new Date().toISOString().split('T')[0],
        status: 'active'
      });
    }
  }, [student, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!profile?.school_id) {
        throw new Error('ID école manquant');
      }

      const studentData = {
        ...formData,
        school_id: profile.school_id
      };

      if (student?.id) {
        // Update existing student
        const { error } = await supabase
          .from('students' as any)
          .update(studentData)
          .eq('id', student.id);

        if (error) throw error;

        showToast({
          type: 'success',
          title: 'Étudiant mis à jour',
          message: 'Les informations de l\'étudiant ont été mises à jour avec succès.'
        });
      } else {
        // Create new student
        const { error } = await supabase
          .from('students' as any)
          .insert([studentData]);

        if (error) throw error;

        showToast({
          type: 'success',
          title: 'Étudiant ajouté',
          message: 'Le nouvel étudiant a été ajouté avec succès.'
        });
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving student:', error);
      showToast({
        type: 'error',
        title: 'Erreur',
        message: error.message || 'Erreur lors de la sauvegarde de l\'étudiant.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <User className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              {student ? 'Modifier Étudiant' : 'Ajouter Étudiant'}
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
                Numéro Étudiant *
              </label>
              <input
                type="text"
                name="student_number"
                value={formData.student_number}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: STU001"
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
                <option value="graduated">Diplômé</option>
                <option value="transferred">Transféré</option>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de Naissance *
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="male">Masculin</option>
                <option value="female">Féminin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'Inscription *
              </label>
              <input
                type="date"
                name="enrollment_date"
                value={formData.enrollment_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau *
              </label>
              <input
                type="text"
                name="grade_level"
                value={formData.grade_level}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: 6ème, 5ème, Terminale"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section
              </label>
              <input
                type="text"
                name="section"
                value={formData.section || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: A, B, C"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Parent/Tuteur</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom Parent/Tuteur
                </label>
                <input
                  type="text"
                  name="parent_name"
                  value={formData.parent_name || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone Parent
                </label>
                <input
                  type="tel"
                  name="parent_phone"
                  value={formData.parent_phone || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Parent
                </label>
                <input
                  type="email"
                  name="parent_email"
                  value={formData.parent_email || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse
              </label>
              <textarea
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Adresse complète de l'étudiant"
              />
            </div>
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
