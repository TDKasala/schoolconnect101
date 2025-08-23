import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Users, 
  School, 
  UserCheck, 
  Activity,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface Stats {
  totalSchools: number;
  totalUsers: number;
  usersByRole: {
    platform_admin: number;
    school_admin: number;
    teacher: number;
    parent: number;
  };
  pendingSchools: number;
  activeUsersToday: number;
}

export const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalSchools: 0,
    totalUsers: 0,
    usersByRole: {
      platform_admin: 0,
      school_admin: 0,
      teacher: 0,
      parent: 0
    },
    pendingSchools: 0,
    activeUsersToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch total schools
      const { count: schoolCount } = await supabase
        .from('schools')
        .select('*', { count: 'exact', head: true });

      // Fetch pending schools
      const { count: pendingSchoolCount } = await supabase
        .from('schools')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch total users
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Fetch users by role
      const { data: usersData } = await supabase
        .from('users')
        .select('role');

      // Count users by role
      const usersByRole = {
        platform_admin: 0,
        school_admin: 0,
        teacher: 0,
        parent: 0
      };

      usersData?.forEach(user => {
        if (user.role in usersByRole) {
          usersByRole[user.role as keyof typeof usersByRole]++;
        }
      });

      // For now, set active users today to a percentage of total users
      // In a real app, you'd track login activity
      const activeUsersToday = Math.floor((userCount || 0) * 0.3);

      setStats({
        totalSchools: schoolCount || 0,
        totalUsers: userCount || 0,
        usersByRole,
        pendingSchools: pendingSchoolCount || 0,
        activeUsersToday
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h1>
          <p className="text-gray-600 mt-1">Statistiques de la plateforme SchoolConnect</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h1>
        <p className="text-gray-600 mt-1">Statistiques de la plateforme SchoolConnect</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Écoles enregistrées"
          value={stats.totalSchools}
          icon={School}
          color="bg-blue-500"
          subtitle={`${stats.pendingSchools} en attente`}
        />
        
        <StatCard
          title="Utilisateurs totaux"
          value={stats.totalUsers}
          icon={Users}
          color="bg-green-500"
        />
        
        <StatCard
          title="Écoles en attente"
          value={stats.pendingSchools}
          icon={AlertCircle}
          color="bg-yellow-500"
        />
        
        <StatCard
          title="Utilisateurs actifs"
          value={stats.activeUsersToday}
          icon={Activity}
          color="bg-purple-500"
          subtitle="Aujourd'hui"
        />
      </div>

      {/* Users by Role */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisateurs par rôle</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.usersByRole.platform_admin}</div>
            <div className="text-sm text-gray-600 mt-1">Admins Plateforme</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.usersByRole.school_admin}</div>
            <div className="text-sm text-gray-600 mt-1">Admins École</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.usersByRole.teacher}</div>
            <div className="text-sm text-gray-600 mt-1">Enseignants</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{stats.usersByRole.parent}</div>
            <div className="text-sm text-gray-600 mt-1">Parents</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
            <School className="w-5 h-5 text-blue-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-blue-900">Gérer les écoles</div>
              <div className="text-sm text-blue-600">Approuver les nouvelles écoles</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
            <Users className="w-5 h-5 text-green-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-green-900">Gérer les utilisateurs</div>
              <div className="text-sm text-green-600">Voir tous les utilisateurs</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
            <Clock className="w-5 h-5 text-purple-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-purple-900">Messages</div>
              <div className="text-sm text-purple-600">Voir les messages de contact</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <div>
              <div className="text-sm font-medium text-gray-900">Nouvelle école approuvée</div>
              <div className="text-xs text-gray-500">Il y a 2 heures</div>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <UserCheck className="w-5 h-5 text-blue-500 mr-3" />
            <div>
              <div className="text-sm font-medium text-gray-900">Nouvel utilisateur enregistré</div>
              <div className="text-xs text-gray-500">Il y a 4 heures</div>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-purple-500 mr-3" />
            <div>
              <div className="text-sm font-medium text-gray-900">Mise à jour système</div>
              <div className="text-xs text-gray-500">Hier</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
