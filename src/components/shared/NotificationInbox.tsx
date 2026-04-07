import { useState, useRef, useEffect, useCallback } from 'react';
import type { AppNotification } from '../../types';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpCircle,
  ClipboardList,
  AtSign,
  Calendar,
  Check,
  FileText,
  GraduationCap,
  TriangleAlert,
  Trash2,
  X,
} from 'lucide-react';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useAppMode } from '../../hooks/useAppMode';
import { apiFetch } from '../../lib/apiClient';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  approval_needed: <CheckCircle2 className="w-4 h-4 text-accent" />,
  task_overdue: <Clock className="w-4 h-4 text-danger" />,
  capa_deadline: <AlertTriangle className="w-4 h-4 text-warning" />,
  deviation_opened: <TriangleAlert className="w-4 h-4 text-danger" />,
  workflow_escalation: <ArrowUpCircle className="w-4 h-4 text-danger" />,
  comment_mention: <AtSign className="w-4 h-4 text-accent" />,
  document_review: <FileText className="w-4 h-4 text-accent" />,
  training_due: <GraduationCap className="w-4 h-4 text-warning" />,
  audit_reminder: <Calendar className="w-4 h-4 text-text-secondary" />,
  status_change: <ClipboardList className="w-4 h-4 text-accent" />,
  mention: <AtSign className="w-4 h-4 text-accent" />,
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function NotificationInbox() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { mode } = useAppMode();
  const isServer = mode === 'server';

  // Standalone mode: use local store
  const localNotifications = useNotificationStore((s) => s.notifications);
  const localMarkRead = useNotificationStore((s) => s.markRead);
  const localMarkAllRead = useNotificationStore((s) => s.markAllRead);

  // Server mode state
  const [serverNotifications, setServerNotifications] = useState<AppNotification[]>([]);
  const [serverUnreadCount, setServerUnreadCount] = useState(0);

  const notifications = isServer ? serverNotifications : localNotifications;
  const unreadCount = isServer
    ? serverUnreadCount
    : localNotifications.filter((n) => !n.read).length;

  // Fetch from server
  const fetchNotifications = useCallback(async () => {
    if (!isServer) return;
    try {
      const res = await apiFetch<{ notifications: AppNotification[] }>('/notifications?limit=30');
      setServerNotifications(res.notifications);
    } catch {
      // silent
    }
  }, [isServer]);

  const fetchUnreadCount = useCallback(async () => {
    if (!isServer) return;
    try {
      const res = await apiFetch<{ count: number }>('/notifications/unread-count');
      setServerUnreadCount(res.count);
    } catch {
      // silent
    }
  }, [isServer]);

  // Poll unread count every 30s in server mode
  useEffect(() => {
    if (!isServer) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [isServer, fetchUnreadCount]);

  // Fetch full list when dropdown opens
  useEffect(() => {
    if (open && isServer) {
      fetchNotifications();
    }
  }, [open, isServer, fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [open]);

  const handleMarkRead = async (id: string) => {
    if (isServer) {
      try {
        await apiFetch(`/notifications/${id}/read`, { method: 'PUT' });
        setServerNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        setServerUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        // silent
      }
    } else {
      localMarkRead(id);
    }
  };

  const handleMarkAllRead = async () => {
    if (isServer) {
      try {
        await apiFetch('/notifications/read-all', { method: 'PUT' });
        setServerNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setServerUnreadCount(0);
      } catch {
        // silent
      }
    } else {
      localMarkAllRead();
    }
  };

  const handleDelete = async (id: string) => {
    if (isServer) {
      try {
        await apiFetch(`/notifications/${id}`, { method: 'DELETE' });
        const wasUnread = serverNotifications.find((n) => n.id === id && !n.read);
        setServerNotifications((prev) => prev.filter((n) => n.id !== id));
        if (wasUnread) setServerUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        // silent
      }
    }
  };

  const recent = notifications.slice(0, 30);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-1.5 rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-surface-hover transition-colors"
        title={t('notifications.title')}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center text-[10px] font-bold text-white bg-danger rounded-full px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-surface-elevated rounded-xl shadow-2xl border border-border z-50 flex flex-col max-h-[500px]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
            <h3 className="text-sm font-semibold text-text-primary">{t('notifications.title')}</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  {t('notifications.markAllRead')}
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-text-tertiary hover:text-text-secondary transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto">
            {recent.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-text-tertiary">
                {t('notifications.empty')}
              </div>
            ) : (
              recent.map((n) => (
                <div
                  key={n.id}
                  className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-surface-hover transition-colors border-b border-border last:border-b-0 ${
                    !n.read ? 'bg-accent-subtle/30' : ''
                  }`}
                >
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="flex gap-3 flex-1 min-w-0 text-left"
                  >
                    <div className="shrink-0 mt-0.5">
                      {TYPE_ICONS[n.type] ?? <Bell className="w-4 h-4 text-text-tertiary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm truncate ${
                          !n.read ? 'font-semibold text-text-primary' : 'text-text-secondary'
                        }`}
                      >
                        {n.title}
                      </p>
                      {n.message && (
                        <p className="text-xs text-text-tertiary truncate mt-0.5">{n.message}</p>
                      )}
                      <p className="text-xs text-text-tertiary mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.read && (
                      <div className="shrink-0 mt-1.5">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </div>
                    )}
                  </button>
                  {isServer && (
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="shrink-0 mt-0.5 p-1 rounded text-text-tertiary hover:text-danger hover:bg-danger/10 transition-colors"
                      title={t('common.delete')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
