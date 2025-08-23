import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  School, 
  MessageSquare,
  Mail,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  BarChart3,
  Database
} from 'lucide-react';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalUsers: number;
  totalSchools: number;
  totalMessages: number;
  totalContactMessages: number;
  newUsersToday: number;
  pendingApprovals: number;
  systemHealth: 'healthy' | 'warning' | 'error';
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: string;
  type: 'user_registration' | 'school_created' | 'message_sent' | 'contact_received';
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

interface StatCard {
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

export const AdminOverview: React.FC = () => {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
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

      // Fetch users count
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Fetch schools count
      const { count: schoolsCount } = await supabase
        .from('schools')
        .select('*', { count: 'exact', head: true });

      // Simulate platform messages count (table doesn't exist yet)
      const messagesCount = 15;

      // Simulate contact messages count (table doesn't exist yet)
      const contactMessagesCount = 8;

      // Fetch users created today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: newUsersToday } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Fetch pending approvals
      const { count: pendingApprovals } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('approved', false);

      // Generate recent activity (simulated for now)
      const recentActivity: ActivityItem[] = [
        {
          id: '1',
          type: 'user_registration',
          description: 'Nouvel utilisateur inscrit: teacher@example.com',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          status: 'success'
        },
        {
          id: '2',
          type: 'contact_received',
          description: 'Nouveau message de contact reçu',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          status: 'warning'
        },
        {
          id: '3',
          type: 'school_created',
          description: 'École "Lycée de Kinshasa" créée',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          status: 'success'
        },
        {
          id: '4',
          type: 'message_sent',
          description: 'Message plateforme envoyé à tous les utilisateurs',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          status: 'success'
        }
      ];

      setStats({
        totalUsers: usersCount || 0,
        totalSchools: schoolsCount || 0,
        totalMessages: messagesCount,
        totalContactMessages: contactMessagesCount,
        newUsersToday: newUsersToday || 0,
        pendingApprovals: pendingApprovals || 0,
        systemHealth: 'healthy',
        recentActivity
      });

      setLastUpdated(new Date());

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const getStatCards = (): StatCard[] => {
    if (!stats) return [];

    return [
      {
        title: 'Utilisateurs Total',
        value: stats.totalUsers,
        change: 12,
        trend: 'up',
        icon: Users,
        color: 'blue',
        description: `+${stats.newUsersToday} aujourd'hui`
      },
      {
        title: 'Écoles Actives',
        value: stats.totalSchools,
        change: 5,
        trend: 'up',
        icon: School,
        color: 'green',
        description: 'Établissements enregistrés'
      },
      {
        title: 'Messages Plateforme',
        value: stats.totalMessages,
        change: 23,
        trend: 'up',
        icon: MessageSquare,
        color: 'purple',
        description: 'Communications internes'
      },
      {
        title: 'Messages Contact',
        value: stats.totalContactMessages,
        change: -8,
        trend: 'down',
        icon: Mail,
        color: 'orange',
        description: 'Support et demandes'
      }
    ];
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return <Users className="h-4 w-4 text-blue-500" />;
      case 'school_created': return <School className="h-4 w-4 text-green-500" />;
      case 'message_sent': return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'contact_received': return <Mail className="h-4 w-4 text-orange-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mr-3" />
          <span className="text-lg text-gray-600">Chargement du tableau de bord...</span>
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
            onClick={fetchDashboardStats}
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
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              Dashboard Overview
            </h1>
            <p className="text-gray-600">
              Bienvenue sur le tableau de bord administrateur SchoolConnect
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              Dernière mise à jour: {lastUpdated.toLocaleTimeString('fr-FR')}
            </div>
            <button
              onClick={fetchDashboardStats}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* System Health Alert */}
      {stats && stats.pendingApprovals > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Approbations en attente
              </h3>
              <p className="text-sm text-yellow-700">
                {stats.pendingApprovals} utilisateur(s) en attente d'approbation
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {getStatCards().map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${card.color}-100`}>
                  <Icon className={`h-6 w-6 text-${card.color}-600`} />
                </div>
                <div className={`flex items-center text-sm ${
                  card.trend === 'up' ? 'text-green-600' : 
                  card.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {card.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : card.trend === 'down' ? (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  ) : null}
                  {card.change > 0 ? '+' : ''}{card.change}%
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-xs text-gray-500">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 text-gray-600 mr-2" />
              Activité Récente
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {stats?.recentActivity.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-1">{activity.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{new Date(activity.timestamp).toLocaleString('fr-FR')}</span>
                      <span className="mx-2">•</span>
                      <div className="flex items-center">
                        {getStatusIcon(activity.status)}
                        <span className="ml-1 capitalize">{activity.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status & User Info */}
        <div className="space-y-6">
          {/* System Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="h-5 w-5 text-gray-600 mr-2" />
              État du Système
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Base de données</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600">Opérationnel</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600">Opérationnel</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Stockage</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-yellow-600">Attention</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current User Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 text-gray-600 mr-2" />
              Informations Administrateur
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{profile?.email || user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Nom</label>
                <p className="text-sm text-gray-900">{profile?.full_name || 'Non défini'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Rôle</label>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {profile?.role || 'Inconnu'}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Statut</label>
                <div className="flex items-center">
                  {profile?.approved ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                  )}
                  <span className="text-sm text-gray-900">
                    {profile?.approved ? 'Approuvé' : 'En attente'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
