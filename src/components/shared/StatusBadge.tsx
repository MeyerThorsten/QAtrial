import { useTranslation } from 'react-i18next';
import type { RequirementStatus, TestStatus } from '../../types';

const REQ_COLORS: Record<RequirementStatus, string> = {
  Draft: 'bg-badge-draft-bg text-badge-draft-text',
  Active: 'bg-badge-active-bg text-badge-active-text',
  Closed: 'bg-badge-closed-bg text-badge-closed-text',
};

const TEST_COLORS: Record<TestStatus, string> = {
  'Not Run': 'bg-badge-notrun-bg text-badge-notrun-text',
  Passed: 'bg-badge-passed-bg text-badge-passed-text',
  Failed: 'bg-badge-failed-bg text-badge-failed-text',
};

interface Props {
  status: RequirementStatus | TestStatus;
  type: 'requirement' | 'test';
}

export function StatusBadge({ status, type }: Props) {
  const { t } = useTranslation();
  const colors = type === 'requirement'
    ? REQ_COLORS[status as RequirementStatus]
    : TEST_COLORS[status as TestStatus];

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${colors}`}>
      {t(`statuses.${status}`)}
    </span>
  );
}
