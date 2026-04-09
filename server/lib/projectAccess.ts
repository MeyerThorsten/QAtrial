import { prisma } from './prisma.js';

export async function findAccessibleProject(projectId: string, orgId: string | null) {
  if (!orgId) {
    return null;
  }

  return prisma.project.findFirst({
    where: {
      id: projectId,
      workspace: { orgId },
    },
    select: {
      id: true,
      name: true,
      workspaceId: true,
    },
  });
}

export async function listAccessibleProjectIds(orgId: string | null): Promise<string[]> {
  if (!orgId) {
    return [];
  }

  const projects = await prisma.project.findMany({
    where: {
      workspace: { orgId },
    },
    select: { id: true },
  });

  return projects.map((project) => project.id);
}
