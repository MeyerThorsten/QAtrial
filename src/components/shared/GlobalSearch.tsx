import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';
import { apiFetch } from '../../lib/apiClient';
import { getProjectId } from '../../lib/projectUtils';

interface SearchResult {
  type: string;
  id: string;
  title: string;
  snippet: string;
  score: number;
}

const TYPE_BADGES: Record<string, { label: string; color: string }> = {
  requirement: { label: 'REQ', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  test: { label: 'TEST', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  capa: { label: 'CAPA', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
  complaint: { label: 'COMP', color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  deviation: { label: 'DEV', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
  document: { label: 'DOC', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
};

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query || !text) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.substring(0, idx)}
      <mark className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">{text.substring(idx, idx + query.length)}</mark>
      {text.substring(idx + query.length)}
    </>
  );
}

export function GlobalSearch() {
  const { t } = useTranslation();
  const project = useProjectStore((s) => s.project);
  const projectId = getProjectId(project);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
      setTotal(0);
    }
  }, [open]);

  const doSearch = useCallback(
    async (q: string) => {
      if (!projectId || q.trim().length < 2) {
        setResults([]);
        setTotal(0);
        return;
      }
      setLoading(true);
      try {
        const data: any = await apiFetch(
          `/api/search?q=${encodeURIComponent(q)}&projectId=${projectId}`,
          {}
        );
        setResults(data.results || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    },
    [projectId]
  );

  const handleInput = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  };

  // Group results by type
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
        title={`${t('search.title')} (Cmd+K)`}
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">{t('search.title')}</span>
        <kbd className="hidden sm:inline text-xs text-text-tertiary bg-surface-secondary px-1 rounded">
          {navigator.platform.includes('Mac') ? '\u2318' : 'Ctrl'}K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-overlay" onClick={() => setOpen(false)}>
          <div
            className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-2xl mx-4 border border-border max-h-[60vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-5 h-5 text-text-tertiary shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleInput(e.target.value)}
                placeholder={t('search.placeholder')}
                className="flex-1 bg-transparent text-text-primary text-sm outline-none placeholder-text-tertiary"
              />
              {loading && (
                <div className="h-4 w-4 rounded-full border-2 border-accent border-t-transparent animate-spin shrink-0" />
              )}
              <button onClick={() => setOpen(false)} className="text-text-tertiary hover:text-text-secondary">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {query.trim().length < 2 ? (
                <div className="px-4 py-8 text-center text-sm text-text-tertiary">
                  {t('search.hint')}
                </div>
              ) : results.length === 0 && !loading ? (
                <div className="px-4 py-8 text-center text-sm text-text-tertiary">
                  {t('search.noResults')}
                </div>
              ) : (
                <div className="py-2">
                  {Object.entries(grouped).map(([type, items]) => (
                    <div key={type}>
                      <div className="px-4 py-1.5 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                        {type === 'requirement' ? t('search.types.requirements') :
                         type === 'test' ? t('search.types.tests') :
                         type === 'capa' ? t('search.types.capa') :
                         type === 'complaint' ? t('search.types.complaints') :
                         type === 'deviation' ? t('search.types.deviations') :
                         type === 'document' ? t('search.types.documents') : type}
                        {' '}({items.length})
                      </div>
                      {items.map((item) => {
                        const badge = TYPE_BADGES[item.type];
                        return (
                          <button
                            key={`${item.type}-${item.id}`}
                            onClick={() => {
                              setOpen(false);
                              // Navigation would go here depending on type
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-surface-hover transition-colors flex items-start gap-3"
                          >
                            {badge && (
                              <span className={`px-1.5 py-0.5 rounded text-xs font-medium shrink-0 mt-0.5 ${badge.color}`}>
                                {badge.label}
                              </span>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-text-primary truncate">
                                {highlightMatch(item.title, query)}
                              </div>
                              <div className="text-xs text-text-tertiary truncate mt-0.5">
                                {highlightMatch(item.snippet, query)}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                  {total > results.length && (
                    <div className="px-4 py-2 text-center text-xs text-text-tertiary">
                      {t('search.showingOf', { shown: results.length, total })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
