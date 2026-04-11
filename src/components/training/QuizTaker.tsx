import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../lib/apiClient';

interface QuizQuestion {
  id: string;
  order: number;
  question: string;
  type: string;
  options: string[];
  correctAnswers?: number[];
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
}

interface AttemptResult {
  attempt: { id: string; score: number; passed: boolean };
  correctCount: number;
  totalQuestions: number;
  explanations: Record<string, string>;
}

interface Props {
  quizId: string;
  onBack: () => void;
}

export function QuizTaker({ quizId, onBack }: Props) {
  const { t } = useTranslation();
  const { token } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!token || !quizId) return;
      try {
        const data: any = await apiFetch(`/api/quizzes/${quizId}`, {});
        setQuiz(data.quiz);
      } catch (err: any) {
        setError(err.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [token, quizId]);

  const handleSelect = (questionId: string, optIdx: number, multi: boolean) => {
    setAnswers((prev) => {
      if (multi) {
        const current = prev[questionId] || [];
        const next = current.includes(optIdx)
          ? current.filter((i) => i !== optIdx)
          : [...current, optIdx];
        return { ...prev, [questionId]: next };
      }
      return { ...prev, [questionId]: [optIdx] };
    });
  };

  const handleSubmit = async () => {
    if (!quiz || !token) return;
    setSubmitting(true);
    setError('');
    try {
      const data: any = await apiFetch(`/api/quizzes/${quizId}/attempt`, {
        method: 'POST',
        body: JSON.stringify({ answers }),
      });
      setResult(data as any);
    } catch (err: any) {
      setError(err.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="h-5 w-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!quiz) {
    return <div className="text-center py-8 text-text-secondary">{t('quizzes.notFound')}</div>;
  }

  // Results view
  if (result) {
    return (
      <div className="space-y-4">
        <button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </button>

        <div className={`p-6 rounded-xl text-center ${result.attempt.passed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          {result.attempt.passed ? (
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
          ) : (
            <XCircle className="w-12 h-12 mx-auto mb-2 text-red-500" />
          )}
          <h3 className="text-xl font-bold text-text-primary">
            {result.attempt.passed ? t('quizzes.passed') : t('quizzes.failed')}
          </h3>
          <p className="text-2xl font-bold mt-1 text-text-primary">{result.attempt.score}%</p>
          <p className="text-sm text-text-secondary mt-1">
            {result.correctCount}/{result.totalQuestions} {t('quizzes.correct')}
          </p>
        </div>

        {/* Show explanations for wrong answers */}
        {Object.keys(result.explanations).length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-text-primary">{t('quizzes.reviewWrong')}</h4>
            {quiz.questions.filter((q) => result.explanations[q.id]).map((q) => (
              <div key={q.id} className="p-3 rounded-lg border border-border bg-surface">
                <div className="text-sm font-medium text-text-primary">{q.question}</div>
                <div className="text-xs text-text-secondary mt-1">
                  {t('quizzes.yourAnswer')}: {(answers[q.id] || []).map((i) => (q.options as string[])[i]).join(', ') || '-'}
                </div>
                <div className="text-xs text-accent mt-1">{result.explanations[q.id]}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Quiz taking view
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </button>
        <span className="text-sm text-text-tertiary">
          {t('quizzes.passingScore')}: {quiz.passingScore}%
        </span>
      </div>

      <h3 className="text-lg font-semibold text-text-primary">{quiz.title}</h3>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

      <div className="space-y-4">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="p-4 border border-border rounded-lg bg-surface">
            <div className="flex items-start gap-2 mb-3">
              <span className="text-xs font-medium text-text-tertiary bg-surface-secondary px-1.5 py-0.5 rounded">
                {idx + 1}
              </span>
              <span className="text-sm font-medium text-text-primary">{q.question}</span>
            </div>

            {q.type === 'true_false' ? (
              <div className="flex gap-4 ml-6">
                {['True', 'False'].map((opt, optIdx) => (
                  <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={(answers[q.id] || []).includes(optIdx)}
                      onChange={() => handleSelect(q.id, optIdx, false)}
                      className="text-accent"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ) : (
              <div className="space-y-2 ml-6">
                {(q.options as string[]).map((opt, optIdx) => (
                  <label key={optIdx} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type={q.type === 'multi_select' ? 'checkbox' : 'radio'}
                      name={`q-${q.id}`}
                      checked={(answers[q.id] || []).includes(optIdx)}
                      onChange={() => handleSelect(q.id, optIdx, q.type === 'multi_select')}
                      className="text-accent"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting || Object.keys(answers).length === 0}
          className="px-4 py-2 text-sm bg-accent text-white rounded-lg disabled:opacity-50"
        >
          {submitting ? t('common.saving') : t('quizzes.submitQuiz')}
        </button>
      </div>
    </div>
  );
}
