import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/SimpleAuthContext';
import { supabase } from '../../lib/supabase';
import { GraduationCap, Plus, Search, Filter, BookOpen, User, Calendar, AlertTriangle, TrendingUp } from 'lucide-react';

interface Grade {
  id: string;
  student_id: string;
  class_id: string;
  subject_id: string;
  grade_value: number;
  grade_letter?: string;
  max_points: number;
  grade_type: string;
  assessment_date: string;
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
  subject?: {
    subject_name: string;
    subject_code: string;
  };
}

interface GradeSummary {
  subject_name: string;
  average_grade: number;
  total_assessments: number;
  passing_rate: number;
}

export const SchoolGrades: React.FC = () => {
  const { profile } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [gradeSummary, setGradeSummary] = useState<GradeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [gradeTypeFilter, setGradeTypeFilter] = useState('all');

  useEffect(() => {
    fetchGrades();
  }, [profile?.school_id]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!profile?.school_id) {
        throw new Error('No school ID found');
      }

      // Fetch grades with related data
      const { data: gradesData, error: gradesError } = await supabase
        .from('grades')
        .select(`
          *,
          student:students(first_name, last_name, student_number),
          class:classes(class_name, grade_level),
          subject:subjects(subject_name, subject_code)
        `)
        .in('class_id', 
          await supabase
            .from('classes')
            .select('id')
            .eq('school_id', profile.school_id)
            .then(({ data }) => data?.map(c => c.id) || [])
        )
        .order('assessment_date', { ascending: false });

      if (gradesError) throw gradesError;

      setGrades(gradesData || []);

      // Generate grade summary by subject
      if (gradesData && gradesData.length > 0) {
        const summaryMap = new Map<string, { total: number; count: number; passing: number }>();
        
        gradesData.forEach(grade => {
          const subjectName = grade.subject?.subject_name || 'Unknown Subject';
          const percentage = (grade.grade_value / grade.max_points) * 100;
          
          if (!summaryMap.has(subjectName)) {
            summaryMap.set(subjectName, { total: 0, count: 0, passing: 0 });
          }
          
          const summary = summaryMap.get(subjectName)!;
          summary.total += percentage;
          summary.count += 1;
          if (percentage >= 60) summary.passing += 1; // Assuming 60% is passing
        });

        const summaryArray: GradeSummary[] = Array.from(summaryMap.entries()).map(([subject, data]) => ({
          subject_name: subject,
          average_grade: data.total / data.count,
          total_assessments: data.count,
          passing_rate: (data.passing / data.count) * 100
        }));

        setGradeSummary(summaryArray);
      }

    } catch (err) {
      console.error('Error fetching grades:', err);
      setError('Erreur lors du chargement des notes');
    } finally {
      setLoading(false);
    }
  };

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = 
      grade.student?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.student?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.student?.student_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.subject?.subject_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = classFilter === 'all' || grade.class_id === classFilter;
    const matchesSubject = subjectFilter === 'all' || grade.subject_id === subjectFilter;
    const matchesGradeType = gradeTypeFilter === 'all' || grade.grade_type === gradeTypeFilter;
    
    return matchesSearch && matchesClass && matchesSubject && matchesGradeType;
  });

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getLetterGrade = (percentage: number) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
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
            <h1 className="text-2xl font-bold text-gray-900">Grades Management</h1>
            <p className="text-gray-600">Manage student grades, assessments, and academic performance</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Grade
          </button>
        </div>
      </div>

      {/* Grade Summary Cards */}
      {gradeSummary.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {gradeSummary.slice(0, 3).map((summary, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{summary.subject_name}</h3>
                    <p className="text-sm text-gray-500">{summary.total_assessments} assessments</p>
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Grade</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getGradeColor(summary.average_grade)}`}>
                    {Math.round(summary.average_grade)}% ({getLetterGrade(summary.average_grade)})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Passing Rate</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {Math.round(summary.passing_rate)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search grades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select
                value={gradeTypeFilter}
                onChange={(e) => setGradeTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="exam">Exam</option>
                <option value="quiz">Quiz</option>
                <option value="assignment">Assignment</option>
                <option value="project">Project</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {filteredGrades.length} of {grades.length} grades
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {filteredGrades.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {grades.length === 0 ? 'No Grades Found' : 'No Matching Grades'}
              </h3>
              <p className="text-gray-600 mb-4">
                {grades.length === 0 
                  ? 'Start by adding grades for your students.'
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
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredGrades.map((grade) => {
                    const percentage = (grade.grade_value / grade.max_points) * 100;
                    return (
                      <tr key={grade.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-green-800">
                                  {grade.student?.first_name.charAt(0)}{grade.student?.last_name.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {grade.student?.first_name} {grade.student?.last_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {grade.student?.student_number}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {grade.subject?.subject_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {grade.subject?.subject_code}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getGradeColor(percentage)}`}>
                              {getLetterGrade(percentage)}
                            </span>
                            <div className="text-sm text-gray-600">
                              {grade.grade_value}/{grade.max_points} ({Math.round(percentage)}%)
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            {grade.grade_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(grade.assessment_date).toLocaleDateString()}
                          </div>
                          {grade.notes && (
                            <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                              {grade.notes}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
