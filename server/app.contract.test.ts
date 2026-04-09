import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import type { JwtPayload } from './middleware/auth.js';

type MockFn = ReturnType<typeof vi.fn>;
type ModelMock = Record<string, MockFn>;

const { prisma, dispatchWebhookMock, bcryptCompareMock, bcryptHashMock } = vi.hoisted(() => {
  const createModelMock = () => ({
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    updateMany: vi.fn(),
    count: vi.fn(),
    aggregate: vi.fn(),
  });

  return {
    prisma: {
      organization: createModelMock(),
      workspace: createModelMock(),
      project: createModelMock(),
      requirement: createModelMock(),
      test: createModelMock(),
      risk: createModelMock(),
      cAPA: createModelMock(),
      auditLog: createModelMock(),
      evidence: createModelMock(),
      approval: createModelMock(),
      signature: createModelMock(),
      user: createModelMock(),
      webhook: createModelMock(),
      document: createModelMock(),
      documentVersion: createModelMock(),
      auditRecord: createModelMock(),
      auditFinding: createModelMock(),
      comment: createModelMock(),
      qTask: createModelMock(),
      complaint: createModelMock(),
      pMSEntry: createModelMock(),
      uDI: createModelMock(),
      computerizedSystem: createModelMock(),
      periodicReview: createModelMock(),
      supplierPortalLink: createModelMock(),
      supplierAudit: createModelMock(),
      trainingPlan: createModelMock(),
      workflowTemplate: createModelMock(),
      workflowStep: createModelMock(),
      workflowExecution: createModelMock(),
      workflowAction: createModelMock(),
      changeControl: createModelMock(),
      changeTask: createModelMock(),
      deviation: createModelMock(),
      notification: createModelMock(),
      customDashboard: createModelMock(),
      dashboardWidget: createModelMock(),
      supplier: createModelMock(),
      batchRecord: createModelMock(),
      batchStep: createModelMock(),
      stabilityStudy: createModelMock(),
      stabilitySample: createModelMock(),
      course: createModelMock(),
      trainingRecord: createModelMock(),
      monitoringPoint: createModelMock(),
      monitoringReading: createModelMock(),
    },
    dispatchWebhookMock: vi.fn(),
    bcryptCompareMock: vi.fn(),
    bcryptHashMock: vi.fn(),
  };
});

vi.mock('./lib/prisma.js', () => ({ prisma }));
vi.mock('./services/webhook.service.js', () => ({ dispatchWebhook: dispatchWebhookMock }));
vi.mock('bcryptjs', () => ({
  compare: bcryptCompareMock,
  hash: bcryptHashMock,
  default: {
    compare: bcryptCompareMock,
    hash: bcryptHashMock,
  },
}));

import { app } from './app.js';
import { signAccessToken } from './middleware/auth.js';

const uploadsRoot = path.resolve(process.cwd(), 'uploads');
const baseUser: JwtPayload = {
  userId: 'user-1',
  email: 'qa@example.com',
  role: 'qa_manager',
  orgId: 'org-1',
};

function resetModel(model: ModelMock) {
  Object.values(model).forEach((mock) => mock.mockReset());
}

function authHeaders(overrides: Partial<JwtPayload> = {}, headers?: HeadersInit): Headers {
  const token = signAccessToken({ ...baseUser, ...overrides });
  const merged = new Headers(headers);
  merged.set('Authorization', `Bearer ${token}`);
  return merged;
}

