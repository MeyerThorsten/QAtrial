import { prisma } from '../index.js';

export async function logAudit(params: {
  projectId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  previousValue?: any;
  newValue?: any;
  reason?: string;
}): Promise<void> {
  await prisma.auditLog.create({
    data: {
      projectId: params.projectId,
      userId: params.userId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      previousValue: params.previousValue ?? undefined,
      newValue: params.newValue ?? undefined,
      reason: params.reason ?? undefined,
    },
  });
}
