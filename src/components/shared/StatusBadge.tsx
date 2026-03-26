import { REQUIREMENT_STATUS_COLORS, TEST_STATUS_COLORS } from '../../lib/constants';
import type { RequirementStatus, TestStatus } from '../../types';

interface Props {
  status: RequirementStatus | TestStatus;
  type: 'requirement' | 'test';
}

export function StatusBadge({ status, type }: Props) {
  const colors = type === 'requirement'
    ? REQUIREMENT_STATUS_COLORS[status as RequirementStatus]
    : TEST_STATUS_COLORS[status as TestStatus];

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors}`}>
      {status}
    </span>
  );
}
