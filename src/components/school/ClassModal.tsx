import React, { useState, useEffect } from 'react';
import { X, Save, BookOpen } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/SimpleAuthContext';

interface Class {
  id?: string;
  class_name: string;
  class_level: string;
  academic_year: string;
  teacher_id?: string;
  room_number?: string;
  capacity?: number;
  schedule?: string;
  status: 'active' | 'inactive';
  school_id?: string;
}

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  employee_number: string;
}

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  classData?: Class | null;
}

export const ClassModal: React.FC<ClassModalProps> = ({
  isOpen,
  onClose,
  onSave,
  classData
}) => {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [formData, setFormData] = useState<Class>({
    class_name: '',
    class_level: '',
    academic_year: new Date().getFullYear().toString(),
    teacher_id: '',
    room_number: '',
    capacity: 0,
    schedule: '',
    status: 'active'
  });

  useEffect(() => {
    if (isOpen) {
      fetchTeachers();
    }
  }, [isOpen, profile?.school_id]);

  useEffect(() => {
    if (classData) {
      setFormData({
        ...classData,
        teacher_id: classData.teacher_id || ''
      });
    } else {
      setFormData({
        class_name: '',
        class_level: '',
        academic_year: new Date().getFullYear().toString(),
        teacher_id: '',
        room_number: '',
        capacity: 0,
        schedule: '',
        status: 'active'
      });
    }
  }, [classData, isOpen]);

  const fetchTeachers = async () => {
    try {
      if (!profile?.school_id) return;

      const { data: teachersData, error } = await supabase
        .from('teachers' as any)
        .select('id, first_name, last_name, employee_number')
        .eq('school_id', profile.school_id)
        .eq('status', 'active')
        .order('last_name', { ascending: true });

      if (error) throw error;
      setTeachers((teachersData as unknown as Teacher[]) || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!profile?.school_id) {
        throw new Error('ID école manquant');
      }

      const classDataToSave = {
        ...formData,
        school_id: profile.school_id,
        teacher_id: formData.teacher_id || null
      };

      if (classData?.id) {
        // Update existing class
        const { error } = await supabase
          .from('classes' as any)
          .update(classDataToSave)
          .eq('id', classData.id);

        if (error) throw error;

        showToast({
          type: 'success',
          title: 'Classe mise à jour',
          message: 'Les informations de la classe ont été mises à jour avec succès.'
        });
      } else {
        // Create new class
        const { error } = await supabase
          .from('classes' as any)
          .insert([classDataToSave]);

        if (error) throw error;

        showToast({
          type: 'success',
          title: 'Classe ajoutée',
          message: 'La nouvelle classe a été ajoutée avec succès.'
        });
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving class:', error);
      showToast({
        type: 'error',
        title: 'Erreur',
        message: error.message || 'Erreur lors de la sauvegarde de la classe.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'capacity' ? parseInt(value) || 0 : value 
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              {classData ? 'Modifier Classe' : 'Ajouter Classe'}
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
                Nom de la Classe *
              </label>
              <input
                type="text"
                name="class_name"
                value={formData.class_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: 6ème A, CP1, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau *
              </label>
              <select
                name="class_level"
                value={formData.class_level}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Sélectionner un niveau</option>
                <option value="Maternelle">Maternelle</option>
                <option value="CP1">CP1</option>
                <option value="CP2">CP2</option>
                <option value="CE1">CE1</option>
                <option value="CE2">CE2</option>
                <option value="CM1">CM1</option>
                <option value="CM2">CM2</option>
                <option value="6ème">6ème</option>
                <option value="5ème">5ème</option>
                <option value="4ème">4ème</option>
                <option value="3ème">3ème</option>
                <option value="2nde">2nde</option>
                <option value="1ère">1ère</option>
                <option value="Terminale">Terminale</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Année Académique *
              </label>
              <input
                type="text"
                name="academic_year"
                value={formData.academic_year}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: 2024-2025"
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enseignant Principal
              </label>
              <select
                name="teacher_id"
                value={formData.teacher_id || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Aucun enseignant assigné</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.first_name} {teacher.last_name} ({teacher.employee_number})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de Salle
              </label>
              <input
                type="text"
                name="room_number"
                value={formData.room_number || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: A101, B205"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacité (nombre d'élèves)
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity || ''}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: 30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emploi du Temps
            </label>
            <textarea
              name="schedule"
              value={formData.schedule || ''}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Décrivez l'emploi du temps de la classe..."
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
