import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import type { Test } from '../../types';

interface Props {
  tests: Test[];
}

export function OrphanedTests({ tests }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-warning-subtle flex items-center justify-center">
          <AlertCircle className="w-3.5 h-3.5 text-warning" />
        </div>
        <h3 className="text-sm font-semibold text-text-primary">
          {t('dashboard.orphanedTests', { count: tests.length })}
        </h3>
      </div>
      {tests.length === 0 ? (
        <div className="px-4 py-6 text-sm text-text-tertiary text-center">
          {t('dashboard.orphanedTestsEmpty')}
        </div>
      ) : (
        <div className="divide-y divide-border-subtle">
          {tests.map((test) => (
            <div key={test.id} className="px-4 py-2.5 flex items-center gap-3 hover:bg-surface-hover transition-colors">
              <span className="font-mono text-xs text-text-tertiary w-16 shrink-0">{test.id}</span>
              <span className="text-sm text-text-primary flex-1 truncate">{test.title}</span>
              <StatusBadge status={test.status} type="test" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
