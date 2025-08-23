import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { supabase } from '../../lib/supabase';
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  GraduationCap,
  CreditCard
} from 'lucide-react';

interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  attendanceRate: number;
  pendingPayments: number;
  upcomingEvents: number;
}

export const SchoolDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<SchoolStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchDashboardStats();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!profile?.school_id) {
        throw new Error('No school ID found for user');
      }

      // Fetch students count
      const { count: studentsCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', profile.school_id)
        .eq('status', 'active');

      // Fetch teachers count
      const { count: teachersCount } = await supabase
        .from('teachers')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', profile.school_id)
        .eq('status', 'active');

      // Fetch classes count
      const { count: classesCount } = await supabase
        .from('classes')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', profile.school_id)
        .eq('status', 'active');

      // Fetch today's attendance rate
      const today = new Date().toISOString().split('T')[0];
      const { count: totalAttendanceToday } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', profile.school_id)
        .eq('date', today);

      const { count: presentToday } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', profile.school_id)
        .eq('date', today)
        .eq('status', 'present');

      const attendanceRate = totalAttendanceToday > 0 
        ? Math.round((presentToday || 0) / totalAttendanceToday * 100 * 10) / 10
        : 0;

      // Fetch pending payments count
      const { count: pendingPaymentsCount } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', profile.school_id)
        .eq('status', 'pending');

      // Fetch upcoming events count (next 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const { count: upcomingEventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', profile.school_id)
        .gte('start_date', new Date().toISOString())
        .lte('start_date', thirtyDaysFromNow.toISOString())
        .eq('status', 'scheduled');

      const dashboardStats: SchoolStats = {
        totalStudents: studentsCount || 0,
        totalTeachers: teachersCount || 0,
        totalClasses: classesCount || 0,
        attendanceRate: attendanceRate,
        pendingPayments: pendingPaymentsCount || 0,
        upcomingEvents: upcomingEventsCount || 0
      };

      setStats(dashboardStats);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    trend?: string;
    color: string;
  }> = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="flex items-center">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <span className="ml-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 inline mr-1" />
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading && !stats) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600">
              Welcome back, {profile?.full_name || 'School Admin'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <button
              onClick={fetchDashboardStats}
              disabled={loading}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={Users}
          trend="+5.2%"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Teachers"
          value={stats?.totalTeachers || 0}
          icon={UserCheck}
          trend="+2.1%"
          color="bg-green-500"
        />
        <StatCard
          title="Active Classes"
          value={stats?.totalClasses || 0}
          icon={BookOpen}
          color="bg-purple-500"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats?.attendanceRate || 0}%`}
          icon={CheckCircle}
          trend="+1.5%"
          color="bg-emerald-500"
        />
        <StatCard
          title="Pending Payments"
          value={stats?.pendingPayments || 0}
          icon={CreditCard}
          color="bg-orange-500"
        />
        <StatCard
          title="Upcoming Events"
          value={stats?.upcomingEvents || 0}
          icon={Calendar}
          color="bg-indigo-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">New student enrolled</p>
                  <p className="text-sm text-gray-500">Marie Dubois joined Class 6A</p>
                </div>
                <span className="ml-auto text-xs text-gray-400">2h ago</span>
              </div>
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-full">
                  <GraduationCap className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Grades updated</p>
                  <p className="text-sm text-gray-500">Mathematics exam results published</p>
                </div>
                <span className="ml-auto text-xs text-gray-400">4h ago</span>
              </div>
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Payment reminder</p>
                  <p className="text-sm text-gray-500">23 students have pending payments</p>
                </div>
                <span className="ml-auto text-xs text-gray-400">6h ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Overview</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Today's Attendance</span>
                <span className="text-sm font-medium text-gray-900">92.3%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Teachers</span>
                <span className="text-sm font-medium text-gray-900">16/18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Classes in Session</span>
                <span className="text-sm font-medium text-gray-900">8/12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">This Month's Revenue</span>
                <span className="text-sm font-medium text-green-600">$12,450</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
