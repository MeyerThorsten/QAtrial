import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Plus, Trash2, GripVertical, Eye } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../lib/apiClient';
import { roleHasPermission } from '../../lib/permissions';

interface QuizQuestion {
  id?: string;
  order: number;
  question: string;
  type: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
}

interface Quiz {
  id: string;
  courseId: string;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
  _count?: { attempts: number };
}

interface Props {
  courseId: string;
  onTakeQuiz?: (quizId: string) => void;
}

export function QuizBuilder({ courseId, onTakeQuiz }: Props) {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const canEdit = roleHasPermission(user?.role, 'canEdit');

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editQuiz, setEditQuiz] = useState<Quiz | null>(null);
  const [title, setTitle] = useState('');
  const [passingScore, setPassingScore] = useState(80);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState('');

  const fetchQuizzes = async () => {
    if (!token || !courseId) return;
    try {
      const data: any = await apiFetch(`/api/quizzes?courseId=${courseId}`, {});
      setQuizzes(data.quizzes || []);
    } catch (err: any) {
      console.error('Fetch quizzes error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [token, courseId]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        order: questions.length + 1,
        question: '',
        type: 'multiple_choice',
        options: ['', '', '', ''],
        correctAnswers: [0],
        explanation: '',
      },
    ]);
  };

  const updateQuestion = (idx: number, updates: Partial<QuizQuestion>) => {
    const next = [...questions];
    next[idx] = { ...next[idx], ...updates };
    setQuestions(next);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx).map((q, i) => ({ ...q, order: i + 1 })));
  };

  const handleSave = async () => {
    setError('');
    if (!title.trim() || questions.length === 0) {
      setError(t('quizzes.validationError'));
      return;
    }

    try {
      const body = {
        courseId,
        title: title.trim(),
        passingScore,
        questions: questions.map((q, idx) => ({
          order: idx + 1,
          question: q.question,
          type: q.type,
          options: q.options.filter(Boolean),
          correctAnswers: q.correctAnswers,
          explanation: q.explanation || null,
        })),
      };

      if (editQuiz) {
        await apiFetch(`/api/quizzes/${editQuiz.id}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        await apiFetch('/api/quizzes', { method: 'POST', body: JSON.stringify(body) });
      }

      setShowForm(false);
      setEditQuiz(null);
      setTitle('');
      setPassingScore(80);
      setQuestions([]);
      fetchQuizzes();
    } catch (err: any) {
      setError(err.message || 'Failed to save quiz');
    }
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditQuiz(quiz);
    setTitle(quiz.title);
    setPassingScore(quiz.passingScore);
    setQuestions(quiz.questions.map((q) => ({
      id: q.id,
      order: q.order,
      question: q.question,
      type: q.type,
      options: q.options as string[],
      correctAnswers: (q.correctAnswers as number[]) || [0],
      explanation: q.explanation || '',
    })));
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="h-5 w-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  // Form view
  if (showForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-text-primary">
            {editQuiz ? t('quizzes.edit') : t('quizzes.new')}
          </h3>
          <button onClick={() => { setShowForm(false); setEditQuiz(null); }} className="text-sm text-text-secondary">
            {t('common.cancel')}
          </button>
        </div>

        {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{t('quizzes.quizTitle')}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{t('quizzes.passingScore')}</label>
            <input
              type="number"
              min={0}
              max={100}
              value={passingScore}
              onChange={(e) => setPassingScore(parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="space-y-3">
          {questions.map((q, idx) => (
            <div key={idx} className="p-4 border border-border rounded-lg bg-surface space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-text-tertiary" />
                  <span className="text-sm font-medium text-text-primary">#{q.order}</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={q.type}
                    onChange={(e) => updateQuestion(idx, { type: e.target.value })}
                    className="text-xs rounded border border-border bg-surface px-2 py-1"
                  >
                    <option value="multiple_choice">{t('quizzes.multipleChoice')}</option>
                    <option value="true_false">{t('quizzes.trueFalse')}</option>
                    <option value="multi_select">{t('quizzes.multiSelect')}</option>
                  </select>
                  <button onClick={() => removeQuestion(idx)} className="p-1 text-text-tertiary hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={q.question}
                onChange={(e) => updateQuestion(idx, { question: e.target.value })}
                placeholder={t('quizzes.questionPlaceholder')}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              />

              {q.type === 'true_false' ? (
                <div className="flex gap-4">
                  {['True', 'False'].map((opt, optIdx) => (
                    <label key={opt} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        checked={q.correctAnswers.includes(optIdx)}
                        onChange={() => updateQuestion(idx, { correctAnswers: [optIdx], options: ['True', 'False'] })}
                        className="text-accent"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type={q.type === 'multi_select' ? 'checkbox' : 'radio'}
                        checked={q.correctAnswers.includes(optIdx)}
                        onChange={() => {
                          if (q.type === 'multi_select') {
                            const next = q.correctAnswers.includes(optIdx)
                              ? q.correctAnswers.filter((a) => a !== optIdx)
                              : [...q.correctAnswers, optIdx];
                            updateQuestion(idx, { correctAnswers: next });
                          } else {
                            updateQuestion(idx, { correctAnswers: [optIdx] });
                          }
                        }}
                        className="text-accent"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const opts = [...q.options];
                          opts[optIdx] = e.target.value;
                          updateQuestion(idx, { options: opts });
                        }}
                        placeholder={`${t('quizzes.option')} ${optIdx + 1}`}
                        className="flex-1 rounded border border-border bg-surface px-2 py-1 text-sm"
                      />
                      {q.options.length > 2 && (
                        <button
                          onClick={() => {
                            const opts = q.options.filter((_, i) => i !== optIdx);
                            const corrected = q.correctAnswers
                              .filter((a) => a !== optIdx)
                              .map((a) => (a > optIdx ? a - 1 : a));
                            updateQuestion(idx, { options: opts, correctAnswers: corrected });
                          }}
                          className="text-text-tertiary hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => updateQuestion(idx, { options: [...q.options, ''] })}
                    className="text-xs text-accent hover:underline"
                  >
                    + {t('quizzes.addOption')}
                  </button>
                </div>
              )}

              <input
                type="text"
                value={q.explanation}
                onChange={(e) => updateQuestion(idx, { explanation: e.target.value })}
                placeholder={t('quizzes.explanationPlaceholder')}
                className="w-full rounded border border-border bg-surface px-2 py-1 text-xs text-text-tertiary"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={addQuestion}
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            <Plus className="w-4 h-4" />
            {t('quizzes.addQuestion')}
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || questions.length === 0}
            className="px-4 py-2 text-sm bg-accent text-white rounded-lg disabled:opacity-50"
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-accent" />
          {t('quizzes.title')}
        </h3>
        {canEdit && (
          <button
            onClick={() => { setShowForm(true); setEditQuiz(null); setTitle(''); setPassingScore(80); setQuestions([]); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent/90"
          >
            <Plus className="w-4 h-4" />
            {t('quizzes.new')}
          </button>
        )}
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-8 text-text-tertiary text-sm">{t('quizzes.empty')}</div>
      ) : (
        <div className="space-y-2">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface">
              <div>
                <div className="font-medium text-text-primary text-sm">{quiz.title}</div>
                <div className="text-xs text-text-tertiary">
                  {quiz.questions.length} {t('quizzes.questions')} | {t('quizzes.passingScore')}: {quiz.passingScore}%
                  {quiz._count && ` | ${quiz._count.attempts} ${t('quizzes.attempts')}`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onTakeQuiz && (
                  <button
                    onClick={() => onTakeQuiz(quiz.id)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-accent text-white rounded"
                  >
                    <Eye className="w-3 h-3" />
                    {t('quizzes.take')}
                  </button>
                )}
                {canEdit && (
                  <button
                    onClick={() => handleEditQuiz(quiz)}
                    className="text-xs text-accent hover:underline"
                  >
                    {t('common.edit')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
