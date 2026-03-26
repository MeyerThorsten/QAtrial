import { AlertCircle } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import type { Requirement } from '../../types';

interface Props {
  requirements: Requirement[];
}

export function OrphanedRequirements({ requirements }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-orange-500" />
        <h3 className="text-sm font-medium text-gray-900">
          Requirements ohne Tests ({requirements.length})
        </h3>
      </div>
      {requirements.length === 0 ? (
        <div className="px-4 py-6 text-sm text-gray-400 text-center">
          Alle Requirements sind mit Tests verlinkt.
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {requirements.map((req) => (
            <div key={req.id} className="px-4 py-2.5 flex items-center gap-3">
              <span className="font-mono text-xs text-gray-400 w-16 shrink-0">{req.id}</span>
              <span className="text-sm text-gray-700 flex-1 truncate">{req.title}</span>
              <StatusBadge status={req.status} type="requirement" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
