import { useAuditStore } from '../store/useAuditStore';
import type { ElectronicSignature } from '../types';

/**
 * Checks whether an entity has been approved via an electronic signature
 * in the audit trail.
 *
 * A requirement is considered "approved" if there is at least one audit entry
 * with action 'approve' or 'sign' whose attached signature has meaning 'approved'.
 */
export function isApproved(entityId: string): boolean {
  return getApprovalSignature(entityId) !== undefined;
}

/**
 * Returns the most recent approval signature for the given entity, or undefined
 * if no approval signature exists.
 */
export function getApprovalSignature(entityId: string): ElectronicSignature | undefined {
  const entries = useAuditStore.getState().entries;

  // Walk backwards (newest first) to find the most recent approval.
  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = entries[i];
    if (
      entry.entityId === entityId &&
      entry.signature &&
      entry.signature.meaning === 'approved'
    ) {
      return entry.signature;
    }
  }

  return undefined;
}
