import React, { useState, useEffect } from 'react'
import { User, Edit, Trash2, UserPlus, CheckCircle, XCircle, Mail, Shield } from 'lucide-react'
import { UserAuthService } from '../../services/userAuthService'
import { CreateUserModal } from './NewCreateUserModal'
import { useToast } from '../../contexts/ToastContext'
import { School, User as UserType, UserRole } from '../../types'
import { SchoolDbService } from '../../services/schoolDbService'

interface UserListProps {
  refreshTrigger?: number
}

export const UserList: React.FC<UserListProps> = ({ refreshTrigger = 0 }) => {
  const { showToast } = useToast()
  const [users, setUsers] = useState<UserType[]>([])
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all')

  // Fetch data
  const fetchData = async () => {
    console.log('UserList: Starting data fetch...')
    setLoading(true)
    try {
      const [usersData, schoolsData] = await Promise.all([
        UserAuthService.getAllUsers(),
        SchoolDbService.getAllSchools()
      ])
      
      console.log('UserList: Fetched data - Users:', usersData.length, 'Schools:', schoolsData.length)
      
      setUsers(usersData)
      setSchools(schoolsData)
      setError('')
    } catch (err: any) {
      console.error('UserList: Error fetching data:', err)
      setError(err.message || 'Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch and refresh when triggered
  useEffect(() => {
    fetchData()
  }, [refreshTrigger])

  // Handle user approval toggle
  const handleApprovalToggle = async (user: UserType) => {
    try {
      const newApprovalStatus = !user.approved
      const success = await UserAuthService.updateApprovalStatus(user.id, newApprovalStatus)
      
      if (success) {
        // Update local state
        setUsers(prev => prev.map(u => 
          u.id === user.id ? { ...u, approved: newApprovalStatus } : u
        ))
        
        showToast({
          type: 'success',
          title: 'Statut Mis à Jour',
          message: newApprovalStatus 
            ? `${user.full_name} a été approuvé` 
            : `L'approbation de ${user.full_name} a été révoquée`
        })
      } else {
        throw new Error('La mise à jour a échoué')
      }
    } catch (error: any) {
      console.error('Error updating approval status:', error)
      showToast({
        type: 'error',
        title: 'Erreur',
        message: error.message || 'Erreur lors de la mise à jour du statut'
      })
    }
  }

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!selectedUser) return
    
    try {
      const success = await UserAuthService.deleteUser(selectedUser.id)
      
      if (success) {
        // Remove from local state
        setUsers(prev => prev.filter(u => u.id !== selectedUser.id))
        
        showToast({
          type: 'success',
          title: 'Utilisateur Supprimé',
          message: `${selectedUser.full_name} a été supprimé`
        })
        
        setDeleteModalOpen(false)
        setSelectedUser(null)
      } else {
        throw new Error('La suppression a échoué')
      }
    } catch (error: any) {
      console.error('Error deleting user:', error)
      showToast({
        type: 'error',
        title: 'Erreur',
        message: error.message || 'Erreur lors de la suppression de l\'utilisateur'
      })
    }
  }

  // Apply filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'approved' && user.approved) || 
      (statusFilter === 'pending' && !user.approved)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Translate role for display
  const translateRole = (role: UserRole) => {
    switch (role) {
      case 'platform_admin': return 'Admin Plateforme'
      case 'school_admin': return 'Admin École'
      case 'teacher': return 'Enseignant'
      case 'parent': return 'Parent'
      default: return role
    }
  }

  // Handle create modal close and refresh
  const handleCreateSuccess = () => {
    fetchData()
  }

  return (
    <div className="space-y-4">
      {/* Header and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <User className="mr-2 h-6 w-6 text-blue-600" />
          Gestion des Utilisateurs
        </h2>
        
        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Nouvel Utilisateur
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nom ou email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Role filter */}
          <div>
            <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filtrer par rôle
            </label>
            <select
              id="role-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les rôles</option>
              <option value="platform_admin">Admin Plateforme</option>
              <option value="school_admin">Admin École</option>
              <option value="teacher">Enseignant</option>
              <option value="parent">Parent</option>
            </select>
          </div>
          
          {/* Status filter */}
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filtrer par statut
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'approved' | 'pending')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="approved">Approuvé</option>
              <option value="pending">En attente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Users Table - Desktop */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      École
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                            {user.avatar_url ? (
                              <img className="h-9 w-9 rounded-full" src={user.avatar_url} alt="" />
                            ) : (
                              <User className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" /> {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Shield className={`h-4 w-4 mr-1 ${
                            user.role === 'platform_admin' ? 'text-purple-500' : 
                            user.role === 'school_admin' ? 'text-green-500' :
                            user.role === 'teacher' ? 'text-blue-500' : 'text-gray-500'
                          }`} />
                          <span className="text-sm text-gray-900">
                            {translateRole(user.role)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.school ? (
                          <span className="text-sm text-gray-900">{user.school.name}</span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.approved ? 'Approuvé' : 'En attente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleApprovalToggle(user)}
                            className={`p-2 rounded-full transition-colors ${
                              user.approved 
                                ? 'hover:bg-red-100 text-green-600' 
                                : 'hover:bg-green-100 text-yellow-600'
                            }`}
                            title={user.approved ? 'Révoquer l\'approbation' : 'Approuver'}
                          >
                            {user.approved ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <XCircle className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setDeleteModalOpen(true)
                            }}
                            className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4 p-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  {/* User Info Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-100 rounded-full">
                        {user.avatar_url ? (
                          <img className="h-11 w-11 rounded-full" src={user.avatar_url} alt="" />
                        ) : (
                          <User className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <h3 className="text-base font-medium text-gray-900 truncate">{user.full_name}</h3>
                        <p className="text-sm text-gray-500 flex items-center truncate">
                          <Mail className="h-3 w-3 mr-1 flex-shrink-0" /> 
                          <span className="truncate">{user.email}</span>
                        </p>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                      user.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.approved ? 'Approuvé' : 'En attente'}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    <div className="flex items-center">
                      <Shield className={`h-4 w-4 mr-2 flex-shrink-0 ${
                        user.role === 'platform_admin' ? 'text-purple-500' : 
                        user.role === 'school_admin' ? 'text-green-500' :
                        user.role === 'teacher' ? 'text-blue-500' : 'text-gray-500'
                      }`} />
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">Rôle:</span> {translateRole(user.role)}
                      </span>
                    </div>
                    
                    {user.school && (
                      <div className="flex items-center">
                        <div className="h-4 w-4 mr-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">
                          <span className="font-medium">École:</span> {user.school.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleApprovalToggle(user)}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        user.approved 
                          ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {user.approved ? (
                        <>
                          <XCircle className="h-4 w-4 mr-1" />
                          Révoquer
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approuver
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user)
                        setDeleteModalOpen(true)
                      }}
                      className="flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Aucun utilisateur trouvé</p>
            <p className="text-sm">Aucun utilisateur ne correspond aux critères sélectionnés</p>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateSuccess}
        schools={schools}
      />

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Confirmer la suppression
              </h3>
              <p className="text-gray-500">
                Êtes-vous sûr de vouloir supprimer l'utilisateur <span className="font-semibold">{selectedUser.full_name}</span> ? 
                Cette action ne peut pas être annulée.
              </p>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false)
                    setSelectedUser(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
