import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '../../lib/apiClient';
import { Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface MigrateDataButtonProps {
  projectId?: string;
}

type MigrateResult = {
  total: number;
  success: number;
  failed: number;
};

const STORE_KEYS = [
  { key: 'qatrial:requirements', field: 'state.requirements', endpoint: '/requirements', label: 'Requirements' },
  { key: 'qatrial:tests', field: 'state.tests', endpoint: '/tests', label: 'Tests' },
  { key: 'qatrial:capa', field: 'state.records', endpoint: '/capa', label: 'CAPA' },
  { key: 'qatrial:risk-assessments', field: 'state.assessments', endpoint: '/risks', label: 'Risks' },
] as const;

function getNestedValue(obj: Record<string, unknown>, path: string): unknown[] {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return [];
    current = (current as Record<string, unknown>)[part];
  }
  return Array.isArray(current) ? current : [];
}

export function MigrateDataButton({ projectId }: MigrateDataButtonProps) {
  const { t } = useTranslation();
  const [migrating, setMigrating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [result, setResult] = useState<MigrateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMigrate = async () => {
    setMigrating(true);
    setResult(null);
    setError(null);

    let totalItems = 0;
    let successCount = 0;
    let failedCount = 0;

    // Collect all items to import
    const batches: { endpoint: string; items: unknown[] }[] = [];

    for (const storeConfig of STORE_KEYS) {
      try {
        const raw = localStorage.getItem(storeConfig.key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        const items = getNestedValue(parsed as Record<string, unknown>, storeConfig.field);
        if (items.length > 0) {
          batches.push({ endpoint: storeConfig.endpoint, items });
          totalItems += items.length;
        }
      } catch {
        // Skip invalid localStorage entries
      }
    }

    if (totalItems === 0) {
      setMigrating(false);
      setResult({ total: 0, success: 0, failed: 0 });
      return;
    }

    setProgress({ current: 0, total: totalItems });
    let current = 0;

    for (const batch of batches) {
      for (const item of batch.items) {
        try {
          await apiFetch(batch.endpoint, {
            method: 'POST',
            body: JSON.stringify({ ...(item as Record<string, unknown>), projectId }),
          });
          successCount++;
        } catch {
          failedCount++;
        }
        current++;
        setProgress({ current, total: totalItems });
      }
    }

    setResult({ total: totalItems, success: successCount, failed: failedCount });
    setMigrating(false);
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleMigrate}
        disabled={migrating}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover disabled:opacity-50 transition-colors"
      >
        {migrating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        {migrating
          ? t('auth.migrateProgress', { current: progress.current, total: progress.total })
          : t('auth.migrateData')}
      </button>

      {result && !error && (
        <div className="flex items-center gap-1.5 text-xs">
          {result.failed === 0 ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-600">
                {t('auth.migrateSuccess', { count: result.success })}
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-amber-600">
                {result.success} OK, {result.failed} failed
              </span>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-500">
          <AlertCircle className="w-3.5 h-3.5" />
          {t('auth.migrateError')}
        </div>
      )}
    </div>
  );
}