async function requestJson(
  url: string,
  {
    user,
    method = 'GET',
    body,
    headers,
  }: {
    user?: Partial<JwtPayload>;
    method?: string;
    body?: unknown;
    headers?: HeadersInit;
  } = {},
) {
  const requestHeaders = user ? authHeaders(user, headers) : new Headers(headers);
  if (body !== undefined && !(body instanceof FormData) && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const requestBody =
    body instanceof FormData ||
    typeof body === 'string' ||
    body instanceof Blob ||
    body instanceof URLSearchParams
      ? body
      : body !== undefined
        ? JSON.stringify(body)
        : undefined;

  return app.request(new Request(new URL(url, 'http://localhost'), {
    method,
    headers: requestHeaders,
    body: requestBody,
  }));
}

beforeEach(() => {
  dispatchWebhookMock.mockReset();
  bcryptCompareMock.mockReset();
  bcryptHashMock.mockReset();
  bcryptHashMock.mockResolvedValue('hashed-password');

  Object.values(prisma).forEach((model) => resetModel(model as ModelMock));

  prisma.auditLog.create.mockResolvedValue({
    id: 'audit-1',
    projectId: 'project-1',
    action: 'create',
  });
});

afterEach(() => {
  if (fs.existsSync(uploadsRoot)) {
    fs.rmSync(uploadsRoot, { recursive: true, force: true });
  }
});

describe('server app contracts', () => {
  it('returns API health status', async () => {
    const response = await app.request('/api/health');

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: 'ok',
      version: '5.0.0',
    });
  });

  it('creates a project with workspace fallback and lists server projects', async () => {
    prisma.workspace.findFirst.mockResolvedValue({ id: 'ws-1' });
    prisma.project.create.mockImplementation(async ({ data }) => ({
      id: 'project-1',
      createdAt: new Date('2026-01-01T00:00:00Z'),
      updatedAt: new Date('2026-01-01T00:00:00Z'),
      ...data,
    }));
    prisma.workspace.findMany.mockResolvedValue([{ id: 'ws-1' }]);
    prisma.project.findMany.mockResolvedValue([
      {
        id: 'project-1',
        workspaceId: 'ws-1',
        name: 'Alpha',
      },
    ]);

    const createResponse = await requestJson('/api/projects', {
      user: baseUser,
      method: 'POST',
      body: { name: 'Alpha', description: 'Server-backed project' },
    });

    expect(createResponse.status).toBe(201);
    await expect(createResponse.json()).resolves.toMatchObject({
      project: {
        id: 'project-1',
        workspaceId: 'ws-1',
        name: 'Alpha',
        owner: baseUser.email,
      },
    });
    expect(prisma.project.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        workspaceId: 'ws-1',
        name: 'Alpha',
        owner: baseUser.email,
      }),
    }));
    expect(prisma.auditLog.create).toHaveBeenCalledTimes(1);

    const listResponse = await requestJson('/api/projects', { user: baseUser });

    expect(listResponse.status).toBe(200);
    await expect(listResponse.json()).resolves.toEqual({
      projects: [
        {
          id: 'project-1',
          workspaceId: 'ws-1',
          name: 'Alpha',
        },
      ],
    });
  });

  it('verifies the current user password for server-side signatures', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: baseUser.email,
      name: 'QA User',
      passwordHash: 'stored-hash',
      role: baseUser.role,
      orgId: baseUser.orgId,
    });
    bcryptCompareMock.mockResolvedValue(true);

    const response = await requestJson('/api/auth/verify-password', {
      user: baseUser,
      method: 'POST',
      body: { password: 'correct horse battery staple' },
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ valid: true });
  });

  it('blocks delete operations for qa_engineers on protected core routes', async () => {
    const projectResponse = await requestJson('/api/projects/project-1', {
      user: { ...baseUser, role: 'qa_engineer' },
      method: 'DELETE',
    });
    const requirementResponse = await requestJson('/api/requirements/req-1', {
      user: { ...baseUser, role: 'qa_engineer' },
      method: 'DELETE',
    });
    const evidenceResponse = await requestJson('/api/evidence/evidence-1', {
      user: { ...baseUser, role: 'qa_engineer' },
      method: 'DELETE',
    });

    expect(projectResponse.status).toBe(403);
    expect(requirementResponse.status).toBe(403);
    expect(evidenceResponse.status).toBe(403);
    expect(prisma.project.delete).not.toHaveBeenCalled();
    expect(prisma.requirement.delete).not.toHaveBeenCalled();
    expect(prisma.evidence.delete).not.toHaveBeenCalled();
  });

  it('creates and lists requirements with wrapped responses', async () => {
    prisma.requirement.count.mockResolvedValue(0);
    prisma.requirement.create.mockImplementation(async ({ data }) => ({
      id: 'req-1',
      createdAt: new Date('2026-01-02T00:00:00Z'),
      updatedAt: new Date('2026-01-02T00:00:00Z'),
      ...data,
    }));
    prisma.requirement.findMany.mockResolvedValue([
      {
        id: 'req-1',
        projectId: 'project-1',
        seqId: 'REQ-001',
        title: 'Requirement A',
        status: 'Draft',
      },
    ]);

    const createResponse = await requestJson('/api/requirements', {
      user: baseUser,
      method: 'POST',
      body: { projectId: 'project-1', title: 'Requirement A', description: 'Traceable requirement' },
    });

    expect(createResponse.status).toBe(201);
    await expect(createResponse.json()).resolves.toMatchObject({
      requirement: {
        id: 'req-1',
        projectId: 'project-1',
        seqId: 'REQ-001',
        title: 'Requirement A',
      },
    });
    expect(dispatchWebhookMock).toHaveBeenCalledWith('org-1', 'requirement.created', expect.any(Object));

    const listResponse = await requestJson('/api/requirements?projectId=project-1', { user: baseUser });

    expect(listResponse.status).toBe(200);
    await expect(listResponse.json()).resolves.toEqual({
      requirements: [
        {
          id: 'req-1',
          projectId: 'project-1',
          seqId: 'REQ-001',
          title: 'Requirement A',
          status: 'Draft',
        },
      ],
    });
  });

  it('updates and deletes requirements while unlinking server-backed tests', async () => {
    const existingRequirement = {
      id: 'req-1',
      projectId: 'project-1',
      seqId: 'REQ-001',
      title: 'Requirement A',
      description: 'Old description',
      status: 'Draft',
      tags: [],
      riskLevel: null,
      regulatoryRef: null,
      evidenceHints: [],
    };
    const updatedRequirement = {
      ...existingRequirement,
      title: 'Requirement B',
      status: 'Approved',
    };

    prisma.requirement.findUnique
      .mockResolvedValueOnce(existingRequirement)
      .mockResolvedValueOnce(existingRequirement);
    prisma.requirement.update.mockResolvedValue(updatedRequirement);
    prisma.test.findMany.mockResolvedValue([
      {
        id: 'test-1',
        projectId: 'project-1',
        linkedRequirementIds: ['req-1', 'req-2'],
      },
    ]);
    prisma.test.update.mockResolvedValue({
      id: 'test-1',
      linkedRequirementIds: ['req-2'],
    });
    prisma.requirement.delete.mockResolvedValue(existingRequirement);

    const updateResponse = await requestJson('/api/requirements/req-1', {
      user: baseUser,
      method: 'PUT',
      body: { title: 'Requirement B', status: 'Approved' },
    });

    expect(updateResponse.status).toBe(200);
    await expect(updateResponse.json()).resolves.toMatchObject({
      requirement: {
        id: 'req-1',
        title: 'Requirement B',
        status: 'Approved',
      },
    });

    const deleteResponse = await requestJson('/api/requirements/req-1', {
      user: baseUser,
      method: 'DELETE',
    });

    expect(deleteResponse.status).toBe(200);
    await expect(deleteResponse.json()).resolves.toEqual({ message: 'Requirement deleted' });
    expect(prisma.test.update).toHaveBeenCalledWith({
      where: { id: 'test-1' },
      data: { linkedRequirementIds: ['req-2'] },
    });
  });

  it('creates and updates tests through wrapped server contracts', async () => {
    prisma.test.count.mockResolvedValue(0);
    prisma.test.create.mockImplementation(async ({ data }) => ({
      id: 'test-1',
      createdAt: new Date('2026-01-03T00:00:00Z'),
      updatedAt: new Date('2026-01-03T00:00:00Z'),
      ...data,
    }));
    prisma.test.findUnique.mockResolvedValue({
      id: 'test-1',
      projectId: 'project-1',
      seqId: 'TST-001',
      title: 'Verification',
      description: '',
      status: 'Not Run',
      linkedRequirementIds: ['req-1'],
    });
    prisma.test.update.mockResolvedValue({
      id: 'test-1',
      projectId: 'project-1',
      seqId: 'TST-001',
      title: 'Verification',
      description: '',
      status: 'Failed',
      linkedRequirementIds: ['req-1'],
    });

    const createResponse = await requestJson('/api/tests', {
      user: baseUser,
      method: 'POST',
      body: { projectId: 'project-1', title: 'Verification', linkedRequirementIds: ['req-1'] },
    });

    expect(createResponse.status).toBe(201);
    await expect(createResponse.json()).resolves.toMatchObject({
      test: {
        id: 'test-1',
        seqId: 'TST-001',
        title: 'Verification',
      },
    });

    const updateResponse = await requestJson('/api/tests/test-1', {
      user: baseUser,
      method: 'PUT',
      body: { status: 'Failed' },
    });

    expect(updateResponse.status).toBe(200);
    await expect(updateResponse.json()).resolves.toMatchObject({
      test: {
        id: 'test-1',
        status: 'Failed',
      },
    });
    expect(dispatchWebhookMock).toHaveBeenCalledWith('org-1', 'test.failed', expect.any(Object));
  });

  it('requests and approves approvals through compatibility routes', async () => {
    const pendingApproval = {
      id: 'approval-1',
      projectId: 'project-1',
      entityType: 'requirement',
      entityId: 'req-1',
      status: 'pending',
      requestedBy: 'user-1',
      createdAt: new Date('2026-01-04T00:00:00Z'),
    };
    const approvedApproval = {
      ...pendingApproval,
      status: 'approved',
      reviewedBy: 'reviewer-1',
      reviewedAt: new Date('2026-01-04T01:00:00Z'),
      signatureId: 'sig-1',
      reason: 'Approved',
    };

    prisma.requirement.findUnique.mockResolvedValue({ projectId: 'project-1' });
    prisma.approval.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(pendingApproval);
    prisma.approval.create.mockResolvedValue(pendingApproval);
    prisma.approval.findUnique.mockResolvedValue(pendingApproval);
    prisma.signature.findUnique.mockResolvedValue({
      id: 'sig-1',
      projectId: 'project-1',
      entityType: 'requirement',
      entityId: 'req-1',
    });
    prisma.approval.update.mockResolvedValue(approvedApproval);

    const requestResponse = await requestJson('/api/approvals/requirement/req-1/request', {
      user: baseUser,
      method: 'POST',
    });

    expect(requestResponse.status).toBe(201);
    await expect(requestResponse.json()).resolves.toMatchObject({
      approval: {
        ...pendingApproval,
        createdAt: pendingApproval.createdAt.toISOString(),
      },
    });

    const approveResponse = await requestJson('/api/approvals/requirement/req-1/approve', {
      user: { ...baseUser, userId: 'reviewer-1', email: 'reviewer@example.com', role: 'reviewer' },
      method: 'POST',
      body: { signatureId: 'sig-1' },
    });

    expect(approveResponse.status).toBe(200);
    await expect(approveResponse.json()).resolves.toMatchObject({
      approval: {
        ...approvedApproval,
        createdAt: pendingApproval.createdAt.toISOString(),
        reviewedAt: approvedApproval.reviewedAt.toISOString(),
      },
    });
  });

  it('requires a reason when rejecting approvals', async () => {
    const pendingApproval = {
      id: 'approval-1',
      projectId: 'project-1',
      entityType: 'requirement',
      entityId: 'req-1',
      status: 'pending',
      requestedBy: 'user-1',
    };

    prisma.approval.findFirst.mockResolvedValue(pendingApproval);
    prisma.approval.findUnique.mockResolvedValue(pendingApproval);

    const response = await requestJson('/api/approvals/requirement/req-1/reject', {
      user: { ...baseUser, userId: 'reviewer-1', email: 'reviewer@example.com', role: 'reviewer' },
      method: 'POST',
      body: {},
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: 'reason is required when rejecting an approval',
    });
  });

  it('enforces approval permissions for request and review actions', async () => {
    const requestResponse = await requestJson('/api/approvals/requirement/req-1/request', {
      user: { ...baseUser, userId: 'reviewer-1', email: 'reviewer@example.com', role: 'reviewer' },
      method: 'POST',
    });
    const approveResponse = await requestJson('/api/approvals/requirement/req-1/approve', {
      user: { ...baseUser, role: 'qa_engineer' },
      method: 'POST',
      body: { signatureId: 'sig-1' },
    });

    expect(requestResponse.status).toBe(403);
    expect(approveResponse.status).toBe(403);
    expect(prisma.approval.create).not.toHaveBeenCalled();
    expect(prisma.approval.update).not.toHaveBeenCalled();
  });

  it('creates signatures with password verification and lists them by entity', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: baseUser.email,
      name: 'QA User',
      passwordHash: 'stored-hash',
      role: baseUser.role,
      orgId: baseUser.orgId,
    });
    bcryptCompareMock.mockResolvedValue(true);
    prisma.signature.create.mockImplementation(async ({ data }) => ({
      id: 'sig-1',
      timestamp: new Date('2026-01-05T00:00:00Z'),
      ...data,
    }));
    prisma.signature.findMany.mockResolvedValue([
      {
        id: 'sig-1',
        projectId: 'project-1',
        entityType: 'requirement',
        entityId: 'req-1',
        meaning: 'approved',
      },
    ]);

    const createResponse = await requestJson('/api/signatures', {
      user: baseUser,
      method: 'POST',
      body: {
        projectId: 'project-1',
        entityType: 'requirement',
        entityId: 'req-1',
        meaning: 'approved',
        reason: 'Ready for release',
        password: 'correct horse battery staple',
      },
    });

    expect(createResponse.status).toBe(201);
    await expect(createResponse.json()).resolves.toMatchObject({
      signature: {
        id: 'sig-1',
        projectId: 'project-1',
        meaning: 'approved',
      },
    });

    const listResponse = await requestJson('/api/signatures?entityType=requirement&entityId=req-1', {
      user: baseUser,
    });

    expect(listResponse.status).toBe(200);
    await expect(listResponse.json()).resolves.toEqual({
      signatures: [
        {
          id: 'sig-1',
          projectId: 'project-1',
          entityType: 'requirement',
          entityId: 'req-1',
          meaning: 'approved',
        },
      ],
    });
  });

  it('blocks approval-style signatures for roles without approval permission', async () => {
    const response = await requestJson('/api/signatures', {
      user: { ...baseUser, role: 'qa_engineer' },
      method: 'POST',
      body: {
        projectId: 'project-1',
        entityType: 'requirement',
        entityId: 'req-1',
        meaning: 'approved',
        reason: 'Ready for release',
        password: 'correct horse battery staple',
      },
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      message: 'Insufficient permissions: requires canApprove',
    });
    expect(prisma.signature.create).not.toHaveBeenCalled();
  });

  it('lists, measures completeness, downloads, and deletes evidence records', async () => {
    const storagePath = path.join('/tmp', `qatrial-evidence-${Date.now()}-${Math.random().toString(16).slice(2)}.txt`);
    fs.writeFileSync(storagePath, 'hello evidence');

    const evidenceRecord = {
      id: 'evidence-1',
      fileName: 'evidence.txt',
      storagePath,
      fileSize: 14,
      mimeType: 'text/plain',
      projectId: 'project-1',
      entityType: 'requirement',
      entityId: 'req-1',
    };

    prisma.evidence.findMany
      .mockResolvedValueOnce([evidenceRecord])
      .mockResolvedValueOnce([
        { entityType: 'requirement', entityId: 'req-1' },
        { entityType: 'test', entityId: 'test-1' },
      ]);
    prisma.requirement.findMany.mockResolvedValue([
      { id: 'req-1', seqId: 'REQ-001', title: 'Requirement A' },
      { id: 'req-2', seqId: 'REQ-002', title: 'Requirement B' },
    ]);
    prisma.test.findMany.mockResolvedValue([
      { id: 'test-1', seqId: 'TST-001', title: 'Verification A' },
    ]);
    prisma.evidence.findUnique
      .mockResolvedValueOnce(evidenceRecord)
      .mockResolvedValueOnce(evidenceRecord);
    prisma.evidence.delete.mockResolvedValue({ id: 'evidence-1' });

    const listResponse = await requestJson('/api/evidence?projectId=project-1&entityType=requirement&entityId=req-1', {
      user: baseUser,
    });

    expect(listResponse.status).toBe(200);
    await expect(listResponse.json()).resolves.toEqual({
      evidence: [evidenceRecord],
    });

    const completenessResponse = await requestJson('/api/evidence/completeness?projectId=project-1', {
      user: baseUser,
    });

    expect(completenessResponse.status).toBe(200);
    await expect(completenessResponse.json()).resolves.toMatchObject({
      summary: {
        requirements: { total: 2, withEvidence: 1 },
        tests: { total: 1, withEvidence: 1 },
      },
    });

    const downloadResponse = await requestJson('/api/evidence/evidence-1/download', {
      user: baseUser,
    });

    expect(downloadResponse.status).toBe(200);
    await expect(downloadResponse.text()).resolves.toBe('hello evidence');

    const deleteResponse = await requestJson('/api/evidence/evidence-1', {
      user: baseUser,
      method: 'DELETE',
    });

    expect(deleteResponse.status).toBe(200);
    await expect(deleteResponse.json()).resolves.toEqual({ message: 'Evidence deleted' });
    expect(fs.existsSync(storagePath)).toBe(false);
  });

  it('lists audit logs and exports them as CSV', async () => {
    const auditEntry = {
      id: 'audit-1',
      timestamp: new Date('2026-01-07T00:00:00Z'),
      userId: 'user-1',
      action: 'approve',
      entityType: 'requirement',
      entityId: 'req-1',
      reason: 'Approved',
    };

    prisma.project.findFirst.mockResolvedValue({
      id: 'project-1',
      name: 'Alpha',
      workspaceId: 'ws-1',
    });
    prisma.auditLog.findMany
      .mockResolvedValueOnce([auditEntry])
      .mockResolvedValueOnce([auditEntry]);
    prisma.auditLog.count.mockResolvedValue(1);

    const listResponse = await requestJson('/api/audit?projectId=project-1&limit=25&offset=0', {
      user: baseUser,
    });

    expect(listResponse.status).toBe(200);
    await expect(listResponse.json()).resolves.toEqual({
      auditLogs: [
        {
          ...auditEntry,
          timestamp: auditEntry.timestamp.toISOString(),
        },
      ],
      total: 1,
      limit: 25,
      offset: 0,
    });

    const exportResponse = await requestJson('/api/audit/export?projectId=project-1&format=csv', {
      user: baseUser,
    });

    expect(exportResponse.status).toBe(200);
    expect(exportResponse.headers.get('content-type')).toContain('text/csv');
    await expect(exportResponse.text()).resolves.toContain('"approve"');
  });

  it('exports project data and CSV only for accessible projects with export permission', async () => {
    const projectRecord = {
      id: 'project-1',
      workspaceId: 'ws-1',
      name: 'Alpha',
      description: 'Server export target',
      owner: 'qa@example.com',
      version: '1.0',
      country: 'US',
      vertical: 'medical_devices',
      modules: [],
      type: 'software',
    };

    prisma.project.findFirst.mockResolvedValue(projectRecord);
    prisma.project.findUnique.mockResolvedValue(projectRecord);
    prisma.requirement.findMany.mockResolvedValue([
      {
        id: 'req-1',
        projectId: 'project-1',
        seqId: 'REQ-001',
        title: 'Requirement A',
        description: '',
        status: 'Draft',
        tags: [],
        riskLevel: null,
        regulatoryRef: null,
        createdAt: new Date('2026-01-09T00:00:00Z'),
        updatedAt: new Date('2026-01-09T00:00:00Z'),
      },
    ]);
    prisma.test.findMany.mockResolvedValue([
      {
        id: 'test-1',
        projectId: 'project-1',
        seqId: 'TST-001',
        title: 'Verification A',
        description: '',
        status: 'Passed',
        linkedRequirementIds: ['req-1'],
        createdAt: new Date('2026-01-09T00:00:00Z'),
        updatedAt: new Date('2026-01-09T00:00:00Z'),
      },
    ]);
    prisma.risk.findMany.mockResolvedValue([]);
    prisma.cAPA.findMany.mockResolvedValue([]);
    prisma.approval.findMany.mockResolvedValue([]);
    prisma.signature.findMany.mockResolvedValue([]);
    prisma.auditLog.findMany.mockResolvedValue([]);
    prisma.evidence.findMany.mockResolvedValue([]);

    const overviewResponse = await requestJson('/api/export/project-1', {
      user: baseUser,
    });
    const csvResponse = await requestJson('/api/export/project-1/csv?type=requirements', {
      user: baseUser,
    });

    expect(overviewResponse.status).toBe(200);
    await expect(overviewResponse.json()).resolves.toMatchObject({
      projectId: 'project-1',
      projectName: 'Alpha',
      counts: {
        requirements: 1,
        tests: 1,
      },
    });

    expect(csvResponse.status).toBe(200);
    expect(csvResponse.headers.get('content-type')).toContain('text/csv');
    await expect(csvResponse.text()).resolves.toContain('REQ-001');
  });

  it('blocks export endpoints for reviewer role', async () => {
    const response = await requestJson('/api/export/project-1/csv?type=requirements', {
      user: { ...baseUser, userId: 'reviewer-1', email: 'reviewer@example.com', role: 'reviewer' },
    });

    expect(response.status).toBe(403);
    expect(prisma.project.findFirst).not.toHaveBeenCalled();
  });

  it('serves team data and supports admin invites', async () => {
    prisma.organization.findUnique.mockResolvedValue({ name: 'QA Org' });
    prisma.user.findMany.mockResolvedValue([
      {
        id: 'user-1',
        email: baseUser.email,
        name: 'QA User',
        role: baseUser.role,
        createdAt: new Date('2026-01-08T00:00:00Z'),
      },
    ]);
    prisma.user.findUnique.mockResolvedValueOnce(null);
    prisma.user.create.mockResolvedValue({
      id: 'user-2',
      email: 'new.member@example.com',
      name: 'New Member',
      role: 'qa_engineer',
    });

    const teamResponse = await requestJson('/api/users/team', { user: baseUser });

    expect(teamResponse.status).toBe(200);
    await expect(teamResponse.json()).resolves.toMatchObject({
      orgName: 'QA Org',
      members: [
        {
          id: 'user-1',
          email: baseUser.email,
        },
      ],
    });

    const inviteResponse = await requestJson('/api/users/invite', {
      user: { ...baseUser, role: 'admin' },
      method: 'POST',
      body: {
        email: 'new.member@example.com',
        name: 'New Member',
        role: 'qa_engineer',
      },
    });

    expect(inviteResponse.status).toBe(201);
    await expect(inviteResponse.json()).resolves.toMatchObject({
      user: {
        id: 'user-2',
        email: 'new.member@example.com',
        name: 'New Member',
        role: 'qa_engineer',
      },
      temporaryPassword: expect.any(String),
    });
  });

  it('blocks approval-stage document review for users without approval permission', async () => {
    prisma.project.findFirst.mockResolvedValue({
      id: 'project-1',
      name: 'Alpha',
      workspaceId: 'ws-1',
    });
    prisma.document.findUnique.mockResolvedValue({
      id: 'doc-1',
      projectId: 'project-1',
      status: 'in_review',
      versions: [{ id: 'ver-1' }],
    });

    const response = await requestJson('/api/documents/doc-1/review', {
      user: { ...baseUser, role: 'qa_engineer' },
      method: 'PUT',
      body: { status: 'approved' },
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      message: 'Insufficient permissions: requires canApprove',
    });
    expect(prisma.documentVersion.update).not.toHaveBeenCalled();
    expect(prisma.document.update).not.toHaveBeenCalled();
  });

  it('allows assignees to complete their own tasks while blocking broader edits without edit permission', async () => {
    const existingTask = {
      id: 'task-1',
      projectId: 'project-1',
      title: 'Review deviation',
      description: '',
      assigneeId: 'reviewer-1',
      assigneeName: 'Reviewer',
      priority: 'medium',
      status: 'open',
    };

    prisma.project.findFirst.mockResolvedValue({
      id: 'project-1',
      name: 'Alpha',
      workspaceId: 'ws-1',
    });
    prisma.qTask.findUnique.mockResolvedValue(existingTask);
    prisma.qTask.update.mockResolvedValue({
      ...existingTask,
      status: 'completed',
      completedAt: new Date('2026-01-10T00:00:00Z'),
    });

    const completeResponse = await requestJson('/api/tasks/task-1/complete', {
      user: { ...baseUser, userId: 'reviewer-1', email: 'reviewer@example.com', role: 'reviewer' },
      method: 'PUT',
    });

    expect(completeResponse.status).toBe(200);
    await expect(completeResponse.json()).resolves.toMatchObject({
      task: {
        id: 'task-1',
        status: 'completed',
      },
    });

    const updateResponse = await requestJson('/api/tasks/task-1', {
      user: { ...baseUser, userId: 'reviewer-1', email: 'reviewer@example.com', role: 'reviewer' },
      method: 'PUT',
      body: { title: 'Retitle task' },
    });

    expect(updateResponse.status).toBe(403);
    await expect(updateResponse.json()).resolves.toEqual({
      message: 'Not authorized to update this task',
    });
    expect(prisma.qTask.update).toHaveBeenCalledTimes(1);
  });

  it('rejects comment thread access for projects outside the caller org scope', async () => {
    prisma.project.findFirst.mockResolvedValue(null);

    const response = await requestJson('/api/comments?entityType=requirement&entityId=req-1&projectId=project-2', {
      user: baseUser,
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'Project not found',
    });
    expect(prisma.comment.findMany).not.toHaveBeenCalled();
  });

  it('blocks workflow actions for users outside the current step role', async () => {
    prisma.project.findFirst.mockResolvedValue({
      id: 'project-1',
      name: 'Alpha',
      workspaceId: 'ws-1',
    });
    prisma.workflowExecution.findUnique.mockResolvedValue({
      id: 'exec-1',
      projectId: 'project-1',
      currentStep: 0,
      status: 'active',
      template: {
        id: 'tpl-1',
        orgId: 'org-1',
        name: 'Deviation Review',
        steps: [
          {
            id: 'step-1',
            order: 0,
            name: 'QA Approval',
            assigneeRole: 'qa_manager',
            requiredApprovers: 1,
            logic: 'and',
            skipCondition: null,
            rejectAction: 'cancel',
            rejectTarget: null,
          },
        ],
      },
      actions: [],
    });

    const response = await requestJson('/api/workflows/executions/exec-1/act', {
      user: { ...baseUser, userId: 'reviewer-1', email: 'reviewer@example.com', role: 'reviewer' },
      method: 'PUT',
      body: { action: 'approved' },
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      message: 'Current step requires role qa_manager',
    });
    expect(prisma.workflowAction.create).not.toHaveBeenCalled();
  });

  it('surfaces delegated workflow executions in the pending inbox for the delegate', async () => {
    prisma.project.findMany.mockResolvedValue([{ id: 'project-1' }]);
    prisma.workflowExecution.findMany.mockResolvedValue([
      {
        id: 'exec-1',
        projectId: 'project-1',
        currentStep: 0,
        status: 'active',
        startedAt: new Date('2026-01-11T00:00:00Z'),
        template: {
          id: 'tpl-1',
          name: 'Deviation Review',
          steps: [
            {
              id: 'step-1',
              order: 0,
              name: 'QA Approval',
              assigneeRole: 'qa_manager',
              requiredApprovers: 1,
              slaHours: null,
            },
          ],
        },
        actions: [
          {
            id: 'action-1',
            executionId: 'exec-1',
            stepOrder: 0,
            userId: 'user-1',
            userName: 'qa@example.com',
            action: 'delegated',
            delegatedTo: 'reviewer@example.com',
            reason: 'Delegate review',
            timestamp: new Date('2026-01-11T01:00:00Z'),
          },
        ],
      },
    ]);

    const response = await requestJson('/api/workflows/executions/my-pending', {
      user: { ...baseUser, userId: 'reviewer-1', email: 'reviewer@example.com', role: 'reviewer' },
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      executions: [
        {
          id: 'exec-1',
          projectId: 'project-1',
        },
      ],
    });
  });

  it('blocks audit schedule access for inaccessible projects', async () => {
    prisma.project.findFirst.mockResolvedValue(null);

    const response = await requestJson('/api/audit-records/schedule?projectId=project-2', {
      user: baseUser,
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'Project not found',
    });
    expect(prisma.auditRecord.findMany).not.toHaveBeenCalled();
  });

  it('blocks change-control creation for roles without edit permission', async () => {
    const response = await requestJson('/api/change-control', {
      user: { ...baseUser, userId: 'reviewer-1', email: 'reviewer@example.com', role: 'reviewer' },
      method: 'POST',
      body: {
        projectId: 'project-1',
        title: 'Supplier process change',
      },
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      message: 'Insufficient permissions: requires canEdit',
    });
    expect(prisma.changeControl.create).not.toHaveBeenCalled();
  });

  it('rejects change-control list access for inaccessible projects', async () => {
    prisma.project.findFirst.mockResolvedValue(null);

    const response = await requestJson('/api/change-control?projectId=project-2', {
      user: baseUser,
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'Project not found',
    });
    expect(prisma.changeControl.findMany).not.toHaveBeenCalled();
  });

  it('blocks deviation root-cause updates without edit permission', async () => {
    const response = await requestJson('/api/deviations/dev-1/root-cause', {
      user: { ...baseUser, userId: 'reviewer-1', email: 'reviewer@example.com', role: 'reviewer' },
      method: 'PUT',
      body: { rootCause: 'Training gap' },
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      message: 'Insufficient permissions: requires canEdit',
    });
    expect(prisma.deviation.update).not.toHaveBeenCalled();
  });

  it('scopes workflow template lookups to the caller organization', async () => {
    prisma.workflowTemplate.findFirst.mockResolvedValue(null);

    const response = await requestJson('/api/workflows/templates/template-2', {
      user: baseUser,
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'Template not found',
    });
  });

  it('blocks complaint list access for inaccessible projects', async () => {
    prisma.project.findFirst.mockResolvedValue(null);

    const response = await requestJson('/api/complaints?projectId=project-2', {
      user: baseUser,
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'Project not found',
    });
    expect(prisma.complaint.findMany).not.toHaveBeenCalled();
  });

  it('blocks complaint deletion for roles without delete permission', async () => {
    const response = await requestJson('/api/complaints/complaint-1', {
      user: { ...baseUser, role: 'qa_engineer' },
      method: 'DELETE',
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      message: 'Insufficient permissions: requires canDelete',
    });
    expect(prisma.complaint.delete).not.toHaveBeenCalled();
  });

  it('blocks PMS summary access for inaccessible projects', async () => {
    prisma.project.findFirst.mockResolvedValue(null);

    const response = await requestJson('/api/pms/project-2/summary', {
      user: baseUser,
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'Project not found',
    });
    expect(prisma.pMSEntry.findMany).not.toHaveBeenCalled();
  });

  it('blocks UDI export access for inaccessible projects', async () => {
    prisma.project.findFirst.mockResolvedValue(null);

    const response = await requestJson('/api/udi/gudid-export?projectId=project-2', {
      user: baseUser,
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'Project not found',
    });
    expect(prisma.uDI.findMany).not.toHaveBeenCalled();
  });

  it('blocks analytics access for inaccessible projects', async () => {
    prisma.project.findFirst.mockResolvedValue(null);

    const response = await requestJson('/api/analytics/project-2/anomalies', {
      user: baseUser,
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'Project not found',
    });
    expect(prisma.deviation.findMany).not.toHaveBeenCalled();
    expect(prisma.supplier.findMany).not.toHaveBeenCalled();
  });

  it('scopes computerized system lookups to the caller organization', async () => {
    prisma.computerizedSystem.findFirst.mockResolvedValue(null);

    const response = await requestJson('/api/systems/system-2', {
      user: baseUser,
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'System not found',
    });
  });

  it('scopes KPI dashboard lookups to the caller organization', async () => {
    prisma.customDashboard.findFirst.mockResolvedValue(null);

    const response = await requestJson('/api/kpi/dashboards/dashboard-2', {
      user: baseUser,
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'Dashboard not found',
    });
  });

  it('scopes supplier detail lookups to the caller organization', async () => {
    prisma.supplier.findFirst.mockResolvedValue(null);

    const response = await requestJson('/api/suppliers/supplier-2', {
      user: baseUser,
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'Supplier not found',
    });
  });

  it('blocks supplier portal link creation for suppliers outside the caller organization', async () => {
    prisma.supplier.findFirst.mockResolvedValue(null);

    const response = await requestJson('/api/supplier-portal/create', {
      user: baseUser,
      method: 'POST',
      body: { supplierId: 'supplier-2', expiresInDays: 30 },
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'Supplier not found',
    });
    expect(prisma.supplierPortalLink.create).not.toHaveBeenCalled();
  });

  it('blocks training assignment for roles without edit permission', async () => {
    const response = await requestJson('/api/training/records', {
      user: { ...baseUser, role: 'reviewer' },
      method: 'POST',
      body: { userId: 'user-2', courseId: 'course-1' },
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      message: 'Insufficient permissions: requires canEdit',
    });
    expect(prisma.trainingRecord.create).not.toHaveBeenCalled();
  });

  it('scopes training record listing to the caller organization', async () => {
    prisma.trainingRecord.findMany.mockResolvedValue([]);

    const response = await requestJson('/api/training/records?userId=user-2', {
      user: baseUser,
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      records: [],
    });
    expect(prisma.trainingRecord.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        userId: 'user-2',
        course: { orgId: 'org-1' },
      }),
    }));
  });

  it('blocks training record updates outside the caller organization', async () => {
    prisma.trainingRecord.findUnique.mockResolvedValue({
      id: 'record-1',
      userId: 'user-2',
      status: 'assigned',
      completedAt: null,
      course: {
        id: 'course-2',
        orgId: 'org-2',
      },
    });

    const response = await requestJson('/api/training/records/record-1', {
      user: baseUser,
      method: 'PUT',
      body: { status: 'completed' },
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'Training record not found',
    });
    expect(prisma.trainingRecord.update).not.toHaveBeenCalled();
  });

  it('blocks batch list access for inaccessible projects', async () => {
    prisma.project.findFirst.mockResolvedValue(null);

    const response = await requestJson('/api/batches?projectId=project-2', {
      user: baseUser,
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'Project not found',
    });
    expect(prisma.batchRecord.findMany).not.toHaveBeenCalled();
  });

  it('blocks batch release for roles without approve permission', async () => {
    const response = await requestJson('/api/batches/batch-1/release', {
      user: { ...baseUser, role: 'qa_engineer' },
      method: 'PUT',
      body: { password: 'secret' },
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      message: 'Insufficient permissions: requires canApprove',
    });
    expect(prisma.batchRecord.findUnique).not.toHaveBeenCalled();
  });

  it('scopes stability study detail to accessible projects', async () => {
    prisma.stabilityStudy.findUnique.mockResolvedValue({
      id: 'study-2',
      projectId: 'project-2',
      productName: 'Sterile Buffer',
    });
    prisma.project.findFirst.mockResolvedValue(null);

    const response = await requestJson('/api/stability/study-2', {
      user: baseUser,
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'Stability study not found',
    });
  });

  it('blocks stability sample creation for roles without edit permission', async () => {
    const response = await requestJson('/api/stability/study-1/samples', {
      user: { ...baseUser, role: 'reviewer' },
      method: 'POST',
      body: { timePointMonths: 3, parameter: 'Assay' },
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      message: 'Insufficient permissions: requires canEdit',
    });
    expect(prisma.stabilitySample.create).not.toHaveBeenCalled();
  });

  it('blocks environmental monitoring point reads outside the caller organization', async () => {
    prisma.monitoringPoint.findUnique.mockResolvedValue({
      id: 'point-2',
      projectId: 'project-2',
      name: 'Room A',
      zone: 'Fill line',
    });
    prisma.project.findFirst.mockResolvedValue(null);

    const response = await requestJson('/api/envmon/points/point-2/readings', {
      user: baseUser,
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'Monitoring point not found',
    });
    expect(prisma.monitoringReading.findMany).not.toHaveBeenCalled();
  });

  it('blocks environmental monitoring reading creation for roles without edit permission', async () => {
    const response = await requestJson('/api/envmon/points/point-1/readings', {
      user: { ...baseUser, role: 'reviewer' },
      method: 'POST',
      body: { value: 22.5 },
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      message: 'Insufficient permissions: requires canEdit',
    });
    expect(prisma.monitoringReading.create).not.toHaveBeenCalled();
  });
});
