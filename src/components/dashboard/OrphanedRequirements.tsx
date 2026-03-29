import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import type { Requirement } from '../../types';

interface Props {
  requirements: Requirement[];
}

export function OrphanedRequirements({ requirements }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-warning-subtle flex items-center justify-center">
          <AlertCircle className="w-3.5 h-3.5 text-warning" />
        </div>
        <h3 className="text-sm font-semibold text-text-primary">
          {t('dashboard.orphanedReqs', { count: requirements.length })}
        </h3>
      </div>
      {requirements.length === 0 ? (
        <div className="px-4 py-6 text-sm text-text-tertiary text-center">
          {t('dashboard.orphanedReqsEmpty')}
        </div>
      ) : (
        <div className="divide-y divide-border-subtle">
          {requirements.map((req) => (
            <div key={req.id} className="px-4 py-2.5 flex items-center gap-3 hover:bg-surface-hover transition-colors">
              <span className="font-mono text-xs text-text-tertiary w-16 shrink-0">{req.id}</span>
              <span className="text-sm text-text-primary flex-1 truncate">{req.title}</span>
              <StatusBadge status={req.status} type="requirement" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
