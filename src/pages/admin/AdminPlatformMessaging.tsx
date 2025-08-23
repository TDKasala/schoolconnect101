import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { supabase } from '../../lib/supabase';
import { 
  Send, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  MessageSquare,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Megaphone
} from 'lucide-react';

interface PlatformMessage {
  id: string;
  title: string;
  content: string;
  message_type: 'announcement' | 'alert' | 'maintenance' | 'update';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  sender_id: string;
  target_audience: {
    schools?: string[];
    roles?: string[];
    specific_users?: string[];
  };
  status: 'draft' | 'scheduled' | 'sent' | 'archived';
  scheduled_for: string | null;
  sent_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

interface PlatformAnnouncement {
  id: string;
  title: string;
  content: string;
  announcement_type: 'general' | 'maintenance' | 'feature' | 'policy';
  priority: 'low' | 'normal' | 'high' | 'critical';
  target_schools: string[] | null;
  target_roles: string[] | null;
  is_pinned: boolean;
  is_active: boolean;
  published_at: string | null;
  expires_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const AdminPlatformMessaging: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'messages' | 'announcements' | 'compose'>('messages');
  const [messages, setMessages] = useState<PlatformMessage[]>([]);
  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Compose form state
  const [composeType, setComposeType] = useState<'message' | 'announcement'>('message');
  const [composeForm, setComposeForm] = useState({
    title: '',
    content: '',
    message_type: 'announcement',
    announcement_type: 'general',
    priority: 'normal',
    target_roles: '',
    is_pinned: false
  });

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages();
    } else if (activeTab === 'announcements') {
      fetchAnnouncements();
    }
  }, [activeTab]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh && activeTab !== 'compose') {
      interval = setInterval(() => {
        if (activeTab === 'messages') {
          fetchMessages();
        } else if (activeTab === 'announcements') {
          fetchAnnouncements();
        }
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, autoRefresh]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('platform_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      let filteredData = data || [];

      // Apply search filter
      if (searchTerm) {
        filteredData = filteredData.filter(msg => 
          msg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setMessages(filteredData);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('platform_announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      let filteredData = data || [];

      // Apply search filter
      if (searchTerm) {
        filteredData = filteredData.filter(ann => 
          ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ann.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setAnnouncements(filteredData);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    try {
      if (!composeForm.title || !composeForm.content) {
        alert('Please fill in title and content');
        return;
      }

      const messageData = {
        title: composeForm.title,
        content: composeForm.content,
        message_type: composeForm.message_type,
        priority: composeForm.priority,
        sender_id: user?.id,
        target_audience: {
          roles: composeForm.target_roles ? composeForm.target_roles.split(',').map(r => r.trim()) : null
        },
        status: 'sent'
      };

      const { error } = await supabase
        .from('platform_messages')
        .insert([messageData]);

      if (error) throw error;

      alert('Message sent successfully!');
      resetForm();
      setActiveTab('messages');
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Error sending message');
    }
  };

  const publishAnnouncement = async () => {
    try {
      if (!composeForm.title || !composeForm.content) {
        alert('Please fill in title and content');
        return;
      }

      const announcementData = {
        title: composeForm.title,
        content: composeForm.content,
        announcement_type: composeForm.announcement_type,
        priority: composeForm.priority,
        target_roles: composeForm.target_roles ? composeForm.target_roles.split(',').map(r => r.trim()) : null,
        is_pinned: composeForm.is_pinned,
        is_active: true,
        published_at: new Date().toISOString(),
        created_by: user?.id
      };

      const { error } = await supabase
        .from('platform_announcements')
        .insert([announcementData]);

      if (error) throw error;

      alert('Announcement published successfully!');
      resetForm();
      setActiveTab('announcements');
      fetchAnnouncements();
    } catch (err) {
      console.error('Error publishing announcement:', err);
      alert('Error publishing announcement');
    }
  };

  const resetForm = () => {
    setComposeForm({
      title: '',
      content: '',
      message_type: 'announcement',
      announcement_type: 'general',
      priority: 'normal',
      target_roles: '',
      is_pinned: false
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'normal': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'draft': return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user || !profile) {
    return <div>Access denied</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Messaging</h1>
          <p className="text-gray-600">Send announcements and manage platform-wide communications</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              autoRefresh 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Auto Refresh
          </button>
          <button
            onClick={() => activeTab === 'messages' ? fetchMessages() : fetchAnnouncements()}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('messages')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'messages'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MessageSquare className="h-4 w-4 inline mr-2" />
            Messages ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'announcements'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Megaphone className="h-4 w-4 inline mr-2" />
            Announcements ({announcements.length})
          </button>
          <button
            onClick={() => setActiveTab('compose')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'compose'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Compose
          </button>
        </nav>
      </div>

      {/* Search Bar */}
      {activeTab !== 'compose' && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search messages and announcements..."
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Loading {activeTab}...</p>
          </div>
        ) : activeTab === 'compose' ? (
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="message"
                  checked={composeType === 'message'}
                  onChange={(e) => setComposeType(e.target.value as 'message')}
                  className="mr-2"
                />
                <MessageSquare className="h-4 w-4 mr-1" />
                Direct Message
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="announcement"
                  checked={composeType === 'announcement'}
                  onChange={(e) => setComposeType(e.target.value as 'announcement')}
                  className="mr-2"
                />
                <Megaphone className="h-4 w-4 mr-1" />
                Public Announcement
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={composeForm.title}
                  onChange={(e) => setComposeForm({...composeForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={composeForm.priority}
                  onChange={(e) => setComposeForm({...composeForm, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Roles</label>
                <input
                  type="text"
                  value={composeForm.target_roles}
                  onChange={(e) => setComposeForm({...composeForm, target_roles: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="teacher, parent, school_admin (comma separated)"
                />
              </div>

              {composeType === 'announcement' && (
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={composeForm.is_pinned}
                      onChange={(e) => setComposeForm({...composeForm, is_pinned: e.target.checked})}
                      className="mr-2"
                    />
                    Pin announcement
                  </label>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={composeForm.content}
                onChange={(e) => setComposeForm({...composeForm, content: e.target.value})}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your message content..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  resetForm();
                  setActiveTab('messages');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={composeType === 'message' ? sendMessage : publishAnnouncement}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <Send className="h-4 w-4 inline mr-2" />
                {composeType === 'message' ? 'Send Message' : 'Publish Announcement'}
              </button>
            </div>
          </div>
        ) : activeTab === 'messages' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map((message) => (
                  <tr key={message.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{message.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{message.content}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {message.message_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(message.priority)}`}>
                        {message.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(message.status)}
                        <span className="ml-2 text-sm text-gray-900">{message.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(message.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {messages.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No messages found.
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 p-6">
            {announcements.map((announcement) => (
              <div key={announcement.id} className={`p-4 rounded-lg border-l-4 ${
                announcement.priority === 'critical' ? 'border-red-500 bg-red-50' :
                announcement.priority === 'high' ? 'border-orange-500 bg-orange-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{announcement.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority}
                      </span>
                      {announcement.is_pinned && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pinned
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{announcement.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Type: {announcement.announcement_type}</span>
                      <span>Created: {formatDate(announcement.created_at)}</span>
                      {announcement.published_at && (
                        <span>Published: {formatDate(announcement.published_at)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {announcements.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No announcements found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
