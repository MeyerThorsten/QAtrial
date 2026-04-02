import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../lib/apiClient';
import { Users, UserPlus, Shield, Pencil, Eye, Loader2, X } from 'lucide-react';

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface WorkspaceManagerProps {
  open: boolean;
  onClose: () => void;
}

const ROLE_OPTIONS = ['admin', 'editor', 'viewer'] as const;

function roleBadgeClass(role: string) {
  switch (role) {
    case 'admin':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'editor':
      return 'bg-accent-subtle text-accent-text border-accent/20';
    default:
      return 'bg-surface-secondary text-text-secondary border-border';
  }
}

function roleIcon(role: string) {
  switch (role) {
    case 'admin':
      return <Shield className="w-3.5 h-3.5" />;
    case 'editor':
      return <Pencil className="w-3.5 h-3.5" />;
    default:
      return <Eye className="w-3.5 h-3.5" />;
  }
}

export function WorkspaceManager({ open, onClose }: WorkspaceManagerProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(true);

  // Invite form
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('viewer');
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await apiFetch<{ orgName: string; members: TeamMember[] }>('/users/team');
        if (!cancelled) {
          setOrgName(data.orgName || 'Organization');
          setMembers(data.members || []);
        }
      } catch {
        // If endpoint not available, show at least the current user
        if (!cancelled && user) {
          setMembers([{ id: user.id, email: user.email, name: user.name, role: user.role }]);
          setOrgName('Organization');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [open, user]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteError(null);

    try {
      await apiFetch('/users/invite', {
        method: 'POST',
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      setInviteEmail('');
      // Refresh member list
      const data = await apiFetch<{ orgName: string; members: TeamMember[] }>('/users/team');
      setMembers(data.members || []);
    } catch (err: unknown) {
      setInviteError(err instanceof Error ? err.message : 'Invite failed');
    } finally {
      setInviting(false);
    }
  };

  const handleChangeRole = async (memberId: string, newRole: string) => {
    try {
      await apiFetch(`/users/${memberId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)));
    } catch {
      // Silently fail — could show toast
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onClose}>
      <div
        className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            <div>
              <h2 className="text-base font-semibold text-text-primary">{t('auth.team')}</h2>
              {orgName && <p className="text-xs text-text-tertiary">{orgName}</p>}
            </div>
          </div>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-accent" />
            </div>
          ) : (
            <>
              {/* Member list */}
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      member.id === user?.id
                        ? 'border-accent/30 bg-accent-subtle/30'
                        : 'border-border bg-surface-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-text-primary truncate">
                          {member.name}
                          {member.id === user?.id && (
                            <span className="ml-1.5 text-xs text-accent font-normal">({t('auth.currentUser')})</span>
                          )}
                        </div>
                        <div className="text-xs text-text-tertiary truncate">{member.email}</div>
                      </div>
                    </div>

                    {isAdmin && member.id !== user?.id ? (
                      <select
                        value={member.role}
                        onChange={(e) => handleChangeRole(member.id, e.target.value)}
                        className="text-xs px-2 py-1 bg-surface border border-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border ${roleBadgeClass(member.role)}`}>
                        {roleIcon(member.role)}
                        {member.role}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Invite (admin only) */}
              {isAdmin && (
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-1.5 mb-2">
                    <UserPlus className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-text-primary">{t('auth.inviteUser')}</span>
                  </div>
                  <form onSubmit={handleInvite} className="flex gap-2">
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder={t('auth.email')}
                      className="flex-1 px-3 py-1.5 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-text-tertiary"
                    />
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="px-2 py-1.5 text-sm bg-surface-secondary text-text-primary border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      disabled={inviting}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-accent rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                      {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : t('auth.inviteUser')}
                    </button>
                  </form>
                  {inviteError && (
                    <p className="text-xs text-red-500 mt-1">{inviteError}</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
