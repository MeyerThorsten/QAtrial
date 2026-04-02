import { useState, useRef, useEffect } from 'react';
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
} from 'lucide-react';
import { useNotificationStore } from '../../store/useNotificationStore';
import type { NotificationType } from '../../types';

const TYPE_ICONS: Record<NotificationType, React.ReactNode> = {
  approval_needed: <CheckCircle2 className="w-4 h-4 text-accent" />,
  task_overdue: <Clock className="w-4 h-4 text-danger" />,
  capa_deadline: <AlertTriangle className="w-4 h-4 text-warning" />,
  workflow_escalation: <ArrowUpCircle className="w-4 h-4 text-danger" />,
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
  return `${days}d ago`;
}

export function NotificationBell() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const notifications = useNotificationStore((s) => s.notifications);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const unreadCount = notifications.filter((n) => !n.read).length;

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

  const recent = notifications.slice(0, 20);

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
        <div className="absolute right-0 top-full mt-2 w-80 bg-surface-elevated rounded-xl shadow-2xl border border-border z-50 flex flex-col max-h-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
            <h3 className="text-sm font-semibold text-text-primary">{t('notifications.title')}</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto">
            {recent.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-text-tertiary">
                {t('notifications.empty')}
              </div>
            ) : (
              recent.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { markRead(n.id); }}
                  className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-surface-hover transition-colors border-b border-border last:border-b-0 ${
                    !n.read ? 'bg-accent-subtle/30' : ''
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {TYPE_ICONS[n.type] ?? <Bell className="w-4 h-4 text-text-tertiary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${!n.read ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-text-tertiary truncate mt-0.5">{n.message}</p>
                    <p className="text-xs text-text-tertiary mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.read && (
                    <div className="shrink-0 mt-1.5">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
