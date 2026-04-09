import { createContext, useContext, type ReactNode } from 'react';
import type { ProjectMeta, Requirement, Test } from '../types';

type ServerProject = ProjectMeta & { id: string };

interface ProjectDataContextValue {
  isServerMode: boolean;
  loading: boolean;
  projects: ServerProject[];
  activeProject: ServerProject | null;
  setActiveProject: (project: ServerProject | null) => void;
  refetchProjects: () => Promise<void>;
  createRequirement: (data: Partial<Requirement>) => Promise<unknown>;
  updateRequirement: (id: string, data: Partial<Requirement>) => Promise<unknown>;
  removeRequirement: (id: string) => Promise<unknown>;
  createTest: (data: Partial<Test>) => Promise<unknown>;
  updateTest: (id: string, data: Partial<Test>) => Promise<unknown>;
  removeTest: (id: string) => Promise<unknown>;
  refetchAudit: () => Promise<void>;
}

const ProjectDataContext = createContext<ProjectDataContextValue | null>(null);

export function ProjectDataProvider({
  value,
  children,
}: {
  value: ProjectDataContextValue;
  children: ReactNode;
}) {
  return (
    <ProjectDataContext.Provider value={value}>
      {children}
    </ProjectDataContext.Provider>
  );
}

export function useProjectData() {
  const context = useContext(ProjectDataContext);

  if (!context) {
    throw new Error('useProjectData must be used within a ProjectDataProvider');
  }

  return context;
}
