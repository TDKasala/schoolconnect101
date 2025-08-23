import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Mail, 
  Search, 
  Filter, 
  Download, 
  Reply, 
  User, 
  Clock, 
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Phone,
  Building,
  Calendar,
  Eye,
  UserCheck,
  Archive,
  RefreshCw
} from 'lucide-react';

interface ContactMessage {
  id: string;
  sender_name: string;
  sender_email: string;
  sender_phone?: string;
  sender_organization?: string;
  subject: string;
  message: string;
  message_type: string;
  priority: string;
  status: string;
  assigned_to?: string;
  school_id?: string;
  source: string;
  read_at?: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
}

interface AdminResponse {
  id: string;
  message_id: string;
  admin_id: string;
  response_text: string;
  response_type: string;
  is_internal_note: boolean;
  sent_at?: string;
  created_at: string;
}

export const AdminContactCenter: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [responses, setResponses] = useState<AdminResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [responseType, setResponseType] = useState('email');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch messages with filters
  const fetchMessages = async () => {
    try {
      let query = (supabase as any)
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      if (typeFilter !== 'all') {
        query = query.eq('message_type', typeFilter);
      }
      if (priorityFilter !== 'all') {
        query = query.eq('priority', priorityFilter);
      }
      if (dateFilter !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
        switch (dateFilter) {
          case 'today':
            startDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
        }
        
        if (dateFilter !== 'all') {
          query = query.gte('created_at', startDate.toISOString());
        }
      }

      // Apply search
      if (searchTerm) {
        query = query.or(`sender_name.ilike.%${searchTerm}%,sender_email.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch responses for selected message
  const fetchResponses = async (messageId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('admin_responses')
        .select('*')
        .eq('message_id', messageId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setResponses(data || []);
    } catch (error) {
      console.error('Error fetching responses:', error);
    }
  };

  // Mark message as read
  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('contact_messages')
        .update({ 
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('id', messageId);
      
      if (error) throw error;
      
      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: 'read', read_at: new Date().toISOString() }
          : msg
      ));
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(prev => prev ? { ...prev, status: 'read', read_at: new Date().toISOString() } : null);
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  // Update message status
  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      const updates: any = { status };
      
      if (status === 'closed') {
        updates.closed_at = new Date().toISOString();
      }
      
      const { error } = await (supabase as any)
        .from('contact_messages')
        .update(updates)
        .eq('id', messageId);
      
      if (error) throw error;
      
      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      ));
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  // Send response
  const sendResponse = async () => {
    if (!selectedMessage || !responseText.trim()) return;
    
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');
      
      const { error } = await (supabase as any)
        .from('admin_responses')
        .insert({
          message_id: selectedMessage.id,
          admin_id: user.user.id,
          response_text: responseText,
          response_type: responseType,
          is_internal_note: isInternalNote,
          sent_at: isInternalNote ? null : new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Refresh responses and messages
      await fetchResponses(selectedMessage.id);
      await fetchMessages();
      
      // Reset form
      setResponseText('');
      setShowResponseForm(false);
      setIsInternalNote(false);
    } catch (error) {
      console.error('Error sending response:', error);
    }
  };

  // Export messages
  const exportMessages = () => {
    const csvContent = [
      ['Date', 'Sender', 'Email', 'Organization', 'Subject', 'Type', 'Priority', 'Status'].join(','),
      ...messages.map(msg => [
        new Date(msg.created_at).toLocaleDateString(),
        msg.sender_name,
        msg.sender_email,
        msg.sender_organization || '',
        `"${msg.subject}"`,
        msg.message_type,
        msg.priority,
        msg.status
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact_messages_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'responded': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  // Real-time subscription
  useEffect(() => {
    fetchMessages();
    
    if (autoRefresh) {
      const subscription = supabase
        .channel('contact_messages')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'contact_messages' },
          () => fetchMessages()
        )
        .subscribe();
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [searchTerm, statusFilter, typeFilter, priorityFilter, dateFilter, autoRefresh]);

  // Auto-refresh interval
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchMessages, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Fetch responses when message is selected
  useEffect(() => {
    if (selectedMessage) {
      fetchResponses(selectedMessage.id);
      if (selectedMessage.status === 'new') {
        markAsRead(selectedMessage.id);
      }
    }
  }, [selectedMessage]);

  const filteredMessages = messages;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Mail className="h-8 w-8 text-blue-600 mr-3" />
                Contact Center
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and respond to all incoming messages and support requests
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  autoRefresh 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto Refresh
              </button>
              <button
                onClick={exportMessages}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="in_progress">In Progress</option>
              <option value="responded">Responded</option>
              <option value="closed">Closed</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="general">General</option>
              <option value="support">Support</option>
              <option value="complaint">Complaint</option>
              <option value="feature_request">Feature Request</option>
              <option value="bug_report">Bug Report</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Messages ({filteredMessages.length})
                </h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading messages...</p>
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="p-8 text-center">
                    <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No messages found</p>
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => setSelectedMessage(message)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {message.sender_name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {message.sender_email}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(message.status)}`}>
                            {message.status}
                          </span>
                          <span className={`text-xs font-medium ${getPriorityColor(message.priority)}`}>
                            {message.priority}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-900 font-medium mb-1 truncate">
                        {message.subject}
                      </p>
                      <p className="text-xs text-gray-500 truncate mb-2">
                        {message.message}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                        {message.sender_organization && (
                          <span className="flex items-center">
                            <Building className="h-3 w-3 mr-1" />
                            {message.sender_organization}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Message Details */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-lg shadow-md">
                {/* Message Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {selectedMessage.subject}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {selectedMessage.sender_name}
                        </span>
                        <span className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {selectedMessage.sender_email}
                        </span>
                        {selectedMessage.sender_phone && (
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {selectedMessage.sender_phone}
                          </span>
                        )}
                      </div>
                      {selectedMessage.sender_organization && (
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <Building className="h-4 w-4 mr-1" />
                          {selectedMessage.sender_organization}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedMessage.status)}`}>
                        {selectedMessage.status}
                      </span>
                      <span className={`text-sm font-medium ${getPriorityColor(selectedMessage.priority)}`}>
                        {selectedMessage.priority} priority
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowResponseForm(!showResponseForm)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Respond
                    </button>
                    
                    <select
                      value={selectedMessage.status}
                      onChange={(e) => updateMessageStatus(selectedMessage.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="in_progress">In Progress</option>
                      <option value="responded">Responded</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Message Content */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Message</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Received: {new Date(selectedMessage.created_at).toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      Source: {selectedMessage.source}
                    </span>
                  </div>
                </div>

                {/* Response Form */}
                {showResponseForm && (
                  <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Send Response</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <select
                          value={responseType}
                          onChange={(e) => setResponseType(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="email">Email Response</option>
                          <option value="phone">Phone Response</option>
                          <option value="internal_note">Internal Note</option>
                        </select>
                        
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isInternalNote}
                            onChange={(e) => setIsInternalNote(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Internal note only</span>
                        </label>
                      </div>
                      
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Type your response here..."
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => setShowResponseForm(false)}
                          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={sendResponse}
                          disabled={!responseText.trim()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                        >
                          Send Response
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Responses History */}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Response History ({responses.length})
                  </h3>
                  {responses.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No responses yet</p>
                  ) : (
                    <div className="space-y-4">
                      {responses.map((response) => (
                        <div key={response.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">
                                Admin Response
                              </span>
                              {response.is_internal_note && (
                                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                  Internal Note
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(response.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {response.response_text}
                          </p>
                          {response.sent_at && (
                            <p className="text-xs text-green-600 mt-2">
                              Sent via {response.response_type} at {new Date(response.sent_at).toLocaleString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Message
                </h3>
                <p className="text-gray-500">
                  Choose a message from the list to view details and respond
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
