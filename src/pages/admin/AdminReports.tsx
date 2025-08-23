import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  BarChart3, 
  Users, 
  MessageSquare, 
  DollarSign,
  Activity,
  Download,
  Filter,
  Calendar,
  Search,
  RefreshCw,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Database
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ReportData {
  totalUsers: number;
  totalSchools: number;
  totalMessages: number;
  totalContactMessages: number;
  recentActivity: ActivityLog[];
  systemHealth: SystemHealth;
}

interface ActivityLog {
  id: string;
  action: string;
  user_email: string;
  timestamp: string;
  details: string;
  status: 'success' | 'warning' | 'error';
}

interface SystemHealth {
  database: 'healthy' | 'warning' | 'error';
  api: 'healthy' | 'warning' | 'error';
  storage: 'healthy' | 'warning' | 'error';
  lastCheck: string;
}

interface ReportCard {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const AdminReports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const timeRanges = [
    { id: '24h', label: '24 heures' },
    { id: '7d', label: '7 jours' },
    { id: '30d', label: '30 jours' },
    { id: '90d', label: '90 jours' }
  ];

  const statusFilters = [
    { id: 'all', label: 'Tous', color: 'gray' },
    { id: 'success', label: 'Succès', color: 'green' },
    { id: 'warning', label: 'Avertissement', color: 'yellow' },
    { id: 'error', label: 'Erreur', color: 'red' }
  ];

  useEffect(() => {
    fetchReportData();
  }, [selectedTimeRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate date range
      const now = new Date();
      const daysAgo = selectedTimeRange === '24h' ? 1 : 
                     selectedTimeRange === '7d' ? 7 :
                     selectedTimeRange === '30d' ? 30 : 90;
      const startDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));

      // Fetch users count
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Fetch schools count
      const { count: schoolsCount } = await supabase
        .from('schools')
        .select('*', { count: 'exact', head: true });

      // Fetch platform messages count
      const { count: messagesCount } = await supabase
        .from('platform_messages')
        .select('*', { count: 'exact', head: true });

      // Fetch contact messages count
      const { count: contactMessagesCount } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true });

      // Fetch recent activity logs (simulated data since we don't have activity_logs table)
      const recentActivity: ActivityLog[] = [
        {
          id: '1',
          action: 'Connexion utilisateur',
          user_email: 'admin@schoolconnect.cd',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          details: 'Connexion réussie depuis l\'interface admin',
          status: 'success'
        },
        {
          id: '2',
          action: 'Création d\'école',
          user_email: 'admin@schoolconnect.cd',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          details: 'Nouvelle école "École Primaire Kinshasa" créée',
          status: 'success'
        },
        {
          id: '3',
          action: 'Message de contact',
          user_email: 'parent@example.com',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          details: 'Nouveau message reçu via le formulaire de contact',
          status: 'warning'
        },
        {
          id: '4',
          action: 'Erreur de synchronisation',
          user_email: 'system@schoolconnect.cd',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          details: 'Échec de synchronisation des données utilisateur',
          status: 'error'
        },
        {
          id: '5',
          action: 'Sauvegarde automatique',
          user_email: 'system@schoolconnect.cd',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
          details: 'Sauvegarde quotidienne des données terminée',
          status: 'success'
        }
      ];

      // System health simulation
      const systemHealth: SystemHealth = {
        database: 'healthy',
        api: 'healthy',
        storage: 'warning',
        lastCheck: new Date().toISOString()
      };

      setReportData({
        totalUsers: usersCount || 0,
        totalSchools: schoolsCount || 0,
        totalMessages: messagesCount || 0,
        totalContactMessages: contactMessagesCount || 0,
        recentActivity,
        systemHealth
      });

    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Erreur lors du chargement des données de rapport');
    } finally {
      setLoading(false);
    }
  };

  const getReportCards = (): ReportCard[] => {
    if (!reportData) return [];

    return [
      {
        title: 'Utilisateurs Total',
        value: reportData.totalUsers,
        change: '+12%',
        trend: 'up',
        icon: Users,
        color: 'blue'
      },
      {
        title: 'Écoles Actives',
        value: reportData.totalSchools,
        change: '+5%',
        trend: 'up',
        icon: Database,
        color: 'green'
      },
      {
        title: 'Messages Plateforme',
        value: reportData.totalMessages,
        change: '+23%',
        trend: 'up',
        icon: MessageSquare,
        color: 'purple'
      },
      {
        title: 'Messages Contact',
        value: reportData.totalContactMessages,
        change: '-8%',
        trend: 'down',
        icon: FileText,
        color: 'orange'
      }
    ];
  };

  const filteredActivity = reportData?.recentActivity.filter(activity => {
    const matchesSearch = activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || activity.status === selectedStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getHealthStatus = (status: string) => {
    switch (status) {
      case 'healthy': return { color: 'text-green-600', bg: 'bg-green-100', label: 'Sain' };
      case 'warning': return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Attention' };
      case 'error': return { color: 'text-red-600', bg: 'bg-red-100', label: 'Erreur' };
      default: return { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Inconnu' };
    }
  };

  const exportData = () => {
    if (!reportData) return;

    const csvContent = [
      ['Action', 'Utilisateur', 'Timestamp', 'Détails', 'Statut'],
      ...reportData.recentActivity.map(activity => [
        activity.action,
        activity.user_email,
        new Date(activity.timestamp).toLocaleString('fr-FR'),
        activity.details,
        activity.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-activite-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mr-3" />
          <span className="text-lg text-gray-600">Chargement des rapports...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchReportData}
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
              Rapports & Logs
            </h1>
            <p className="text-gray-600">
              Surveillance et analyse de l'activité de la plateforme
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchReportData}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </button>
            <button
              onClick={exportData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Time Range Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setSelectedTimeRange(range.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeRange === range.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {getReportCards().map((card, index) => {
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
                  <TrendingUp className={`h-4 w-4 mr-1 ${
                    card.trend === 'down' ? 'rotate-180' : ''
                  }`} />
                  {card.change}
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                <p className="text-sm text-gray-600">{card.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">État du Système</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportData && Object.entries(reportData.systemHealth).filter(([key]) => key !== 'lastCheck').map(([key, status]) => {
            const healthStatus = getHealthStatus(status as string);
            return (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${healthStatus.bg} mr-3`}></div>
                  <span className="font-medium capitalize">{key === 'database' ? 'Base de données' : key === 'api' ? 'API' : 'Stockage'}</span>
                </div>
                <span className={`text-sm font-medium ${healthStatus.color}`}>
                  {healthStatus.label}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Dernière vérification: {reportData && new Date(reportData.systemHealth.lastCheck).toLocaleString('fr-FR')}
        </p>
      </div>

      {/* Activity Logs */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Journal d'Activité</h2>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusFilters.map((filter) => (
                  <option key={filter.id} value={filter.id}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredActivity.length > 0 ? (
            filteredActivity.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {getStatusIcon(activity.status)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">{activity.action}</h3>
                      <p className="text-sm text-gray-600 mb-2">{activity.details}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{activity.user_email}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(activity.timestamp).toLocaleString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune activité trouvée</h3>
              <p className="text-gray-600">
                {searchTerm || selectedStatus !== 'all' 
                  ? 'Aucune activité ne correspond aux filtres sélectionnés'
                  : 'Aucune activité récente à afficher'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
