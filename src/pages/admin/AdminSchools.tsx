import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  X, 
  Trash2, 
  User, 
  Mail, 
  Phone
} from 'lucide-react';

interface SchoolData {
  id: string;
  name: string;
  code: string;
  address: string | null;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  users?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  }[];
}

export const AdminSchools: React.FC = () => {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSchool, setNewSchool] = useState({
    name: '',
    code: '',
    address: '',
    adminEmail: '',
    adminFirstName: '',
    adminLastName: ''
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('schools')
        .select(`
          *,
          users!users_school_id_fkey (
            id,
            first_name,
            last_name,
            email,
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSchools(data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (schoolId: string, newStatus: 'active' | 'inactive' | 'pending') => {
    try {
      const { error } = await supabase
        .from('schools')
        .update({ status: newStatus })
        .eq('id', schoolId);

      if (error) throw error;
      
      setSchools(schools.map(school => 
        school.id === schoolId 
          ? { ...school, status: newStatus }
          : school
      ));
    } catch (error) {
      console.error('Error updating school status:', error);
    }
  };

  const handleDeleteSchool = async (schoolId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette école ? Cette action est irréversible.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', schoolId);

      if (error) throw error;
      
      setSchools(schools.filter(school => school.id !== schoolId));
    } catch (error) {
      console.error('Error deleting school:', error);
    }
  };

  const handleAddSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // First create the school
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .insert({
          name: newSchool.name,
          code: newSchool.code,
          address: newSchool.address || null,
          status: 'active'
        })
        .select()
        .single();

      if (schoolError) throw schoolError;

      // Then create the admin user if provided
      if (newSchool.adminEmail && newSchool.adminFirstName && newSchool.adminLastName) {
        // Note: User creation would need to be handled through Supabase Auth
        // For now, we'll skip the admin user creation part
        console.log('Admin user would be created:', {
          email: newSchool.adminEmail,
          firstName: newSchool.adminFirstName,
          lastName: newSchool.adminLastName,
          schoolId: schoolData.id
        });

        const { error: userError } = await supabase
          .from('users')
          .insert({
            email: newSchool.adminEmail,
            first_name: newSchool.adminFirstName,
            last_name: newSchool.adminLastName,
            role: 'school_admin',
            school_id: schoolData.id,
            approved: true
          });

        if (userError) {
          console.error('Error creating admin user:', userError);
          // Don't throw here, school was created successfully
        }
      }

      // Reset form and close modal
      setNewSchool({
        name: '',
        code: '',
        address: '',
        adminEmail: '',
        adminFirstName: '',
        adminLastName: ''
      });
      setShowAddModal(false);
      
      // Refresh schools list
      fetchSchools();
    } catch (error) {
      console.error('Error adding school:', error);
    }
  };

  const filteredSchools = schools.filter(school => {
    const matchesSearch = 
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || school.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'inactive': return X;
      case 'pending': return Clock;
      default: return AlertCircle;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Écoles</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Écoles</h1>
          <p className="text-gray-600 mt-1">Gérer toutes les écoles de la plateforme</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une école
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par nom ou code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="pending">En attente</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>
      </div>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchools.map((school) => {
          const StatusIcon = getStatusIcon(school.status);
          const adminUser = school.users?.find(user => user.role === 'school_admin');
          
          return (
            <div key={school.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <School className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                    <p className="text-sm text-gray-500">Code: {school.code}</p>
                  </div>
                </div>
                
                <select
                  value={school.status}
                  onChange={(e) => handleStatusChange(school.id, e.target.value as any)}
                  className={`text-xs px-2 py-1 rounded-full font-medium border-0 ${getStatusColor(school.status)}`}
                >
                  <option value="active">Actif</option>
                  <option value="pending">En attente</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>

              {school.address && (
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-2" />
                  {school.address}
                </div>
              )}

              {adminUser && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Administrateur
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {adminUser.first_name} {adminUser.last_name}
                  </div>
                  <div className="text-sm text-gray-600">{adminUser.email}</div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {school.users?.length || 0} utilisateurs
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(school.created_at).toLocaleDateString('fr-FR')}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  className="text-blue-600 hover:text-blue-900 p-1 rounded"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteSchool(school.id)}
                  className="text-red-600 hover:text-red-900 p-1 rounded"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSchools.length === 0 && (
        <div className="text-center py-12">
          <School className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune école trouvée</h3>
          <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
        </div>
      )}

      {/* Add School Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAddSchool}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Ajouter une nouvelle école
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nom de l'école *</label>
                          <input
                            type="text"
                            required
                            value={newSchool.name}
                            onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Code de l'école *</label>
                          <input
                            type="text"
                            required
                            value={newSchool.code}
                            onChange={(e) => setNewSchool({...newSchool, code: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Adresse</label>
                          <input
                            type="text"
                            value={newSchool.address}
                            onChange={(e) => setNewSchool({...newSchool, address: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        <div className="border-t pt-4">
                          <h4 className="text-md font-medium text-gray-900 mb-3">Administrateur de l'école (optionnel)</h4>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Prénom</label>
                              <input
                                type="text"
                                value={newSchool.adminFirstName}
                                onChange={(e) => setNewSchool({...newSchool, adminFirstName: e.target.value})}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Nom</label>
                              <input
                                type="text"
                                value={newSchool.adminLastName}
                                onChange={(e) => setNewSchool({...newSchool, adminLastName: e.target.value})}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                              type="email"
                              value={newSchool.adminEmail}
                              onChange={(e) => setNewSchool({...newSchool, adminEmail: e.target.value})}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Ajouter
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
