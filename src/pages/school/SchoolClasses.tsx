import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { supabase } from '../../lib/supabase';
import { BookOpen, Plus, Search, Filter, Users, Clock, MapPin, AlertTriangle } from 'lucide-react';

interface Class {
  id: string;
  class_name: string;
  grade_level: string;
  section?: string;
  academic_year: string;
  capacity: number;
  room_number?: string;
  schedule?: string;
  status: string;
  teacher_id?: string;
  created_at: string;
  // Joined data
  teacher?: {
    first_name: string;
    last_name: string;
  };
  student_count?: number;
}

export const SchoolClasses: React.FC = () => {
  const { profile } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');

  useEffect(() => {
    fetchClasses();
  }, [profile?.school_id]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!profile?.school_id) {
        throw new Error('No school ID found');
      }

      // Fetch classes with teacher info and student count
      const { data: classesData, error: fetchError } = await supabase
        .from('classes')
        .select(`
          *,
          teacher:teachers(first_name, last_name)
        `)
        .eq('school_id', profile.school_id)
        .order('grade_level', { ascending: true });

      if (fetchError) throw fetchError;

      // Get student counts for each class
      const classesWithCounts = await Promise.all(
        (classesData || []).map(async (classItem) => {
          const { count } = await supabase
            .from('students')
            .select('*', { count: 'exact', head: true })
            .eq('class_id', classItem.id)
            .eq('status', 'active');

          return {
            ...classItem,
            student_count: count || 0
          };
        })
      );

      setClasses(classesWithCounts);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Erreur lors du chargement des classes');
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = 
      classItem.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.grade_level.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (classItem.section && classItem.section.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (classItem.room_number && classItem.room_number.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || classItem.status === statusFilter;
    const matchesGrade = gradeFilter === 'all' || classItem.grade_level === gradeFilter;
    
    return matchesSearch && matchesStatus && matchesGrade;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUniqueGrades = () => {
    const grades = [...new Set(classes.map(c => c.grade_level))];
    return grades.sort();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
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
            <h1 className="text-2xl font-bold text-gray-900">Classes Management</h1>
            <p className="text-gray-600">Manage class schedules, subjects, and assignments</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Class
          </button>
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
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Grades</option>
                {getUniqueGrades().map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {filteredClasses.length} of {classes.length} classes
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {filteredClasses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {classes.length === 0 ? 'No Classes Found' : 'No Matching Classes'}
              </h3>
              <p className="text-gray-600 mb-4">
                {classes.length === 0 
                  ? 'Start by creating your first class.'
                  : 'Try adjusting your search criteria or filters.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((classItem) => (
                <div key={classItem.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {classItem.class_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {classItem.grade_level}
                        {classItem.section && ` - Section ${classItem.section}`}
                      </p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(classItem.status)}`}>
                      {classItem.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{classItem.student_count || 0} / {classItem.capacity} students</span>
                    </div>

                    {classItem.room_number && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>Room {classItem.room_number}</span>
                      </div>
                    )}

                    {classItem.schedule && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{classItem.schedule}</span>
                      </div>
                    )}

                    {classItem.teacher && (
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <span className="text-xs font-medium text-green-800">
                            {classItem.teacher.first_name.charAt(0)}{classItem.teacher.last_name.charAt(0)}
                          </span>
                        </div>
                        <span>{classItem.teacher.first_name} {classItem.teacher.last_name}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Academic Year: {classItem.academic_year}</span>
                        <span>
                          {Math.round(((classItem.student_count || 0) / classItem.capacity) * 100)}% full
                        </span>
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
