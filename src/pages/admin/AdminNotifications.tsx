import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Edit3, 
  Trash2, 
  Send, 
  Archive, 
  Clock, 
  Users, 
  AlertTriangle,
  CheckCircle,
  X,
  Save,
  Loader2,
  Calendar,
  Mail,
  Eye,
  Filter
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Notification {
  id: string;
  title: string;
  message: string;
  recipient_role: string | null;
  status: 'draft' | 'published' | 'archived';
  importance: 'low' | 'normal' | 'high' | 'critical';
  type: 'announcement' | 'system_alert' | 'maintenance';
  scheduled_for: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface SystemAlert {
  id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  resolved: boolean;
  created_at: string;
}

interface NotificationFormData {
  title: string;
  message: string;
  recipient_role: string;
  importance: string;
  type: string;
  scheduled_for: string;
  email_delivery: boolean;
}

interface Toast {
  type: 'success' | 'error';
  message: string;
  show: boolean;
}

const RECIPIENT_ROLES = [
  { value: '', label: 'All Users' },
  { value: 'platform_admin', label: 'Platform Admins' },
  { value: 'school_admin', label: 'School Admins' },
  { value: 'teacher', label: 'Teachers' },
  { value: 'parent', label: 'Parents' }
];

const IMPORTANCE_LEVELS = [
  { value: 'low', label: 'Low', color: 'text-gray-600 bg-gray-100' },
  { value: 'normal', label: 'Normal', color: 'text-blue-600 bg-blue-100' },
  { value: 'high', label: 'High', color: 'text-orange-600 bg-orange-100' },
  { value: 'critical', label: 'Critical', color: 'text-red-600 bg-red-100' }
];

const NOTIFICATION_TYPES = [
  { value: 'announcement', label: 'Announcement' },
  { value: 'system_alert', label: 'System Alert' },
  { value: 'maintenance', label: 'Maintenance' }
];

export const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [formData, setFormData] = useState<NotificationFormData>({
    title: '',
    message: '',
    recipient_role: '',
    importance: 'normal',
    type: 'announcement',
    scheduled_for: '',
    email_delivery: false
  });
  const [toast, setToast] = useState<Toast>({ type: 'success', message: '', show: false });
  const [activeTab, setActiveTab] = useState<'notifications' | 'alerts'>('notifications');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchNotifications();
    fetchSystemAlerts();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      showToast('error', 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('system_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setSystemAlerts(data || []);
    } catch (err) {
      console.error('Error fetching system alerts:', err);
    }
  };

  const handleCreateNotification = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          title: formData.title,
          message: formData.message,
          recipient_role: formData.recipient_role || null,
          importance: formData.importance,
          type: formData.type,
          scheduled_for: formData.scheduled_for || null,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setNotifications([data, ...notifications]);
      setShowCreateModal(false);
      resetForm();
      showToast('success', 'Notification created successfully');
    } catch (err) {
      console.error('Error creating notification:', err);
      showToast('error', 'Failed to create notification');
    }
  };

  const handleUpdateNotification = async () => {
    if (!editingNotification) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({
          title: formData.title,
          message: formData.message,
          recipient_role: formData.recipient_role || null,
          importance: formData.importance,
          type: formData.type,
          scheduled_for: formData.scheduled_for || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingNotification.id)
        .select()
        .single();

      if (error) throw error;

      setNotifications(notifications.map(n => 
        n.id === editingNotification.id ? data : n
      ));
      setEditingNotification(null);
      resetForm();
      showToast('success', 'Notification updated successfully');
    } catch (err) {
      console.error('Error updating notification:', err);
      showToast('error', 'Failed to update notification');
    }
  };

  const handlePublishNotification = async (notificationId: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;

      setNotifications(notifications.map(n => 
        n.id === notificationId ? data : n
      ));
      showToast('success', 'Notification published successfully');
    } catch (err) {
      console.error('Error publishing notification:', err);
      showToast('error', 'Failed to publish notification');
    }
  };

  const handleArchiveNotification = async (notificationId: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ status: 'archived' })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;

      setNotifications(notifications.map(n => 
        n.id === notificationId ? data : n
      ));
      showToast('success', 'Notification archived successfully');
    } catch (err) {
      console.error('Error archiving notification:', err);
      showToast('error', 'Failed to archive notification');
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(notifications.filter(n => n.id !== notificationId));
      showToast('success', 'Notification deleted successfully');
    } catch (err) {
      console.error('Error deleting notification:', err);
      showToast('error', 'Failed to delete notification');
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      const { data, error } = await supabase
        .from('system_alerts')
        .update({ 
          resolved: true,
          resolved_by: (await supabase.auth.getUser()).data.user?.id,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId)
        .select()
        .single();

      if (error) throw error;

      setSystemAlerts(systemAlerts.map(a => 
        a.id === alertId ? data : a
      ));
      showToast('success', 'Alert resolved successfully');
    } catch (err) {
      console.error('Error resolving alert:', err);
      showToast('error', 'Failed to resolve alert');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      recipient_role: '',
      importance: 'normal',
      type: 'announcement',
      scheduled_for: '',
      email_delivery: false
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (notification: Notification) => {
    setFormData({
      title: notification.title,
      message: notification.message,
      recipient_role: notification.recipient_role || '',
      importance: notification.importance,
      type: notification.type,
      scheduled_for: notification.scheduled_for || '',
      email_delivery: false
    });
    setEditingNotification(notification);
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message, show: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImportanceColor = (importance: string) => {
    return IMPORTANCE_LEVELS.find(level => level.value === importance)?.color || 'text-gray-600 bg-gray-100';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (statusFilter === 'all') return true;
    return notification.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-600">Loading notifications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifications & Alerts</h1>
          <p className="text-gray-600">Manage system notifications and alerts</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Notification
        </button>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg flex items-center ${
          toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertTriangle className="h-5 w-5 mr-2" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'notifications'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Bell className="h-4 w-4 inline mr-2" />
          Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'alerts'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <AlertTriangle className="h-4 w-4 inline mr-2" />
          System Alerts ({systemAlerts.filter(a => !a.resolved).length})
        </button>
      </div>

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div>
          {/* Filter */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div key={notification.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getImportanceColor(notification.importance)}`}>
                        {notification.importance}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        notification.status === 'published' ? 'text-green-600 bg-green-100' :
                        notification.status === 'draft' ? 'text-yellow-600 bg-yellow-100' :
                        'text-gray-600 bg-gray-100'
                      }`}>
                        {notification.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {notification.recipient_role ? 
                          RECIPIENT_ROLES.find(r => r.value === notification.recipient_role)?.label : 
                          'All Users'
                        }
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {notification.scheduled_for ? 
                          `Scheduled: ${formatDate(notification.scheduled_for)}` :
                          `Created: ${formatDate(notification.created_at)}`
                        }
                      </div>
                      {notification.published_at && (
                        <div className="flex items-center">
                          <Send className="h-4 w-4 mr-1" />
                          Published: {formatDate(notification.published_at)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {notification.status === 'draft' && (
                      <button
                        onClick={() => handlePublishNotification(notification.id)}
                        className="text-green-600 hover:text-green-800"
                        title="Publish"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(notification)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    {notification.status !== 'archived' && (
                      <button
                        onClick={() => handleArchiveNotification(notification.id)}
                        className="text-orange-600 hover:text-orange-800"
                        title="Archive"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500 mb-4">Create your first notification to get started.</p>
              <button
                onClick={openCreateModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Notification
              </button>
            </div>
          )}
        </div>
      )}

      {/* System Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {systemAlerts.map((alert) => (
            <div key={alert.id} className={`bg-white rounded-lg shadow p-6 border-l-4 ${
              alert.resolved ? 'border-green-500' : 
              alert.severity === 'critical' ? 'border-red-500' :
              alert.severity === 'high' ? 'border-orange-500' :
              alert.severity === 'medium' ? 'border-yellow-500' : 'border-blue-500'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    {alert.resolved && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-green-600 bg-green-100">
                        Resolved
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{alert.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Type: {alert.alert_type}</span>
                    <span>Created: {formatDate(alert.created_at)}</span>
                  </div>
                </div>
                {!alert.resolved && (
                  <button
                    onClick={() => handleResolveAlert(alert.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}

          {systemAlerts.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No system alerts</h3>
              <p className="text-gray-500">All systems are running normally.</p>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Notification Modal */}
      {(showCreateModal || editingNotification) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingNotification ? 'Edit Notification' : 'Create New Notification'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingNotification(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter notification title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Enter notification message"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipients
                  </label>
                  <select
                    value={formData.recipient_role}
                    onChange={(e) => setFormData(prev => ({ ...prev, recipient_role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {RECIPIENT_ROLES.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Importance
                  </label>
                  <select
                    value={formData.importance}
                    onChange={(e) => setFormData(prev => ({ ...prev, importance: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {IMPORTANCE_LEVELS.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {NOTIFICATION_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Schedule For (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduled_for}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduled_for: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="email_delivery"
                  checked={formData.email_delivery}
                  onChange={(e) => setFormData(prev => ({ ...prev, email_delivery: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="email_delivery" className="ml-2 text-sm text-gray-700">
                  Send email notification (requires email integration)
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingNotification(null);
                  resetForm();
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={editingNotification ? handleUpdateNotification : handleCreateNotification}
                disabled={!formData.title.trim() || !formData.message.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Save className="h-4 w-4 mr-1" />
                {editingNotification ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
