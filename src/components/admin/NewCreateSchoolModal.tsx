import React, { useState, useEffect } from 'react'
import { X, Building, User, Plus, Search } from 'lucide-react'
import { CreateSchoolData, SchoolAdminAssignment, User as UserType } from '../../types'
import { SchoolDbService } from '../../services/schoolDbService'
import { UserAuthService } from '../../services/userAuthService'
import { useToast } from '../../contexts/ToastContext'

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
  const { showToast } = useToast()
  const [step, setStep] = useState<'school' | 'admin'>('school')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // School data
  const [formData, setFormData] = useState<CreateSchoolData>({
    name: '',
    address: '',
    city: '',
    province: '',
    country: 'République Démocratique du Congo',
    phone: '',
    email: '',
    max_students: undefined
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
      setErrors({})
      setFormData({
        name: '',
        address: '',
        city: '',
        province: '',
        country: 'République Démocratique du Congo',
        phone: '',
        email: '',
        max_students: undefined
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
    if (adminAssignment.type === 'existing' && isOpen) {
      loadExistingUsers()
    }
  }, [adminAssignment.type, isOpen])

  const loadExistingUsers = async () => {
    setLoadingUsers(true)
    try {
      // Get all users using our new service
      const users = await UserAuthService.getAllUsers()
      
      // Filter out users who already have school_admin role or are assigned to a school
      const availableUsers = users.filter(user => 
        user.role !== 'school_admin' && !user.school_id
      )
      
      setExistingUsers(availableUsers)
    } catch (error) {
      console.error('Error loading users:', error)
      setError('Impossible de charger les utilisateurs')
    } finally {
      setLoadingUsers(false)
    }
  }

  const validateSchoolForm = () => {
    const newErrors: Record<string, string> = {}
    
    // School name is required
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de l\'école est requis'
    }
    
    // Email validation if provided
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const validateAdminForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (adminAssignment.type === 'existing') {
      if (!adminAssignment.existingUserId) {
        newErrors.existingUser = 'Veuillez sélectionner un utilisateur'
      }
    } else {
      // New user validation
      if (!adminAssignment.newUserData?.full_name?.trim()) {
        newErrors.full_name = 'Le nom complet est requis'
      }
      
      if (!adminAssignment.newUserData?.email) {
        newErrors.email = 'L\'email est requis'
      } else if (!/^\S+@\S+\.\S+$/.test(adminAssignment.newUserData.email)) {
        newErrors.email = 'Format d\'email invalide'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateSchoolForm()) {
      return
    }
    
    setError('')
    setStep('admin')
  }

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateAdminForm()) {
      return
    }
    
    setLoading(true)
    setError('')

    try {
      // Create school with admin using our new service
      const result = await SchoolDbService.createSchoolWithAdmin(formData, adminAssignment)
      
      showToast({
        type: 'success',
        title: 'École Créée',
        message: 'La nouvelle école a été créée avec succès avec son administrateur.'
      })
      
      onSuccess(result.school, result.admin)
      onClose()
      
    } catch (error: any) {
      console.error('Error creating school:', error)
      setError(error.message || 'Erreur lors de la création de l\'école')
      
      showToast({
        type: 'error',
        title: 'Erreur',
        message: error.message || 'Erreur lors de la création de l\'école'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, formType: 'school' | 'admin') => {
    const { name, value } = e.target
    
    if (formType === 'school') {
      // Handle number fields properly
      const processedValue = name === 'max_students' ? (value ? parseInt(value) : undefined) : value
      setFormData(prev => ({ ...prev, [name]: processedValue }))
    } else {
      setAdminAssignment(prev => ({
        ...prev,
        newUserData: prev.newUserData ? { ...prev.newUserData, [name]: value } : { email: '', full_name: '', phone: '' }
      }))
    }
  }

  const filteredUsers = existingUsers.filter(user =>
    user.full_name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center min-w-0 flex-1">
            <Building className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              Créer Nouvelle École
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 ml-2 flex-shrink-0"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Progress Steps - Hidden on mobile */}
        <div className="hidden sm:flex items-center justify-center p-4 bg-gray-50 border-b border-gray-200">
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
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange(e, 'school')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: École Primaire Saint-Joseph"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <textarea
                  name="address"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange(e, 'school')}
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
                  name="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange(e, 'school')}
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
                  name="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange(e, 'school')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="contact@ecole.cd"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ''}
                  onChange={(e) => handleInputChange(e, 'school')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Kinshasa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Province
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province || ''}
                  onChange={(e) => handleInputChange(e, 'school')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Kinshasa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre maximum d'élèves
                </label>
                <input
                  type="number"
                  name="max_students"
                  value={formData.max_students || ''}
                  onChange={(e) => handleInputChange(e, 'school')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 500"
                  min="1"
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
                    onChange={() => setAdminAssignment(prev => ({ ...prev, type: 'new' }))}
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
                    onChange={() => setAdminAssignment(prev => ({ ...prev, type: 'existing' }))}
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
                        name="full_name"
                        value={adminAssignment.newUserData?.full_name || ''}
                        onChange={(e) => handleInputChange(e, 'admin')}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.full_name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Nom complet de l'administrateur"
                      />
                      {errors.full_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={adminAssignment.newUserData?.email || ''}
                        onChange={(e) => handleInputChange(e, 'admin')}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="admin@ecole.cd"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={adminAssignment.newUserData?.phone || ''}
                        onChange={(e) => handleInputChange(e, 'admin')}
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
                              onChange={() => {
                                setAdminAssignment(prev => ({
                                  ...prev,
                                  existingUserId: user.id
                                }))
                                
                                // Clear error when user makes a selection
                                if (errors.existingUser) {
                                  setErrors(prev => {
                                    const newErrors = { ...prev }
                                    delete newErrors.existingUser
                                    return newErrors
                                  })
                                }
                              }}
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
                  
                  {errors.existingUser && (
                    <p className="mt-1 text-sm text-red-600">{errors.existingUser}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep('school')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                Précédent
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading}
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
