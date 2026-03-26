import { useMemo } from 'react';
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
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Grid3X3 className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-medium text-gray-900">Traceability Matrix</h3>
        </div>
        <div className="text-sm text-gray-400 text-center py-8">
          Keine Daten vorhanden. Erstelle Requirements und Tests, um die Matrix zu sehen.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <Grid3X3 className="w-4 h-4 text-blue-500" />
        <h3 className="text-sm font-medium text-gray-900">
          Traceability Matrix
        </h3>
        <span className="text-xs text-gray-400 ml-auto">
          {requirements.length} Reqs &times; {tests.length} Tests
        </span>
      </div>
      <div className="overflow-auto max-h-[500px]">
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gray-50">
              {/* Top-left corner cell */}
              <th className="sticky left-0 z-20 bg-gray-100 border-b border-r border-gray-200 px-3 py-2 text-left font-medium text-gray-500 min-w-[180px]">
                Req ↓ / Test →
              </th>
              {tests.map((test) => (
                <th
                  key={test.id}
                  className="border-b border-r border-gray-200 px-2 py-2 font-medium text-gray-500 min-w-[80px] bg-gray-50"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-mono">{test.id}</span>
                    <StatusBadge status={test.status} type="test" />
                  </div>
                </th>
              ))}
              {/* Summary column */}
              <th className="border-b border-gray-200 px-3 py-2 font-medium text-gray-500 bg-gray-100 min-w-[70px]">
                Links
              </th>
            </tr>
          </thead>
          <tbody>
            {requirements.map((req) => {
              const linkedTests = linkMap.get(req.id);
              const linkCount = linkedTests?.size ?? 0;
              return (
                <tr key={req.id} className="hover:bg-blue-50/30">
                  {/* Requirement row header */}
                  <td className="sticky left-0 z-10 bg-white border-b border-r border-gray-200 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-gray-400 shrink-0">{req.id}</span>
                      <span className="text-gray-700 truncate max-w-[120px]" title={req.title}>
                        {req.title}
                      </span>
                    </div>
                  </td>
                  {/* Matrix cells */}
                  {tests.map((test) => {
                    const isLinked = linkedTests?.has(test.id) ?? false;
                    return (
                      <td
                        key={test.id}
                        className={`border-b border-r border-gray-100 text-center px-2 py-2 ${
                          isLinked ? 'bg-green-50' : ''
                        }`}
                      >
                        {isLinked ? (
                          <Check className="w-4 h-4 text-green-600 mx-auto" />
                        ) : (
                          <Minus className="w-3 h-3 text-gray-200 mx-auto" />
                        )}
                      </td>
                    );
                  })}
                  {/* Summary cell */}
                  <td className={`border-b border-gray-200 text-center px-3 py-2 font-medium ${
                    linkCount === 0 ? 'text-red-500 bg-red-50' : 'text-green-600 bg-green-50'
                  }`}>
                    {linkCount}
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* Footer row: link count per test */}
          <tfoot>
            <tr className="bg-gray-50">
              <td className="sticky left-0 z-10 bg-gray-100 border-r border-gray-200 px-3 py-2 text-xs font-medium text-gray-500">
                Links pro Test
              </td>
              {tests.map((test) => {
                const count = test.linkedRequirementIds.filter((id) =>
                  requirements.some((r) => r.id === id)
                ).length;
                return (
                  <td
                    key={test.id}
                    className={`border-r border-gray-200 text-center px-2 py-2 font-medium ${
                      count === 0 ? 'text-red-500 bg-red-50' : 'text-green-600 bg-green-50'
                    }`}
                  >
                    {count}
                  </td>
                );
              })}
              <td className="bg-gray-100 px-3 py-2 text-center font-medium text-gray-500">
                {Array.from(linkMap.values()).reduce((sum, s) => sum + s.size, 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
