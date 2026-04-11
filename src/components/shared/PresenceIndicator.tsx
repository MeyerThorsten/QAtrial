import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface PresenceUser {
  userId: string;
  userName?: string;
  entityType?: string;
  entityId?: string;
  lastSeen: string;
  status: 'active' | 'idle';
}

interface PresenceIndicatorProps {
  users: PresenceUser[];
}

const COLORS = [
  'bg-green-500',
  'bg-blue-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-rose-500',
];

function getColor(index: number): string {
  return COLORS[index % COLORS.length];
}

function getInitial(user: PresenceUser): string {
  if (user.userName) return user.userName.charAt(0).toUpperCase();
  return user.userId.charAt(0).toUpperCase();
}

export function PresenceIndicator({ users }: PresenceIndicatorProps) {
  const { t } = useTranslation();
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);

  if (users.length === 0) return null;

  const maxVisible = 5;
  const visible = users.slice(0, maxVisible);
  const overflow = users.length - maxVisible;

  return (
    <div className="flex items-center gap-0.5">
      <span className="text-xs text-text-tertiary mr-1">{t('realtime.online')}</span>
      <div className="flex -space-x-1.5">
        {visible.map((user, idx) => (
          <div
            key={user.userId}
            className="relative"
            onMouseEnter={() => setHoveredUserId(user.userId)}
            onMouseLeave={() => setHoveredUserId(null)}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-surface ${getColor(idx)}`}
            >
              {getInitial(user)}
            </div>
            {/* Status dot */}
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-surface ${
                user.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
              }`}
            />
            {/* Tooltip */}
            {hoveredUserId === user.userId && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-surface-elevated border border-border rounded-lg shadow-lg whitespace-nowrap z-50">
                <p className="text-xs font-medium text-text-primary">
                  {user.userName || user.userId}
                </p>
                {user.entityType && user.entityId && (
                  <p className="text-xs text-text-tertiary">
                    {t('realtime.viewing', { entity: `${user.entityType} ${user.entityId}` })}
                  </p>
                )}
                <p className="text-xs text-text-tertiary">
                  {user.status === 'active' ? t('realtime.active') : t('realtime.idle')}
                </p>
              </div>
            )}
          </div>
        ))}
        {overflow > 0 && (
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-surface-hover text-text-secondary border-2 border-surface">
            +{overflow}
          </div>
        )}
      </div>
    </div>
  );
}
