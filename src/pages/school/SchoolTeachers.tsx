import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Users, BookOpen, Calendar, Mail, Phone, Edit, Trash2, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { useToast } from '../../contexts/ToastContext';
import { TeacherModal } from '../../components/school/TeacherModal';

interface Teacher {
  id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  hire_date: string;
  status: string;
  subjects?: string[];
  qualifications?: string;
  salary_amount?: number;
  salary_currency?: string;
  created_at: string;
}

export const SchoolTeachers: React.FC = () => {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, [profile?.school_id]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!profile?.school_id) {
        throw new Error('No school ID found');
      }

      const { data: teachersData, error: teachersError } = await supabase
        .from('teachers' as any)
        .select('*')
        .eq('school_id', profile.school_id)
        .order('last_name', { ascending: true });

      if (teachersError) throw teachersError;

      setTeachers((teachersData as unknown as Teacher[]) || []);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Erreur lors du chargement des enseignants');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = () => {
    setSelectedTeacher(null);
    setIsModalOpen(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleDeleteTeacher = async (teacher: Teacher) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'enseignant ${teacher.first_name} ${teacher.last_name}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('teachers' as any)
        .delete()
        .eq('id', teacher.id);

      if (error) throw error;

      showToast({
        type: 'success',
        title: 'Enseignant supprimé',
        message: 'L\'enseignant a été supprimé avec succès.'
      });

      fetchTeachers();
    } catch (error: any) {
      console.error('Error deleting teacher:', error);
      showToast({
        type: 'error',
        title: 'Erreur',
        message: error.message || 'Erreur lors de la suppression de l\'enseignant.'
      });
    }
  };

  const handleModalSave = () => {
    fetchTeachers();
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.employee_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teacher.email && teacher.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || teacher.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total Enseignants</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Enseignants</h1>
            <p className="text-gray-600">Gérer les enseignants et le personnel scolaire</p>
          </div>
          <button 
            onClick={handleAddTeacher}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Enseignant
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher enseignants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tous les Statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="on_leave">En Congé</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {filteredTeachers.length} sur {teachers.length} enseignants
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {filteredTeachers.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {teachers.length === 0 ? 'Aucun Enseignant Trouvé' : 'Aucun Enseignant Correspondant'}
              </h3>
              <p className="text-gray-600 mb-4">
                {teachers.length === 0 
                  ? 'Commencez par ajouter votre premier enseignant.'
                  : 'Essayez d\'ajuster vos critères de recherche ou filtres.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teacher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subjects
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-green-800">
                                {teacher.first_name.charAt(0)}{teacher.last_name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {teacher.first_name} {teacher.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              <span>N° Employé: {teacher.employee_number}</span>
                            </div>
                            <span>Qualifications: {teacher.qualifications || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {teacher.email && (
                            <div className="flex items-center mb-1">
                              <Mail className="h-4 w-4 text-gray-400 mr-2" />
                              {teacher.email}
                            </div>
                          )}
                          {teacher.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-gray-400 mr-2" />
                              {teacher.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span>Matières: {teacher.subjects?.join(', ') || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(teacher.status)}`}>
                          {teacher.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Date d'Embauche: {new Date(teacher.hire_date).toLocaleDateString()}</span>
                        </div>
                        {teacher.salary_amount && (
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span>Salaire: {teacher.salary_amount.toLocaleString()} FC</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(teacher.status)}`}>
                          {teacher.status === 'active' ? 'Actif' : teacher.status === 'inactive' ? 'Inactif' : 'En Congé'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditTeacher(teacher)}
                            className="text-green-600 hover:text-green-900"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTeacher(teacher)}
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <TeacherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        teacher={selectedTeacher}
      />
    </div>
  );
};
