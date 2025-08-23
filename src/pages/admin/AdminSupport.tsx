import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  RefreshCw, 
  Mail,
  MailOpen,
  Reply,
  Archive,
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  Phone,
  MapPin,
  Eye,
  Send,
  X,
  Plus
} from 'lucide-react';
// import { supabase } from '../../lib/supabase'; // Not used in current implementation

interface ContactMessage {
  id: string;
  sender_name: string;
  sender_email: string;
  sender_phone?: string;
  message_type: 'general' | 'support' | 'complaint' | 'suggestion';
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  school_id?: string;
  created_at: string;
  updated_at: string;
  admin_notes?: string;
  assigned_to?: string;
}

interface AdminResponse {
  id: string;
  message_id: string;
  admin_id: string;
  response_text: string;
  is_internal_note: boolean;
  created_at: string;
}

export const AdminSupport: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [responses, setResponses] = useState<AdminResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts', color: 'gray' },
    { value: 'new', label: 'Nouveau', color: 'blue' },
    { value: 'in_progress', label: 'En cours', color: 'yellow' },
    { value: 'resolved', label: 'Résolu', color: 'green' },
    { value: 'closed', label: 'Fermé', color: 'gray' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'Toutes priorités', color: 'gray' },
    { value: 'low', label: 'Faible', color: 'green' },
    { value: 'medium', label: 'Moyenne', color: 'yellow' },
    { value: 'high', label: 'Élevée', color: 'orange' },
    { value: 'urgent', label: 'Urgente', color: 'red' }
  ];

  const typeOptions = [
    { value: 'all', label: 'Tous types', color: 'gray' },
    { value: 'general', label: 'Général', color: 'blue' },
    { value: 'support', label: 'Support', color: 'green' },
    { value: 'complaint', label: 'Plainte', color: 'red' },
    { value: 'suggestion', label: 'Suggestion', color: 'purple' }
  ];

  useEffect(() => {
    fetchMessages();
    fetchResponses();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate contact messages data since table doesn't exist yet
      const mockMessages: ContactMessage[] = [
        {
          id: '1',
          sender_name: 'Marie Dubois',
          sender_email: 'marie.dubois@example.com',
          sender_phone: '+243 123 456 789',
          message_type: 'support',
          subject: 'Problème de connexion',
          message: 'Bonjour, je n\'arrive pas à me connecter à mon compte depuis hier. Pouvez-vous m\'aider ?',
          status: 'new',
          priority: 'medium',
          school_id: 'school-1',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          admin_notes: '',
          assigned_to: ''
        },
        {
          id: '2',
          sender_name: 'Jean Kabila',
          sender_email: 'jean.kabila@example.com',
          message_type: 'complaint',
          subject: 'Facturation incorrecte',
          message: 'Il y a une erreur dans ma facture du mois dernier. Le montant semble trop élevé.',
          status: 'in_progress',
          priority: 'high',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          admin_notes: 'En cours de vérification',
          assigned_to: 'admin-1'
        },
        {
          id: '3',
          sender_name: 'Grace Mbuyi',
          sender_email: 'grace.mbuyi@example.com',
          message_type: 'suggestion',
          subject: 'Amélioration de l\'interface',
          message: 'Serait-il possible d\'ajouter un mode sombre à l\'application ? Ce serait très apprécié.',
          status: 'resolved',
          priority: 'low',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          admin_notes: 'Suggestion notée pour la prochaine version',
          assigned_to: 'admin-2'
        }
      ];

      setMessages(mockMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchResponses = async () => {
    try {
      // Simulate admin responses data since table doesn't exist yet
      const mockResponses: AdminResponse[] = [
        {
          id: '1',
          message_id: '2',
          admin_id: 'admin-1',
          response_text: 'Nous avons vérifié votre facture et effectivement il y a eu une erreur. Nous procédons au remboursement.',
          is_internal_note: false,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
        },
        {
          id: '2',
          message_id: '2',
          admin_id: 'admin-1',
          response_text: 'Client contacté par téléphone, remboursement effectué',
          is_internal_note: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
        }
      ];

      setResponses(mockResponses);
    } catch (err) {
      console.error('Error fetching responses:', err);
    }
  };

  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      // Simulate status update since table doesn't exist yet
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: status as ContactMessage['status'], updated_at: new Date().toISOString() }
          : msg
      ));

    } catch (err) {
      console.error('Error updating message status:', err);
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const sendResponse = async (messageId: string, responseText: string, isInternalNote: boolean = false) => {
    try {
      // Simulate response creation since table doesn't exist yet
      const newResponse: AdminResponse = {
        id: Date.now().toString(),
        message_id: messageId,
        admin_id: user?.id || 'admin-current',
        response_text: responseText,
        is_internal_note: isInternalNote,
        created_at: new Date().toISOString()
      };

      setResponses(prev => [...prev, newResponse]);

      // Update message status to in_progress if it's new
      const message = messages.find(m => m.id === messageId);
      if (message?.status === 'new') {
        updateMessageStatus(messageId, 'in_progress');
      }

    } catch (err) {
      console.error('Error sending response:', err);
      setError('Erreur lors de l\'envoi de la réponse');
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || message.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || message.message_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || 'gray';
  };

  const getPriorityColor = (priority: string) => {
    const option = priorityOptions.find(opt => opt.value === priority);
    return option?.color || 'gray';
  };

  const getTypeColor = (type: string) => {
    const option = typeOptions.find(opt => opt.value === type);
    return option?.color || 'gray';
  };

  const getMessageResponses = (messageId: string) => {
    return responses.filter(response => response.message_id === messageId);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mr-3" />
          <span className="text-lg text-gray-600">Chargement des messages...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchMessages}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600 mr-3" />
              Support & Messages
            </h1>
            <p className="text-gray-600">
              Gestion des messages de contact et demandes de support
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchMessages}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Messages ({filteredMessages.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      {message.status === 'new' ? (
                        <Mail className="h-4 w-4 text-blue-500 mr-2" />
                      ) : (
                        <MailOpen className="h-4 w-4 text-gray-400 mr-2" />
                      )}
                      <span className="font-medium text-gray-900 text-sm">
                        {message.sender_name}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${getPriorityColor(message.priority)}-100 text-${getPriorityColor(message.priority)}-800`}>
                        {message.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1 truncate">
                    {message.subject}
                  </p>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {message.message}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(message.created_at).toLocaleDateString('fr-FR')}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(message.status)}-100 text-${getStatusColor(message.status)}-800`}>
                      {message.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || typeFilter !== 'all'
                    ? 'Aucun message ne correspond aux filtres sélectionnés'
                    : 'Aucun message de contact pour le moment'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Message Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {selectedMessage.sender_name}
                        </h2>
                        <p className="text-sm text-gray-600">{selectedMessage.sender_email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedMessage.status}
                      onChange={(e) => updateMessageStatus(selectedMessage.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statusOptions.filter(opt => opt.value !== 'all').map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowResponseModal(true)}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Répondre
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-gray-500">Type</label>
                    <p className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${getTypeColor(selectedMessage.message_type)}-100 text-${getTypeColor(selectedMessage.message_type)}-800`}>
                      {selectedMessage.message_type}
                    </p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-500">Priorité</label>
                    <p className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-${getPriorityColor(selectedMessage.priority)}-100 text-${getPriorityColor(selectedMessage.priority)}-800`}>
                      {selectedMessage.priority}
                    </p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-500">Créé le</label>
                    <p className="text-gray-900">{new Date(selectedMessage.created_at).toLocaleString('fr-FR')}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-500">Mis à jour</label>
                    <p className="text-gray-900">{new Date(selectedMessage.updated_at).toLocaleString('fr-FR')}</p>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedMessage.subject}</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Responses */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique des réponses</h3>
                <div className="space-y-4">
                  {getMessageResponses(selectedMessage.id).map((response) => (
                    <div key={response.id} className={`p-4 rounded-lg ${response.is_internal_note ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {response.is_internal_note ? (
                            <Eye className="h-4 w-4 text-yellow-600 mr-2" />
                          ) : (
                            <Reply className="h-4 w-4 text-blue-600 mr-2" />
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {response.is_internal_note ? 'Note interne' : 'Réponse admin'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(response.created_at).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{response.response_text}</p>
                    </div>
                  ))}
                  {getMessageResponses(selectedMessage.id).length === 0 && (
                    <p className="text-gray-500 text-center py-4">Aucune réponse pour le moment</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez un message</h3>
              <p className="text-gray-600">
                Choisissez un message dans la liste pour voir les détails et répondre
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Répondre au message</h3>
              <button
                onClick={() => setShowResponseModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isInternalNote}
                  onChange={(e) => setIsInternalNote(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Note interne (non visible par l'utilisateur)</span>
              </label>
            </div>
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder={isInternalNote ? "Ajouter une note interne..." : "Tapez votre réponse..."}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
            />
            <div className="flex items-center justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowResponseModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (selectedMessage && responseText.trim()) {
                    sendResponse(selectedMessage.id, responseText, isInternalNote);
                    setResponseText('');
                    setIsInternalNote(false);
                    setShowResponseModal(false);
                  }
                }}
                disabled={!responseText.trim()}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4 mr-2" />
                {isInternalNote ? 'Ajouter la note' : 'Envoyer la réponse'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
