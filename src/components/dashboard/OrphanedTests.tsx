import { AlertCircle } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import type { Test } from '../../types';

interface Props {
  tests: Test[];
}

export function OrphanedTests({ tests }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-orange-500" />
        <h3 className="text-sm font-medium text-gray-900">
          Tests ohne Requirements ({tests.length})
        </h3>
      </div>
      {tests.length === 0 ? (
        <div className="px-4 py-6 text-sm text-gray-400 text-center">
          Alle Tests sind mit Requirements verlinkt.
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {tests.map((test) => (
            <div key={test.id} className="px-4 py-2.5 flex items-center gap-3">
              <span className="font-mono text-xs text-gray-400 w-16 shrink-0">{test.id}</span>
              <span className="text-sm text-gray-700 flex-1 truncate">{test.title}</span>
              <StatusBadge status={test.status} type="test" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
