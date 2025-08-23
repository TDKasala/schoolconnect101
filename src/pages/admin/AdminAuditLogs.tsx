import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { supabase } from '../../lib/supabase';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Calendar,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  Activity
} from 'lucide-react';

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  description: string;
  resource_type: string | null;
  resource_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  device_info: any;
  status: 'success' | 'failure' | 'warning';
  severity: 'info' | 'warning' | 'error' | 'critical';
  metadata: any;
  session_id: string | null;
  created_at: string;
  user_profile?: {
    full_name: string;
    email: string;
  };
}

interface SecurityAlert {
  id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  user_id: string | null;
  ip_address: string | null;
  metadata: any;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  resolved_by: string | null;
  resolved_at: string | null;
  resolution_notes: string | null;
  created_at: string;
  updated_at: string;
  user_profile?: {
    full_name: string;
    email: string;
  };
  resolver_profile?: {
    full_name: string;
    email: string;
  };
}

export const AdminAuditLogs: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'logs' | 'alerts'>('logs');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('7');
  const [actionFilter, setActionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchAuditLogs();
    } else {
      fetchSecurityAlerts();
    }
  }, [activeTab, dateRange, actionFilter, statusFilter, severityFilter]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        if (activeTab === 'logs') {
          fetchAuditLogs();
        } else {
          fetchSecurityAlerts();
        }
      }, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, autoRefresh, dateRange, actionFilter, statusFilter, severityFilter]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('audit_logs')
        .select(`
          *,
          user_profile:user_profiles!audit_logs_user_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(500);

      // Apply date filter
      if (dateRange !== 'all') {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));
        query = query.gte('created_at', daysAgo.toISOString());
      }

      // Apply action filter
      if (actionFilter) {
        query = query.eq('action', actionFilter);
      }

      // Apply status filter
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      // Apply severity filter
      if (severityFilter) {
        query = query.eq('severity', severityFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data || [];

      // Apply search filter
      if (searchTerm) {
        filteredData = filteredData.filter(log => 
          log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.user_profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.user_profile?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.ip_address?.includes(searchTerm)
        );
      }

      setAuditLogs(filteredData);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSecurityAlerts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('security_alerts')
        .select(`
          *,
          user_profile:user_profiles!security_alerts_user_id_fkey(full_name, email),
          resolver_profile:user_profiles!security_alerts_resolved_by_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(200);

      // Apply date filter
      if (dateRange !== 'all') {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));
        query = query.gte('created_at', daysAgo.toISOString());
      }

      // Apply status filter (for alerts)
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      // Apply severity filter
      if (severityFilter) {
        query = query.eq('severity', severityFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data || [];

      // Apply search filter
      if (searchTerm) {
        filteredData = filteredData.filter(alert => 
          alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.alert_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.user_profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alert.ip_address?.includes(searchTerm)
        );
      }

      setSecurityAlerts(filteredData);
    } catch (err) {
      console.error('Error fetching security alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId: string, resolution: string) => {
    try {
      const { error } = await supabase
        .from('security_alerts')
        .update({
          status: 'resolved',
          resolved_by: user?.id,
          resolved_at: new Date().toISOString(),
          resolution_notes: resolution
        })
        .eq('id', alertId);

      if (error) throw error;

      fetchSecurityAlerts();
    } catch (err) {
      console.error('Error resolving alert:', err);
    }
  };

  const exportLogs = async (format: 'csv' | 'json') => {
    try {
      const dataToExport = activeTab === 'logs' ? auditLogs : securityAlerts;
      
      if (format === 'csv') {
        const csvContent = activeTab === 'logs' 
          ? generateAuditLogsCsv(dataToExport as AuditLog[])
          : generateSecurityAlertsCsv(dataToExport as SecurityAlert[]);
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeTab}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const jsonContent = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeTab}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error exporting data:', err);
    }
  };

  const generateAuditLogsCsv = (logs: AuditLog[]): string => {
    const headers = ['Timestamp', 'User', 'Action', 'Description', 'Status', 'Severity', 'IP Address', 'Resource Type', 'Resource ID'];
    const rows = logs.map(log => [
      new Date(log.created_at).toLocaleString(),
      log.user_profile?.full_name || 'System',
      log.action,
      log.description,
      log.status,
      log.severity,
      log.ip_address || '',
      log.resource_type || '',
      log.resource_id || ''
    ]);
    
    return [headers, ...rows].map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  };

  const generateSecurityAlertsCsv = (alerts: SecurityAlert[]): string => {
    const headers = ['Timestamp', 'Alert Type', 'Severity', 'Title', 'Description', 'Status', 'User', 'IP Address', 'Resolved By', 'Resolved At'];
    const rows = alerts.map(alert => [
      new Date(alert.created_at).toLocaleString(),
      alert.alert_type,
      alert.severity,
      alert.title,
      alert.description,
      alert.status,
      alert.user_profile?.full_name || '',
      alert.ip_address || '',
      alert.resolver_profile?.full_name || '',
      alert.resolved_at ? new Date(alert.resolved_at).toLocaleString() : ''
    ]);
    
    return [headers, ...rows].map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failure': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'active': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'investigating': return <Eye className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'info': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
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
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs & Security</h1>
          <p className="text-gray-600">Monitor system activity and security events</p>
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
            <Activity className="h-4 w-4 mr-2" />
            Auto Refresh
          </button>
          <button
            onClick={() => activeTab === 'logs' ? fetchAuditLogs() : fetchSecurityAlerts()}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => exportLogs('csv')}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
            <button
              onClick={() => exportLogs('json')}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'logs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Audit Logs ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'alerts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Shield className="h-4 w-4 inline mr-2" />
            Security Alerts ({securityAlerts.filter(a => a.status === 'active').length})
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search logs..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Last 24 hours</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>

          {activeTab === 'logs' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All actions</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="create_user">Create User</option>
                <option value="update_role">Update Role</option>
                <option value="update_setting">Update Setting</option>
                <option value="create_notification">Create Notification</option>
                <option value="export_data">Export Data</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {activeTab === 'logs' ? (
                <>
                  <option value="">All statuses</option>
                  <option value="success">Success</option>
                  <option value="failure">Failure</option>
                  <option value="warning">Warning</option>
                </>
              ) : (
                <>
                  <option value="">All statuses</option>
                  <option value="active">Active</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="false_positive">False Positive</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="error">Error</option>
              <option value="medium">Medium</option>
              <option value="warning">Warning</option>
              <option value="low">Low</option>
              <option value="info">Info</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setDateRange('7');
                setActionFilter('');
                setStatusFilter('');
                setSeverityFilter('');
              }}
              className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 inline mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Loading {activeTab}...</p>
          </div>
        ) : activeTab === 'logs' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {log.user_profile?.full_name || 'System'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {log.user_profile?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {log.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(log.status)}
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(log.severity)}`}>
                          {log.severity}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.ip_address || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {auditLogs.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No audit logs found for the selected criteria.
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 p-6">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
                alert.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(alert.status)}
                      <h3 className="text-lg font-medium text-gray-900">{alert.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        alert.status === 'active' ? 'bg-red-100 text-red-800' :
                        alert.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        alert.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Type: {alert.alert_type}</span>
                      <span>Created: {formatDate(alert.created_at)}</span>
                      {alert.ip_address && <span>IP: {alert.ip_address}</span>}
                      {alert.user_profile && (
                        <span>User: {alert.user_profile.full_name}</span>
                      )}
                    </div>
                    {alert.resolved_at && (
                      <div className="mt-2 text-sm text-gray-600">
                        <strong>Resolved:</strong> {formatDate(alert.resolved_at)} by {alert.resolver_profile?.full_name}
                        {alert.resolution_notes && (
                          <div className="mt-1">
                            <strong>Notes:</strong> {alert.resolution_notes}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {alert.status === 'active' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => resolveAlert(alert.id, 'Manually resolved by admin')}
                        className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                      >
                        Resolve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {securityAlerts.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No security alerts found for the selected criteria.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
