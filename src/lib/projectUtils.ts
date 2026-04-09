import type { ProjectMeta } from '../types';

export function getProjectId(project: ProjectMeta | null | undefined): string {
  return project?.id ?? project?.name ?? '';
}
