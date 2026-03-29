import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProjectMeta } from '../types';

interface ProjectState {
  project: ProjectMeta | null;
  setProject: (meta: ProjectMeta) => void;
  clearProject: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      project: null,
      setProject: (meta) => set({ project: meta }),
      clearProject: () => set({ project: null }),
    }),
    { name: 'qatrial:project' }
  )
);
