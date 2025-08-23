import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { supabase } from '../../lib/supabase';
import { MessageSquare, Plus, Search, Filter, Mail, Phone, Calendar, AlertTriangle, CheckCircle, Clock, User } from 'lucide-react';

interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  sender_phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  priority: 'low' | 'medium' | 'high';
  category?: string;
  created_at: string;
  updated_at: string;
}

interface MessageStats {
  total_messages: number;
  new_messages: number;
  read_messages: number;
  replied_messages: number;
}

export const SchoolMessages: React.FC = () => {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageStats, setMessageStats] = useState<MessageStats>({
    total_messages: 0,
    new_messages: 0,
    read_messages: 0,
    replied_messages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    fetchMessages();
  }, [profile?.school_id]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!profile?.school_id) {
        throw new Error('No school ID found');
      }

      // Fetch messages from contact_messages table
      const { data: messagesData, error: messagesError } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('school_id', profile.school_id)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Transform contact_messages to match our Message interface
      const transformedMessages: Message[] = (messagesData || []).map(msg => ({
        id: msg.id,
        sender_name: msg.name,
        sender_email: msg.email,
        sender_phone: msg.phone,
        subject: msg.subject || 'No Subject',
        message: msg.message,
        status: msg.status || 'new',
        priority: msg.priority || 'medium',
        category: msg.category,
        created_at: msg.created_at,
        updated_at: msg.updated_at || msg.created_at
      }));

      setMessages(transformedMessages);

      // Calculate message statistics
      const stats = transformedMessages.reduce((acc, msg) => {
        acc.total_messages += 1;
        switch (msg.status) {
          case 'new':
            acc.new_messages += 1;
            break;
          case 'read':
            acc.read_messages += 1;
            break;
          case 'replied':
            acc.replied_messages += 1;
            break;
        }
        return acc;
      }, {
        total_messages: 0,
        new_messages: 0,
        read_messages: 0,
        replied_messages: 0
      });

      setMessageStats(stats);

    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sender_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || message.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Mail className="h-4 w-4 text-blue-600" />;
      case 'read': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'replied': return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case 'archived': return <Clock className="h-4 w-4 text-gray-600" />;
      default: return <Mail className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-green-100 text-green-800';
      case 'replied': return 'bg-purple-100 text-purple-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
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
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
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
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600">Communicate with students, teachers, and parents</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </button>
        </div>
      </div>

      {/* Message Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Messages</p>
              <p className="text-2xl font-semibold text-gray-900">{messageStats.total_messages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">New Messages</p>
              <p className="text-2xl font-semibold text-gray-900">{messageStats.new_messages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Read</p>
              <p className="text-2xl font-semibold text-gray-900">{messageStats.read_messages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Replied</p>
              <p className="text-2xl font-semibold text-gray-900">{messageStats.replied_messages}</p>
            </div>
          </div>
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
                  placeholder="Search messages..."
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
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {filteredMessages.length} of {messages.length} messages
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {messages.length === 0 ? 'No Messages Found' : 'No Matching Messages'}
              </h3>
              <p className="text-gray-600 mb-4">
                {messages.length === 0 
                  ? 'No messages have been received yet.'
                  : 'Try adjusting your search criteria or filters.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <div key={message.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium text-gray-900">
                              {message.sender_name}
                            </h4>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(message.priority)}`}>
                              {message.priority}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(message.status)}
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(message.status)}`}>
                              {message.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Mail className="h-4 w-4 mr-1" />
                          <span>{message.sender_email}</span>
                          {message.sender_phone && (
                            <>
                              <Phone className="h-4 w-4 ml-3 mr-1" />
                              <span>{message.sender_phone}</span>
                            </>
                          )}
                        </div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">
                          {message.subject}
                        </h5>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {message.message}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(message.created_at).toLocaleString()}
                          </div>
                          {message.category && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                              {message.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
