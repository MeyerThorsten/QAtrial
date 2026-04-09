import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GraduationCap, Plus, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../lib/apiClient';
import { roleHasPermission } from '../../lib/permissions';

interface ComplianceData {
  planId: string;
  role: string;
  planName: string;
  totalRequired: number;
  completed: number;
  overdue: number;
  compliancePercent: number;
}

interface MatrixEntry {
  planId: string;
  role: string;
  planName: string;
  courses: {
    courseId: string;
    courseTitle: string;
    isRequired: boolean;
    completedCount: number;
    assignedCount: number;
    expiredCount: number;
    totalRecords: number;
  }[];
}

export function TrainingDashboard() {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const [compliance, setCompliance] = useState<ComplianceData[]>([]);
  const [overallCompliance, setOverallCompliance] = useState(0);
  const [totalOverdue, setTotalOverdue] = useState(0);
  const [matrix, setMatrix] = useState<MatrixEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [assignData, setAssignData] = useState({ userId: '', courseId: '' });
  const [error, setError] = useState('');
  const canEdit = roleHasPermission(user?.role, 'canEdit');

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const [compData, matrixData, coursesData, usersData] = await Promise.all([
        apiFetch<{ compliance: ComplianceData[]; overallCompliance: number; totalOverdue: number }>('/training/compliance'),
        apiFetch<{ matrix: MatrixEntry[] }>('/training/matrix'),
        apiFetch<{ courses: any[] }>('/training/courses'),
        apiFetch<{ users: any[] }>('/users'),
      ]);
      setCompliance(compData.compliance || []);
      setOverallCompliance(compData.overallCompliance || 0);
      setTotalOverdue(compData.totalOverdue || 0);
      setMatrix(matrixData.matrix || []);
      setCourses(coursesData.courses || []);
      setUsers(usersData.users || []);
    } catch (err) {
      console.error('Failed to fetch training data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch training data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleAssign = async () => {
    if (!token || !assignData.userId || !assignData.courseId) return;
    if (!canEdit) {
      setError('Insufficient permissions: requires canEdit');
      return;
    }
    try {
      await apiFetch('/training/records', {
        method: 'POST',
        body: JSON.stringify(assignData),
      });
      setShowAssignForm(false);
      setAssignData({ userId: '', courseId: '' });
      fetchData();
    } catch (err) {
      console.error('Failed to assign training:', err);
      setError(err instanceof Error ? err.message : 'Failed to assign training');
    }
  };

  const complianceChartData = compliance.map((c) => ({
    name: c.role,
    compliance: c.compliancePercent,
    overdue: c.overdue,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">{t('training.title')}</h2>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowAssignForm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('training.assignTraining')}
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <p className="text-xs text-text-tertiary font-medium uppercase">{t('training.overallCompliance')}</p>
          </div>
          <div className="flex items-end gap-2">
            <p className={`text-3xl font-bold ${overallCompliance >= 80 ? 'text-green-600' : overallCompliance >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {overallCompliance}%
            </p>
          </div>
          <div className="w-full bg-border rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all ${overallCompliance >= 80 ? 'bg-green-500' : overallCompliance >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${overallCompliance}%` }}
            />
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-orange-500" />
            <p className="text-xs text-text-tertiary font-medium uppercase">{t('training.overdueTrainings')}</p>
          </div>
          <p className={`text-3xl font-bold ${totalOverdue > 0 ? 'text-orange-500' : 'text-green-600'}`}>
            {totalOverdue}
          </p>
        </div>

        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-4 h-4 text-accent" />
            <p className="text-xs text-text-tertiary font-medium uppercase">{t('training.totalCourses')}</p>
          </div>
          <p className="text-3xl font-bold text-text-primary">{courses.length}</p>
        </div>
      </div>

      {/* Compliance Chart */}
      {complianceChartData.length > 0 && (
        <div className="bg-surface rounded-xl border border-border p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">{t('training.complianceByRole')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={complianceChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--color-text-tertiary)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--color-text-tertiary)" domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="compliance" fill="var(--color-accent)" radius={[4, 4, 0, 0]} name={t('training.compliancePercent')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Training Matrix */}
      {matrix.length > 0 && courses.length > 0 && (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary">{t('training.trainingMatrix')}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-surface-secondary border-b border-border">
                  <th className="text-left px-3 py-2 font-medium text-text-secondary sticky left-0 bg-surface-secondary">
                    {t('training.role')}
                  </th>
                  {courses.map((course) => (
                    <th key={course.id} className="text-center px-3 py-2 font-medium text-text-secondary min-w-[100px]">
                      {course.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row) => (
                  <tr key={row.planId} className="border-b border-border hover:bg-surface-hover">
                    <td className="px-3 py-2 font-medium text-text-primary sticky left-0 bg-surface">
                      {row.role}
                    </td>
                    {courses.map((course) => {
                      const cell = row.courses.find((c) => c.courseId === course.id);
                      if (!cell) {
                        return <td key={course.id} className="text-center px-3 py-2 text-text-tertiary">--</td>;
                      }
                      return (
                        <td key={course.id} className="text-center px-3 py-2">
                          {cell.completedCount > 0 ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
                              <CheckCircle2 className="w-3 h-3" />
                              {cell.completedCount}
                            </span>
                          ) : cell.assignedCount > 0 ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs">
                              <Clock className="w-3 h-3" />
                              {cell.assignedCount}
                            </span>
                          ) : cell.expiredCount > 0 ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs">
                              <AlertCircle className="w-3 h-3" />
                              {cell.expiredCount}
                            </span>
                          ) : (
                            <span className="text-text-tertiary">--</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {matrix.length === 0 && compliance.length === 0 && (
        <div className="bg-surface rounded-xl border border-border p-8 text-center">
          <GraduationCap className="w-10 h-10 text-text-tertiary mx-auto mb-2" />
          <p className="text-text-tertiary">{t('training.noData')}</p>
          <p className="text-xs text-text-tertiary mt-1">{t('training.noDataDesc')}</p>
        </div>
      )}

      {/* Assign Training Form */}
      {showAssignForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={() => setShowAssignForm(false)}>
          <div
            className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-md mx-4 border border-border p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-text-primary">{t('training.assignTraining')}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">{t('training.userId')}</label>
                <select
                  value={assignData.userId}
                  onChange={(e) => setAssignData({ ...assignData, userId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <option value="">{t('training.userIdPlaceholder')}</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name || u.email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">{t('training.course')}</label>
                <select
                  value={assignData.courseId}
                  onChange={(e) => setAssignData({ ...assignData, courseId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <option value="">{t('training.selectCourse')}</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAssignForm(false)}
                className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleAssign}
                className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90"
              >
                {t('training.assign')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
