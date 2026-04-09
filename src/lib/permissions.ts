export type AppPermission = 'canView' | 'canEdit' | 'canApprove' | 'canAdmin' | 'canDelete' | 'canSign' | 'canExport';

const ROLE_PERMISSIONS: Record<string, Record<AppPermission, boolean>> = {
  admin: {
    canView: true,
    canEdit: true,
    canApprove: true,
    canAdmin: true,
    canDelete: true,
    canSign: true,
    canExport: true,
  },
  qa_manager: {
    canView: true,
    canEdit: true,
    canApprove: true,
    canAdmin: false,
    canDelete: true,
    canSign: true,
    canExport: true,
  },
  qa_engineer: {
    canView: true,
    canEdit: true,
    canApprove: false,
    canAdmin: false,
    canDelete: false,
    canSign: true,
    canExport: true,
  },
  auditor: {
    canView: true,
    canEdit: false,
    canApprove: false,
    canAdmin: false,
    canDelete: false,
    canSign: false,
    canExport: true,
  },
  reviewer: {
    canView: true,
    canEdit: false,
    canApprove: true,
    canAdmin: false,
    canDelete: false,
    canSign: true,
    canExport: false,
  },
  editor: {
    canView: true,
    canEdit: true,
    canApprove: false,
    canAdmin: false,
    canDelete: true,
    canSign: true,
    canExport: true,
  },
  viewer: {
    canView: true,
    canEdit: false,
    canApprove: false,
    canAdmin: false,
    canDelete: false,
    canSign: false,
    canExport: false,
  },
};

export function roleHasPermission(role: string | null | undefined, permission: AppPermission): boolean {
  if (!role) {
    return false;
  }

  return ROLE_PERMISSIONS[role]?.[permission] === true;
}
