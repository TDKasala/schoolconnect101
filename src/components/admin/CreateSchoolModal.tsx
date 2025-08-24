import React, { useState, useEffect } from 'react'
import { X, Building, User, Plus, Search } from 'lucide-react'
import { CreateSchoolData, SchoolAdminAssignment, User as UserType } from '../../types'
import { SchoolService } from '../../services/schoolService'
import { UserService } from '../../services/userService'

interface CreateSchoolModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (school: any, admin: UserType) => void
}

export const CreateSchoolModal: React.FC<CreateSchoolModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<'school' | 'admin'>('school')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // School data
  const [schoolData, setSchoolData] = useState<CreateSchoolData>({
    name: '',
    address: '',
    contact_number: '',
    email: '',
    registration_number: ''
  })

  // Admin assignment data
  const [adminAssignment, setAdminAssignment] = useState<SchoolAdminAssignment>({
    type: 'new',
    newUserData: {
      email: '',
      full_name: '',
      phone: ''
    }
  })

  // For existing user selection
  const [existingUsers, setExistingUsers] = useState<UserType[]>([])
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(false)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('school')
      setError('')
      setSchoolData({
        name: '',
        address: '',
        contact_number: '',
        email: '',
        registration_number: ''
      })
      setAdminAssignment({
        type: 'new',
        newUserData: {
          email: '',
          full_name: '',
          phone: ''
        }
      })
    }
  }, [isOpen])

  // Load existing users when switching to existing user type
  useEffect(() => {
    if (adminAssignment.type === 'existing') {
      loadExistingUsers()
    }
  }, [adminAssignment.type])

  const loadExistingUsers = async () => {
    setLoadingUsers(true)
    try {
      const users = await UserService.getAll()
      // Filter out users who already have school_admin role or are assigned to a school
      const availableUsers = users.filter(user => 
        user.role !== 'school_admin' && !user.school_id
      )
      setExistingUsers(availableUsers)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!schoolData.name.trim()) {
      setError('Le nom de l\'école est requis')
      return
    }
    setError('')
    setStep('admin')
  }

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate admin assignment
      if (adminAssignment.type === 'existing' && !adminAssignment.existingUserId) {
        throw new Error('Veuillez sélectionner un utilisateur existant')
      }
      
      if (adminAssignment.type === 'new') {
        if (!adminAssignment.newUserData?.email || !adminAssignment.newUserData?.full_name) {
          throw new Error('Email et nom complet sont requis pour le nouvel utilisateur')
        }
      }

      const result = await SchoolService.createWithAdmin(schoolData, adminAssignment)
      onSuccess(result.school, result.admin)
      onClose()
    } catch (error: any) {
      console.error('Error creating school:', error)
      setError(error.message || 'Erreur lors de la création de l\'école')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = existingUsers.filter(user =>
    user.full_name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Building className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Créer une nouvelle école
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${step === 'school' ? 'text-blue-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'school' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
              }`}>
                1
              </div>
              <span className="font-medium">Informations de l'école</span>
            </div>
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${step === 'admin' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'admin' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
              }`}>
                2
              </div>
              <span className="font-medium">Administrateur de l'école</span>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Step 1: School Information */}
        {step === 'school' && (
          <form onSubmit={handleSchoolSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'école *
                </label>
                <input
                  type="text"
                  value={schoolData.name}
                  onChange={(e) => setSchoolData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: École Primaire Saint-Joseph"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <textarea
                  value={schoolData.address || ''}
                  onChange={(e) => setSchoolData(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adresse complète de l'école"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  value={schoolData.contact_number || ''}
                  onChange={(e) => setSchoolData(prev => ({ ...prev, contact_number: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+243 XXX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={schoolData.email || ''}
                  onChange={(e) => setSchoolData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contact@ecole.cd"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro d'enregistrement
                </label>
                <input
                  type="text"
                  value={schoolData.registration_number || ''}
                  onChange={(e) => setSchoolData(prev => ({ ...prev, registration_number: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Numéro d'enregistrement officiel"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Suivant
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Admin Assignment */}
        {step === 'admin' && (
          <form onSubmit={handleFinalSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Assigner un administrateur d'école
              </h3>

              {/* Admin type selection */}
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="adminType"
                    value="new"
                    checked={adminAssignment.type === 'new'}
                    onChange={(e) => setAdminAssignment(prev => ({ ...prev, type: 'new' }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Créer un nouvel utilisateur
                  </span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="adminType"
                    value="existing"
                    checked={adminAssignment.type === 'existing'}
                    onChange={(e) => setAdminAssignment(prev => ({ ...prev, type: 'existing' }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Sélectionner un utilisateur existant
                  </span>
                </label>
              </div>

              {/* New user form */}
              {adminAssignment.type === 'new' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        value={adminAssignment.newUserData?.full_name || ''}
                        onChange={(e) => setAdminAssignment(prev => ({
                          ...prev,
                          newUserData: { ...prev.newUserData!, full_name: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nom complet de l'administrateur"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={adminAssignment.newUserData?.email || ''}
                        onChange={(e) => setAdminAssignment(prev => ({
                          ...prev,
                          newUserData: { ...prev.newUserData!, email: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="admin@ecole.cd"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={adminAssignment.newUserData?.phone || ''}
                        onChange={(e) => setAdminAssignment(prev => ({
                          ...prev,
                          newUserData: { ...prev.newUserData!, phone: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+243 XXX XXX XXX"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Un mot de passe temporaire sera généré et envoyé par email.
                  </p>
                </div>
              )}

              {/* Existing user selection */}
              {adminAssignment.type === 'existing' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Rechercher un utilisateur..."
                    />
                  </div>

                  {loadingUsers ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : (
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {filteredUsers.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Aucun utilisateur disponible
                        </p>
                      ) : (
                        filteredUsers.map((user) => (
                          <label key={user.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-white cursor-pointer">
                            <input
                              type="radio"
                              name="existingUser"
                              value={user.id}
                              checked={adminAssignment.existingUserId === user.id}
                              onChange={(e) => setAdminAssignment(prev => ({
                                ...prev,
                                existingUserId: user.id
                              }))}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                              <p className="text-xs text-gray-400">Rôle: {user.role}</p>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep('school')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Précédent
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>Créer l'école</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
