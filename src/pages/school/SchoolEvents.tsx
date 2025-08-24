import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { supabase } from '../../lib/supabase';
import { Calendar, Plus, Search, Clock, MapPin, Users, AlertTriangle, CheckCircle } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  event_type: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  max_participants?: number;
  current_participants?: number;
  is_public: boolean;
  created_at: string;
}

interface EventStats {
  total_events: number;
  upcoming_events: number;
  ongoing_events: number;
  completed_events: number;
}

export const SchoolEvents: React.FC = () => {
  const { profile } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [eventStats, setEventStats] = useState<EventStats>({
    total_events: 0,
    upcoming_events: 0,
    ongoing_events: 0,
    completed_events: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, [profile?.school_id]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!profile?.school_id) {
        throw new Error('No school ID found');
      }

      // Fetch events for the school
      const { data: eventsData, error: eventsError } = await supabase
        .from('events' as any)
        .select('*')
        .eq('school_id', profile.school_id)
        .order('event_date', { ascending: true });

      if (eventsError) throw eventsError;

      setEvents((eventsData as Event[]) || []);

      // Calculate event statistics
      if (eventsData && eventsData.length > 0) {
        const stats = (eventsData as Event[]).reduce((acc, event) => {
          acc.total_events += 1;
          
          const eventDate = new Date(event.event_date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          eventDate.setHours(0, 0, 0, 0);

          if (event.status === 'upcoming' || (eventDate > today && event.status !== 'cancelled')) {
            acc.upcoming_events += 1;
          } else if (event.status === 'ongoing' || (eventDate.getTime() === today.getTime() && event.status !== 'cancelled')) {
            acc.ongoing_events += 1;
          } else if (event.status === 'completed' || (eventDate < today && event.status !== 'cancelled')) {
            acc.completed_events += 1;
          }

          return acc;
        }, {
          total_events: 0,
          upcoming_events: 0,
          ongoing_events: 0,
          completed_events: 0
        });

        setEventStats(stats);
      }

    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Erreur lors du chargement des événements');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesType = typeFilter === 'all' || event.event_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'ongoing': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-gray-600" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatEventTime = (startTime?: string, endTime?: string) => {
    if (!startTime) return '';
    const start = startTime.slice(0, 5); // HH:MM format
    const end = endTime ? endTime.slice(0, 5) : '';
    return end ? `${start} - ${end}` : start;
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
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Événements</h1>
            <p className="text-gray-600">Gérer les événements scolaires, activités et calendrier</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter Événement
          </button>
        </div>
      </div>

      {/* Event Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Événements</p>
              <p className="text-2xl font-semibold text-gray-900">{eventStats.total_events}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">À Venir</p>
              <p className="text-2xl font-semibold text-gray-900">{eventStats.upcoming_events}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">En Cours</p>
              <p className="text-2xl font-semibold text-gray-900">{eventStats.ongoing_events}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Terminés</p>
              <p className="text-2xl font-semibold text-gray-900">{eventStats.completed_events}</p>
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
                  placeholder="Rechercher événements..."
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
                <option value="all">Tous les Statuts</option>
                <option value="upcoming">À Venir</option>
                <option value="ongoing">En Cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tous les Types</option>
                <option value="academic">Académique</option>
                <option value="sports">Sports</option>
                <option value="cultural">Culturel</option>
                <option value="meeting">Réunion</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {filteredEvents.length} sur {events.length} événements
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {events.length === 0 ? 'Aucun Événement Trouvé' : 'Aucun Événement Correspondant'}
              </h3>
              <p className="text-gray-600 mb-4">
                {events.length === 0 
                  ? 'Commencez par créer votre premier événement.'
                  : 'Essayez d\'ajuster vos critères de recherche ou filtres.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {event.title}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(event.status)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {event.event_type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {event.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(event.event_date).toLocaleDateString()}</span>
                      {formatEventTime(event.start_time, event.end_time) && (
                        <>
                          <Clock className="h-4 w-4 ml-3 mr-1" />
                          <span>{formatEventTime(event.start_time, event.end_time)}</span>
                        </>
                      )}
                    </div>

                    {event.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                    )}

                    {event.max_participants && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>
                          {event.current_participants || 0} / {event.max_participants} participants
                        </span>
                        <div className="ml-2 flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(((event.current_participants || 0) / event.max_participants) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{event.is_public ? 'Événement Public' : 'Événement Privé'}</span>
                        <span>Créé: {new Date(event.created_at).toLocaleDateString()}</span>
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
