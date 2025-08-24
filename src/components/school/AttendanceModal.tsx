import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Users } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/SimpleAuthContext';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  student_number: string;
  class_id?: string;
}

interface Class {
  id: string;
  class_name: string;
  class_level: string;
}

interface AttendanceRecord {
  student_id: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  selectedDate: string;
  selectedClassId?: string;
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  selectedClassId
}) => {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [classId, setClassId] = useState(selectedClassId || '');
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord>>({});
  const [existingAttendance, setExistingAttendance] = useState<Record<string, any>>({});

  useEffect(() => {
    if (isOpen) {
      fetchClasses();
      if (selectedClassId) {
        setClassId(selectedClassId);
      }
    }
  }, [isOpen, selectedClassId, profile?.school_id]);

  useEffect(() => {
    if (classId) {
      fetchStudents();
      fetchExistingAttendance();
    }
  }, [classId, selectedDate]);

  const fetchClasses = async () => {
    try {
      if (!profile?.school_id) return;

      const { data: classesData, error } = await supabase
        .from('classes' as any)
        .select('id, class_name, class_level')
        .eq('school_id', profile.school_id)
        .eq('status', 'active')
        .order('class_level', { ascending: true });

      if (error) throw error;
      setClasses((classesData as unknown as Class[]) || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      if (!profile?.school_id || !classId) return;

      const { data: studentsData, error } = await supabase
        .from('students' as any)
        .select('id, first_name, last_name, student_number, class_id')
        .eq('school_id', profile.school_id)
        .eq('class_id', classId)
        .eq('status', 'active')
        .order('last_name', { ascending: true });

      if (error) throw error;
      
      const studentList = (studentsData as unknown as Student[]) || [];
      setStudents(studentList);

      // Initialize attendance records for all students
      const initialRecords: Record<string, AttendanceRecord> = {};
      studentList.forEach(student => {
        initialRecords[student.id] = {
          student_id: student.id,
          status: 'present',
          notes: ''
        };
      });
      setAttendanceRecords(initialRecords);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchExistingAttendance = async () => {
    try {
      if (!profile?.school_id || !classId || !selectedDate) return;

      const { data: attendanceData, error } = await supabase
        .from('attendance' as any)
        .select('*')
        .eq('school_id', profile.school_id)
        .eq('class_id', classId)
        .eq('attendance_date', selectedDate);

      if (error) throw error;

      const existing: Record<string, any> = {};
      (attendanceData || []).forEach((record: any) => {
        existing[record.student_id] = record;
      });
      setExistingAttendance(existing);

      // Update attendance records with existing data
      setAttendanceRecords(prev => {
        const updated = { ...prev };
        Object.keys(existing).forEach(studentId => {
          if (updated[studentId]) {
            updated[studentId] = {
              student_id: studentId,
              status: existing[studentId].status,
              notes: existing[studentId].notes || ''
            };
          }
        });
        return updated;
      });
    } catch (error) {
      console.error('Error fetching existing attendance:', error);
    }
  };

  const handleAttendanceChange = (studentId: string, field: keyof AttendanceRecord, value: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!profile?.school_id || !classId || !selectedDate) {
        throw new Error('Informations manquantes');
      }

      // Prepare attendance records for submission
      const recordsToSave = Object.values(attendanceRecords).map(record => ({
        school_id: profile.school_id,
        class_id: classId,
        student_id: record.student_id,
        attendance_date: selectedDate,
        status: record.status,
        notes: record.notes || null,
        marked_by: profile.id
      }));

      // Delete existing records for this date and class
      await supabase
        .from('attendance' as any)
        .delete()
        .eq('school_id', profile.school_id)
        .eq('class_id', classId)
        .eq('attendance_date', selectedDate);

      // Insert new records
      const { error } = await supabase
        .from('attendance' as any)
        .insert(recordsToSave);

      if (error) throw error;

      showToast({
        type: 'success',
        title: 'Présence enregistrée',
        message: 'Les présences ont été enregistrées avec succès.'
      });

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving attendance:', error);
      showToast({
        type: 'error',
        title: 'Erreur',
        message: error.message || 'Erreur lors de l\'enregistrement des présences.'
      });
    } finally {
      setLoading(false);
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Présent';
      case 'absent': return 'Absent';
      case 'late': return 'En retard';
      case 'excused': return 'Excusé';
      default: return status;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Marquer les Présences - {new Date(selectedDate).toLocaleDateString('fr-FR')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classe *
            </label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Sélectionner une classe</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name} - {cls.class_level}
                </option>
              ))}
            </select>
          </div>

          {students.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Étudiants ({students.length})
                </h3>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-100 rounded mr-1"></div>
                    <span>Présent</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-100 rounded mr-1"></div>
                    <span>Absent</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-100 rounded mr-1"></div>
                    <span>En retard</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-100 rounded mr-1"></div>
                    <span>Excusé</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                {students.map((student) => (
                  <div key={student.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {student.first_name} {student.last_name}
                          </h4>
                          <p className="text-sm text-gray-500">{student.student_number}</p>
                        </div>
                      </div>
                      {existingAttendance[student.id] && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          Déjà enregistré
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                      {['present', 'absent', 'late', 'excused'].map((status) => (
                        <label key={status} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name={`attendance-${student.id}`}
                            value={status}
                            checked={attendanceRecords[student.id]?.status === status}
                            onChange={(e) => handleAttendanceChange(student.id, 'status', e.target.value)}
                            className="sr-only"
                          />
                          <div className={`flex-1 text-center py-2 px-3 rounded-lg border-2 transition-colors ${
                            attendanceRecords[student.id]?.status === status
                              ? `${getStatusColor(status)} border-current`
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <span className="text-sm font-medium">
                              {getStatusLabel(status)}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Notes (optionnel)
                      </label>
                      <input
                        type="text"
                        value={attendanceRecords[student.id]?.notes || ''}
                        onChange={(e) => handleAttendanceChange(student.id, 'notes', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                        placeholder="Commentaires sur l'absence, retard, etc."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !classId || students.length === 0}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Sauvegarde...' : 'Enregistrer Présences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
