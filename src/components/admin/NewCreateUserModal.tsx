import React, { useState } from 'react'
import { X, Save, User, Mail, Shield, School as SchoolIcon } from 'lucide-react'
import { useToast } from '../../contexts/ToastContext'
import { UserAuthService } from '../../services/userAuthService'
import type { School } from '../../types'

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  schools: School[]
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  schools
}) => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'teacher' as 'platform_admin' | 'school_admin' | 'teacher' | 'parent',
    school_id: '',
    approved: true
  })
  
  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'L\'email est requis'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }
    
    // Name validation
    if (!formData.full_name) {
      newErrors.full_name = 'Le nom complet est requis'
    }
    
    // School validation for teachers and school admins
    if ((formData.role === 'teacher' || formData.role === 'school_admin') && !formData.school_id) {
      newErrors.school_id = 'Une école doit être sélectionnée'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)

    try {
      // Create user using Supabase Auth directly
      await UserAuthService.createUser({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        role: formData.role,
        school_id: formData.school_id || undefined,
        approved: formData.approved
      })

      showToast({
        type: 'success',
        title: 'Utilisateur Créé',
        message: 'Le nouvel utilisateur a été créé avec succès.'
      })

      // Reset form before closing
      setFormData({
        email: '',
        password: '',
        full_name: '',
        role: 'teacher',
        school_id: '',
        approved: true
      })
      
      // Reset validation errors
      setErrors({})

      // Call callbacks
      onSave()
      onClose()
      
    } catch (error: any) {
      console.error('Error creating user:', error)
      
      // Handle specific Supabase errors
      if (error.message?.includes('email already in use')) {
        setErrors({ email: 'Cet email est déjà utilisé' })
        showToast({
          type: 'error',
          title: 'Erreur',
          message: 'Cet email est déjà utilisé par un autre utilisateur.'
        })
      } else {
        showToast({
          type: 'error',
          title: 'Erreur',
          message: error.message || 'Erreur lors de la création de l\'utilisateur.'
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center min-w-0 flex-1">
            <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
              Créer Nouvel Utilisateur
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 ml-2 flex-shrink-0"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
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
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="utilisateur@exemple.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
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
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Minimum 6 caractères"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
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
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.full_name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Prénom Nom"
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
            )}
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
                École *
              </label>
              <select
                name="school_id"
                value={formData.school_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.school_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner une école</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name} ({school.code || school.registration_number || 'N/A'})
                  </option>
                ))}
              </select>
              {errors.school_id && (
                <p className="mt-1 text-sm text-red-600">{errors.school_id}</p>
              )}
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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 sm:py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  <span className="hidden sm:inline">Création...</span>
                  <span className="sm:hidden">Création en cours...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Créer Utilisateur</span>
                  <span className="sm:hidden">Créer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
