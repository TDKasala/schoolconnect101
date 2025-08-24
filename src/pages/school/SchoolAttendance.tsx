import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../lib/supabase';
import { Calendar, Plus, Search, Users, CheckCircle, XCircle, Clock, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { AttendanceModal } from '../../components/school/AttendanceModal';

interface AttendanceRecord {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  created_at: string;
  // Joined data
  student?: {
    first_name: string;
    last_name: string;
    student_number: string;
  };
  class?: {
    class_name: string;
    grade_level: string;
  };
}

interface AttendanceSummary {
  date: string;
  total_students: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendance_rate: number;
}

export const SchoolAttendance: React.FC = () => {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>();

  useEffect(() => {
    fetchAttendanceData();
  }, [profile?.school_id, selectedDate]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!profile?.school_id) {
        throw new Error('No school ID found');
      }

      // Fetch attendance records for selected date
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance' as any)
        .select(`
          *,
          student:students(first_name, last_name, student_number),
          class:classes(class_name, class_level)
        `)
        .eq('attendance_date', selectedDate)
        .in('class_id', 
          await supabase
            .from('classes' as any)
            .select('id')
            .eq('school_id', profile.school_id)
            .then(({ data }) => data?.map(c => c.id) || [])
        )
        .order('created_at', { ascending: false });

      if (attendanceError) throw attendanceError;

      setAttendanceRecords((attendanceData as unknown as AttendanceRecord[]) || []);

      // Fetch attendance summary for the last 7 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 6);

      const { data: summaryData, error: summaryError } = await supabase
        .rpc('get_attendance_summary', {
          school_id_param: profile.school_id,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        });

      if (summaryError) {
        console.warn('Could not fetch attendance summary:', summaryError);
        // Generate summary from current data if RPC doesn't exist
        generateAttendanceSummary();
      } else {
        setAttendanceSummary(summaryData || []);
      }

    } catch (err) {
      console.error('Error fetching attendance data:', err);
      setError('Erreur lors du chargement des données de présence');
    } finally {
      setLoading(false);
    }
  };

  const generateAttendanceSummary = () => {
    // Simple summary generation for current date
    const totalStudents = attendanceRecords.length;
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const absent = attendanceRecords.filter(r => r.status === 'absent').length;
    const late = attendanceRecords.filter(r => r.status === 'late').length;
    const excused = attendanceRecords.filter(r => r.status === 'excused').length;

    const summary: AttendanceSummary = {
      date: selectedDate,
      total_students: totalStudents,
      present,
      absent,
      late,
      excused,
      attendance_rate: totalStudents > 0 ? (present / totalStudents) * 100 : 0
    };

    setAttendanceSummary([summary]);
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = 
      record.student?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.student?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.student?.student_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = classFilter === 'all' || record.class_id === classFilter;
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'excused': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'excused': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const todaySummary = attendanceSummary.find(s => s.date === selectedDate) || {
    date: selectedDate,
    total_students: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    attendance_rate: 0
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Présences</h1>
            <p className="text-gray-600">Suivre et gérer les présences des étudiants</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Marquer Présences
          </button>
        </div>
      </div>

      {/* Attendance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Étudiants</p>
              <p className="text-2xl font-semibold text-gray-900">{todaySummary.total_students}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Présents</p>
              <p className="text-2xl font-semibold text-gray-900">{todaySummary.present}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Absents</p>
              <p className="text-2xl font-semibold text-gray-900">{todaySummary.absent}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-green-800">
                  {Math.round(todaySummary.attendance_rate)}%
                </span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Taux de Présence</p>
              <p className="text-2xl font-semibold text-gray-900">{Math.round(todaySummary.attendance_rate)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students..."
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
                <option value="all">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {filteredRecords.length} of {attendanceRecords.length} records
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {attendanceRecords.length === 0 ? 'No Attendance Records' : 'No Matching Records'}
              </h3>
              <p className="text-gray-600 mb-4">
                {attendanceRecords.length === 0 
                  ? 'No attendance has been recorded for this date.'
                  : 'Try adjusting your search criteria or filters.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-green-800">
                                {record.student?.first_name.charAt(0)}{record.student?.last_name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {record.student?.first_name} {record.student?.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {record.student?.student_number}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {record.class?.class_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.class?.grade_level}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(record.status)}
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {record.notes || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.created_at).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => {
          fetchAttendanceData();
          setIsModalOpen(false);
        }}
        selectedDate={selectedDate}
        selectedClassId={selectedClassId}
      />
    </div>
  );
};
