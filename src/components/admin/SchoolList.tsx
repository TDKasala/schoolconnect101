import React, { useState, useEffect } from 'react'
import { Building, Edit, Trash2, Plus, User, Search } from 'lucide-react'
import { SchoolDbService } from '../../services/schoolDbService'
import { CreateSchoolModal } from './NewCreateSchoolModal'
import { useToast } from '../../contexts/ToastContext'
import { School, User as UserType } from '../../types'

interface SchoolListProps {
  refreshTrigger?: number
}

export const SchoolList: React.FC<SchoolListProps> = ({ refreshTrigger = 0 }) => {
  const { showToast } = useToast()
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [schoolStats, setSchoolStats] = useState<Record<string, { teachers: number, students: number }>>({})

  // Fetch schools data
  const fetchSchools = async () => {
    setLoading(true)
    try {
      const schoolsData = await SchoolDbService.getAllSchools()
      setSchools(schoolsData)
      
      // Get stats for each school
      const stats: Record<string, { teachers: number, students: number }> = {}
      
      await Promise.all(schoolsData.map(async (school) => {
        try {
          const schoolStat = await SchoolDbService.getSchoolStats(school.id)
          stats[school.id] = schoolStat
        } catch (err) {
          console.error(`Error fetching stats for school ${school.id}:`, err)
          stats[school.id] = { teachers: 0, students: 0 }
        }
      }))
      
      setSchoolStats(stats)
      setError('')
    } catch (err: any) {
      console.error('Error fetching schools:', err)
      setError(err.message || 'Erreur lors du chargement des écoles')
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch and refresh when triggered
  useEffect(() => {
    fetchSchools()
  }, [refreshTrigger])

  // Handle school deletion
  const handleDeleteSchool = async () => {
    if (!selectedSchool) return
    
    try {
      const success = await SchoolDbService.deleteSchool(selectedSchool.id)
      
      if (success) {
        // Remove from local state
        setSchools(prev => prev.filter(s => s.id !== selectedSchool.id))
        
        showToast({
          type: 'success',
          title: 'École Supprimée',
          message: `L'école ${selectedSchool.name} a été supprimée avec succès.`
        })
        
        setDeleteModalOpen(false)
        setSelectedSchool(null)
      } else {
        throw new Error('La suppression a échoué')
      }
    } catch (error: any) {
      console.error('Error deleting school:', error)
      showToast({
        type: 'error',
        title: 'Erreur',
        message: error.message || 'Erreur lors de la suppression de l\'école'
      })
    }
  }

  // Apply search filter
  const filteredSchools = schools.filter(school => 
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (school.email && school.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (school.address && school.address.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Handle create modal close and refresh
  const handleCreateSuccess = (newSchool: School, admin: UserType) => {
    // Add new school to local state
    setSchools(prev => [...prev, newSchool])
    
    // Initialize stats for new school
    setSchoolStats(prev => ({
      ...prev,
      [newSchool.id]: { teachers: 0, students: 0 }
    }))
    
    showToast({
      type: 'success',
      title: 'École Créée',
      message: `L'école ${newSchool.name} a été créée avec succès avec ${admin.full_name} comme administrateur.`
    })
  }

  return (
    <div className="space-y-4">
      {/* Header and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <Building className="mr-2 h-6 w-6 text-blue-600" />
          Gestion des Écoles
        </h2>
        
        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          Nouvelle École
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, email ou adresse..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Schools Grid */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredSchools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <div 
                key={school.id} 
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-4 bg-blue-50 border-b border-gray-200 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{school.name}</h3>
                    {school.registration_number && (
                      <p className="text-xs text-gray-500">N° {school.registration_number}</p>
                    )}
                  </div>
                  <div className="flex">
                    <button 
                      onClick={() => {
                        setSelectedSchool(school)
                        setDeleteModalOpen(true)
                      }}
                      className="p-1 hover:bg-red-100 rounded-full text-red-500"
                      title="Supprimer cette école"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {school.address && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Adresse:</span>
                      <p className="text-gray-600">{school.address}</p>
                    </div>
                  )}
                  
                  {school.contact_number && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Téléphone:</span>
                      <p className="text-gray-600">{school.contact_number}</p>
                    </div>
                  )}
                  
                  {school.email && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-gray-600">{school.email}</p>
                    </div>
                  )}
                  
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Admin:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-green-700" />
                      </div>
                      <div className="text-gray-600">
                        {school.admin ? school.admin.full_name : 'Non assigné'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-2 mt-2 border-t border-gray-100">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Enseignants:</span>
                      <p className="text-gray-600">
                        {schoolStats[school.id]?.teachers || 0}
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Élèves:</span>
                      <p className="text-gray-600">
                        {schoolStats[school.id]?.students || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucune école trouvée avec les critères sélectionnés
          </div>
        )}
      </div>

      {/* Create School Modal */}
      <CreateSchoolModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Confirmer la suppression
              </h3>
              <p className="text-gray-500">
                Êtes-vous sûr de vouloir supprimer l'école <span className="font-semibold">{selectedSchool.name}</span> ? 
                Cette action supprimera également tous les utilisateurs associés et ne peut pas être annulée.
              </p>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false)
                    setSelectedSchool(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteSchool}
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
