import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Mail, 
  MailOpen, 
  Trash2,
  Calendar,
  User
} from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  created_at: string;
}

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // For now, use mock data since contact_messages table doesn't exist yet
      const mockMessages: ContactMessage[] = [
        {
          id: '1',
          name: 'Jean Mukendi',
          email: 'jean@example.com',
          subject: 'Question sur les tarifs',
          message: 'Bonjour, je souhaiterais avoir plus d\'informations sur vos tarifs pour une école de 500 élèves.',
          status: 'new',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Marie Kabila',
          email: 'marie@example.com',
          subject: 'Demande de démonstration',
          message: 'Nous aimerions programmer une démonstration de votre plateforme pour notre école.',
          status: 'read',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      // For now, just update local state since table doesn't exist yet
      setMessages(messages.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: 'read' as const }
          : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleMarkAsResponded = async (messageId: string) => {
    try {
      // For now, just update local state since table doesn't exist yet
      setMessages(messages.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: 'responded' as const }
          : msg
      ));
    } catch (error) {
      console.error('Error marking message as responded:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      return;
    }

    try {
      // For now, just update local state since table doesn't exist yet
      setMessages(messages.filter(msg => msg.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'responded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return Mail;
      case 'read': return MailOpen;
      case 'responded': return MessageSquare;
      default: return Mail;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Nouveau';
      case 'read': return 'Lu';
      case 'responded': return 'Répondu';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Messages de contact depuis le site web</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{filteredMessages.length} messages</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher dans les messages..."
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
            <option value="new">Nouveaux</option>
            <option value="read">Lus</option>
            <option value="responded">Répondus</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              {filteredMessages.map((message) => {
                const StatusIcon = getStatusIcon(message.status);
                const isSelected = selectedMessage?.id === message.id;
                
                return (
                  <div
                    key={message.id}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (message.status === 'new') {
                        handleMarkAsRead(message.id);
                      }
                    }}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                      isSelected ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1 rounded-full ${getStatusColor(message.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{message.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-1">{message.email}</div>
                    <div className="text-sm font-medium text-gray-900 mb-1 truncate">
                      {message.subject}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {message.message}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {filteredMessages.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedMessage.subject}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {selectedMessage.name}
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {selectedMessage.email}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(selectedMessage.created_at).toLocaleString('fr-FR')}
                    </div>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMessage.status)}`}>
                  {getStatusLabel(selectedMessage.status)}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {selectedMessage.status !== 'responded' && (
                    <button
                      onClick={() => handleMarkAsResponded(selectedMessage.id)}
                      className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Marquer comme répondu
                    </button>
                  )}
                  
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Répondre par email
                  </a>
                </div>

                <button
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Sélectionnez un message
              </h3>
              <p className="text-gray-500">
                Choisissez un message dans la liste pour voir les détails.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
