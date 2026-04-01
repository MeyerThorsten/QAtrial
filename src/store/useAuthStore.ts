import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAuthStoreRef } from './useAuditStore';

// ── User roles for RBAC ─────────────────────────────────────────────────────

export type UserRole = 'admin' | 'qa_manager' | 'qa_engineer' | 'auditor' | 'reviewer';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  department?: string;
  title?: string;
  /** ISO timestamp of last login */
  lastLoginAt?: string;
  /** Whether the user's session is verified for signature operations */
  signatureVerified: boolean;
  /** ISO timestamp when signature verification expires (re-auth required) */
  signatureVerifiedUntil?: string;
}

// ── Role permissions matrix ──────────────────────────────────────────────────

export interface RolePermissions {
  canCreateRequirements: boolean;
  canEditRequirements: boolean;
  canDeleteRequirements: boolean;
  canCreateTests: boolean;
  canEditTests: boolean;
  canDeleteTests: boolean;
  canApprove: boolean;
  canSign: boolean;
  canGenerateReports: boolean;
  canConfigureAI: boolean;
  canManageUsers: boolean;
  canViewAuditTrail: boolean;
  canExportData: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    canCreateRequirements: true,
    canEditRequirements: true,
    canDeleteRequirements: true,
    canCreateTests: true,
    canEditTests: true,
    canDeleteTests: true,
    canApprove: true,
    canSign: true,
    canGenerateReports: true,
    canConfigureAI: true,
    canManageUsers: true,
    canViewAuditTrail: true,
    canExportData: true,
  },
  qa_manager: {
    canCreateRequirements: true,
    canEditRequirements: true,
    canDeleteRequirements: true,
    canCreateTests: true,
    canEditTests: true,
    canDeleteTests: true,
    canApprove: true,
    canSign: true,
    canGenerateReports: true,
    canConfigureAI: true,
    canManageUsers: false,
    canViewAuditTrail: true,
    canExportData: true,
  },
  qa_engineer: {
    canCreateRequirements: true,
    canEditRequirements: true,
    canDeleteRequirements: false,
    canCreateTests: true,
    canEditTests: true,
    canDeleteTests: false,
    canApprove: false,
    canSign: true,
    canGenerateReports: true,
    canConfigureAI: false,
    canManageUsers: false,
    canViewAuditTrail: true,
    canExportData: true,
  },
  auditor: {
    canCreateRequirements: false,
    canEditRequirements: false,
    canDeleteRequirements: false,
    canCreateTests: false,
    canEditTests: false,
    canDeleteTests: false,
    canApprove: false,
    canSign: false,
    canGenerateReports: true,
    canConfigureAI: false,
    canManageUsers: false,
    canViewAuditTrail: true,
    canExportData: true,
  },
  reviewer: {
    canCreateRequirements: false,
    canEditRequirements: false,
    canDeleteRequirements: false,
    canCreateTests: false,
    canEditTests: false,
    canDeleteTests: false,
    canApprove: true,
    canSign: true,
    canGenerateReports: false,
    canConfigureAI: false,
    canManageUsers: false,
    canViewAuditTrail: true,
    canExportData: false,
  },
};

// ── Auth store ───────────────────────────────────────────────────────────────

interface AuthState {
  currentUser: UserProfile | null;
  /** All registered users in this workspace */
  users: UserProfile[];

  // Actions
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  register: (data: { email: string; displayName: string; password: string; role: UserRole; department?: string; title?: string }) => { success: boolean; error?: string };
  updateProfile: (id: string, data: Partial<Pick<UserProfile, 'displayName' | 'department' | 'title'>>) => void;
  /** Verify identity for electronic signature (re-auth within session) */
  verifyForSignature: (password: string) => boolean;
  /** Check if current user's signature verification is still valid */
  isSignatureValid: () => boolean;
  /** Get permissions for current user */
  getPermissions: () => RolePermissions | null;
  hasPermission: (permission: keyof RolePermissions) => boolean;
}

/** Simple hash for client-side password storage (NOT production-grade — backend should handle this) */
function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `hash_${Math.abs(hash).toString(36)}`;
}

/** Signature verification window: 15 minutes */
const SIGNATURE_WINDOW_MS = 15 * 60 * 1000;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],

      login: (email, password) => {
        const user = get().users.find((u) => u.email === email.toLowerCase());
        if (!user) {
          return { success: false, error: 'User not found' };
        }
        const storedHash = localStorage.getItem(`qatrial:pw:${user.id}`);
        if (storedHash !== simpleHash(password)) {
          return { success: false, error: 'Invalid password' };
        }
        const updated = { ...user, lastLoginAt: new Date().toISOString(), signatureVerified: false };
        set({
          currentUser: updated,
          users: get().users.map((u) => u.id === user.id ? updated : u),
        });
        return { success: true };
      },

      logout: () => {
        set({ currentUser: null });
      },

      register: (data) => {
        const existing = get().users.find((u) => u.email === data.email.toLowerCase());
        if (existing) {
          return { success: false, error: 'Email already registered' };
        }
        const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const user: UserProfile = {
          id,
          email: data.email.toLowerCase(),
          displayName: data.displayName,
          role: data.role,
          department: data.department,
          title: data.title,
          signatureVerified: false,
        };
        localStorage.setItem(`qatrial:pw:${id}`, simpleHash(data.password));
        set({ users: [...get().users, user] });
        return { success: true };
      },

      updateProfile: (id, data) => {
        set({
          users: get().users.map((u) => u.id === id ? { ...u, ...data } : u),
          currentUser: get().currentUser?.id === id
            ? { ...get().currentUser!, ...data }
            : get().currentUser,
        });
      },

      verifyForSignature: (password) => {
        const user = get().currentUser;
        if (!user) return false;
        const storedHash = localStorage.getItem(`qatrial:pw:${user.id}`);
        if (storedHash !== simpleHash(password)) return false;

        const until = new Date(Date.now() + SIGNATURE_WINDOW_MS).toISOString();
        set({
          currentUser: { ...user, signatureVerified: true, signatureVerifiedUntil: until },
        });
        return true;
      },

      isSignatureValid: () => {
        const user = get().currentUser;
        if (!user?.signatureVerified || !user.signatureVerifiedUntil) return false;
        return new Date(user.signatureVerifiedUntil).getTime() > Date.now();
      },

      getPermissions: () => {
        const user = get().currentUser;
        if (!user) return null;
        return ROLE_PERMISSIONS[user.role];
      },

      hasPermission: (permission) => {
        const perms = get().getPermissions();
        return perms ? perms[permission] : false;
      },
    }),
    {
      name: 'qatrial:auth',
      partialize: (state) => ({
        currentUser: state.currentUser,
        users: state.users,
      }),
    }
  )
);

// Register with audit store to provide user identity
setAuthStoreRef(() => {
  const user = useAuthStore.getState().currentUser;
  return user ? { id: user.id, name: user.displayName } : null;
});
