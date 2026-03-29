import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid3X3, Check, Minus } from 'lucide-react';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useTestsStore } from '../../store/useTestsStore';
import { StatusBadge } from '../shared/StatusBadge';
import type { Requirement, Test } from '../../types';

interface Props {
  filteredRequirements?: Requirement[];
  filteredTests?: Test[];
}

export function TraceabilityMatrix({ filteredRequirements, filteredTests }: Props) {
  const { t } = useTranslation();
  const allRequirements = useRequirementsStore((s) => s.requirements);
  const allTests = useTestsStore((s) => s.tests);

  const requirements = filteredRequirements ?? allRequirements;
  const tests = filteredTests ?? allTests;

  const linkMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const test of tests) {
      for (const reqId of test.linkedRequirementIds) {
        if (!map.has(reqId)) map.set(reqId, new Set());
        map.get(reqId)!.add(test.id);
      }
    }
    return map;
  }, [tests]);

  if (requirements.length === 0 && tests.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Grid3X3 className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-text-primary">{t('dashboard.traceabilityMatrix')}</h3>
        </div>
        <div className="text-sm text-text-tertiary text-center py-8">
          {t('dashboard.traceabilityEmpty')}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-accent-subtle flex items-center justify-center">
          <Grid3X3 className="w-3.5 h-3.5 text-accent" />
        </div>
        <h3 className="text-sm font-semibold text-text-primary">
          {t('dashboard.traceabilityMatrix')}
        </h3>
        <span className="text-xs text-text-tertiary ml-auto">
          {t('dashboard.reqsTimesTests', { reqCount: requirements.length, testCount: tests.length })}
        </span>
      </div>
      <div className="overflow-auto max-h-[500px]">
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 z-10">
            <tr className="bg-surface-tertiary">
              <th className="sticky left-0 z-20 bg-surface-tertiary border-b border-r border-border px-3 py-2 text-left font-semibold text-text-tertiary min-w-[180px]">
                {t('dashboard.reqDownTestRight')}
              </th>
              {tests.map((test) => (
                <th
                  key={test.id}
                  className="border-b border-r border-border px-2 py-2 font-semibold text-text-tertiary min-w-[80px] bg-surface-tertiary"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-mono">{test.id}</span>
                    <StatusBadge status={test.status} type="test" />
                  </div>
                </th>
              ))}
              <th className="border-b border-border px-3 py-2 font-semibold text-text-tertiary bg-surface-tertiary min-w-[70px]">
                {t('dashboard.links')}
              </th>
            </tr>
          </thead>
          <tbody>
            {requirements.map((req) => {
              const linkedTests = linkMap.get(req.id);
              const linkCount = linkedTests?.size ?? 0;
              return (
                <tr key={req.id} className="hover:bg-accent-subtle/30 transition-colors">
                  <td className="sticky left-0 z-10 bg-surface border-b border-r border-border px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-text-tertiary shrink-0">{req.id}</span>
                      <span className="text-text-primary truncate max-w-[120px]" title={req.title}>
                        {req.title}
                      </span>
                    </div>
                  </td>
                  {tests.map((test) => {
                    const isLinked = linkedTests?.has(test.id) ?? false;
                    return (
                      <td
                        key={test.id}
                        className={`border-b border-r border-border-subtle text-center px-2 py-2 ${
                          isLinked ? 'bg-success-subtle' : ''
                        }`}
                      >
                        {isLinked ? (
                          <Check className="w-4 h-4 text-success mx-auto" />
                        ) : (
                          <Minus className="w-3 h-3 text-text-tertiary/30 mx-auto" />
                        )}
                      </td>
                    );
                  })}
                  <td className={`border-b border-border text-center px-3 py-2 font-semibold ${
                    linkCount === 0 ? 'text-danger bg-danger-subtle' : 'text-success bg-success-subtle'
                  }`}>
                    {linkCount}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-surface-tertiary">
              <td className="sticky left-0 z-10 bg-surface-tertiary border-r border-border px-3 py-2 text-xs font-semibold text-text-tertiary">
                {t('dashboard.linksPerTest')}
              </td>
              {tests.map((test) => {
                const count = test.linkedRequirementIds.filter((id) =>
                  requirements.some((r) => r.id === id)
                ).length;
                return (
                  <td
                    key={test.id}
                    className={`border-r border-border text-center px-2 py-2 font-semibold ${
                      count === 0 ? 'text-danger bg-danger-subtle' : 'text-success bg-success-subtle'
                    }`}
                  >
                    {count}
                  </td>
                );
              })}
              <td className="bg-surface-tertiary px-3 py-2 text-center font-semibold text-text-tertiary">
                {Array.from(linkMap.values()).reduce((sum, s) => sum + s.size, 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
