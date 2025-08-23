import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  UserPlus, 
  Clock, 
  AlertTriangle,
  Download,
  Calendar,
  Filter,
  Loader2,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  newSignups: number;
  pendingApprovals: number;
  roleDistribution: { [key: string]: number };
  recentActivity: ActivityItem[];
  userGrowth: { date: string; count: number }[];
}

interface ActivityItem {
  id: string;
  type: 'login' | 'signup' | 'role_change' | 'approval';
  user_email: string;
  user_name: string;
  timestamp: string;
  details?: string;
}

interface DateRange {
  label: string;
  value: string;
  days: number;
}

const DATE_RANGES: DateRange[] = [
  { label: '7 Days', value: '7d', days: 7 },
  { label: '30 Days', value: '30d', days: 30 },
  { label: '90 Days', value: '90d', days: 90 },
  { label: 'Custom', value: 'custom', days: 0 }
];

const ROLE_COLORS = {
  platform_admin: '#EF4444',
  school_admin: '#3B82F6', 
  teacher: '#10B981',
  parent: '#F59E0B'
};

export const AdminAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    newSignups: 0,
    pendingApprovals: 0,
    roleDistribution: {},
    recentActivity: [],
    userGrowth: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<string>('30d');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedRange, customStartDate, customEndDate]);

  const getDateRange = () => {
    const endDate = new Date();
    let startDate = new Date();

    if (selectedRange === 'custom') {
      if (customStartDate && customEndDate) {
        startDate = new Date(customStartDate);
        endDate.setTime(new Date(customEndDate).getTime());
      } else {
        startDate.setDate(endDate.getDate() - 30);
      }
    } else {
      const range = DATE_RANGES.find(r => r.value === selectedRange);
      startDate.setDate(endDate.getDate() - (range?.days || 30));
    }

    return { startDate, endDate };
  };

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { startDate, endDate } = getDateRange();
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();

      // Fetch all users
      const { data: allUsers, error: usersError } = await supabase
        .from('users')
        .select('*');

      if (usersError) throw usersError;

      // Calculate basic metrics
      const totalUsers = allUsers?.length || 0;
      const pendingApprovals = allUsers?.filter(user => !user.approved).length || 0;
      
      // Active users (logged in within last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const activeUsers = allUsers?.filter(user => 
        user.last_login && new Date(user.last_login) > sevenDaysAgo
      ).length || 0;

      // New signups in selected period
      const newSignups = allUsers?.filter(user => 
        new Date(user.created_at) >= startDate && new Date(user.created_at) <= endDate
      ).length || 0;

      // Role distribution
      const roleDistribution: { [key: string]: number } = {};
      allUsers?.forEach(user => {
        roleDistribution[user.role] = (roleDistribution[user.role] || 0) + 1;
      });

      // User growth data for chart
      const userGrowth = generateUserGrowthData(allUsers || [], startDate, endDate);

      // Recent activity (mock data - in real app, this would come from activity logs)
      const recentActivity = generateRecentActivity(allUsers || []);

      setAnalyticsData({
        totalUsers,
        activeUsers,
        newSignups,
        pendingApprovals,
        roleDistribution,
        recentActivity,
        userGrowth
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const generateUserGrowthData = (users: any[], startDate: Date, endDate: Date) => {
    const data: { date: string; count: number }[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = users.filter(user => 
        new Date(user.created_at).toDateString() === currentDate.toDateString()
      ).length;
      
      data.push({ date: dateStr, count });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  };

  const generateRecentActivity = (users: any[]): ActivityItem[] => {
    const activities: ActivityItem[] = [];
    
    // Recent signups
    users
      .filter(user => {
        const createdDate = new Date(user.created_at);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return createdDate > threeDaysAgo;
      })
      .slice(0, 5)
      .forEach(user => {
        activities.push({
          id: `signup-${user.id}`,
          type: 'signup',
          user_email: user.email,
          user_name: user.full_name || 'Unknown',
          timestamp: user.created_at,
          details: `Registered as ${user.role}`
        });
      });

    // Recent logins
    users
      .filter(user => user.last_login)
      .sort((a, b) => new Date(b.last_login).getTime() - new Date(a.last_login).getTime())
      .slice(0, 5)
      .forEach(user => {
        activities.push({
          id: `login-${user.id}`,
          type: 'login',
          user_email: user.email,
          user_name: user.full_name || 'Unknown',
          timestamp: user.last_login,
          details: `Last login`
        });
      });

    return activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 10);
  };

  const exportToCSV = async () => {
    try {
      setExporting(true);
      
      const { data: users } = await supabase
        .from('users')
        .select('*');

      if (!users) return;

      const csvContent = [
        ['Email', 'Full Name', 'Role', 'Approved', 'Created At', 'Last Login'].join(','),
        ...users.map(user => [
          user.email,
          user.full_name || '',
          user.role,
          user.approved ? 'Yes' : 'No',
          user.created_at,
          user.last_login || ''
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = async () => {
    try {
      setExporting(true);
      // In a real app, you'd use a library like jsPDF
      alert('PDF export would be implemented with jsPDF library');
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'signup': return <UserPlus className="h-4 w-4 text-green-600" />;
      case 'login': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'approval': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'role_change': return <Users className="h-4 w-4 text-orange-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
          <p className="text-gray-600">Platform performance and user insights</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Date Range Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {DATE_RANGES.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Date Range */}
          {selectedRange === 'custom' && (
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              />
            </div>
          )}

          {/* Export Buttons */}
          <button
            onClick={exportToCSV}
            disabled={exporting}
            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm flex items-center disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-1" />
            CSV
          </button>
          <button
            onClick={exportToPDF}
            disabled={exporting}
            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm flex items-center disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-1" />
            PDF
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-2 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">All time</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.activeUsers}</p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-2 flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">Last 7 days</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Signups</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.newSignups}</p>
            </div>
            <UserPlus className="h-8 w-8 text-purple-600" />
          </div>
          <div className="mt-2 flex items-center">
            <Calendar className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">Selected period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.pendingApprovals}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
          <div className="mt-2 flex items-center">
            {analyticsData.pendingApprovals > 0 ? (
              <XCircle className="h-4 w-4 text-orange-500 mr-1" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            )}
            <span className="text-sm text-gray-600">Requires attention</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Role Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Distribution</h3>
          <div className="space-y-4">
            {Object.entries(analyticsData.roleDistribution).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded mr-3"
                    style={{ backgroundColor: ROLE_COLORS[role as keyof typeof ROLE_COLORS] || '#6B7280' }}
                  />
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {role.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-bold text-gray-900 mr-2">{count}</span>
                  <span className="text-xs text-gray-500">
                    ({((count / analyticsData.totalUsers) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Growth Chart (Simple visualization) */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <div className="h-48 flex items-end justify-between space-x-1">
            {analyticsData.userGrowth.slice(-14).map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-blue-500 rounded-t w-full min-h-[4px]"
                  style={{ 
                    height: `${Math.max((data.count / Math.max(...analyticsData.userGrowth.map(d => d.count))) * 100, 4)}%` 
                  }}
                />
                <span className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-left">
                  {new Date(data.date).getDate()}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Daily new signups (last 14 days)</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {analyticsData.recentActivity.length > 0 ? (
            analyticsData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  {getActivityIcon(activity.type)}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user_name} ({activity.user_email})
                    </p>
                    <p className="text-xs text-gray-500">{activity.details}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(activity.timestamp)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};
