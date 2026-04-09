import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Reply, Edit3, Trash2, Send, X } from 'lucide-react';
import { useAppMode } from '../../hooks/useAppMode';
import { useAuth } from '../../hooks/useAuth';
import { apiFetch } from '../../lib/apiClient';
import type { Comment } from '../../types';

interface CommentThreadProps {
  entityType: string;
  entityId: string;
  projectId: string;
}

const LS_KEY = 'qatrial:comments';

function getLocalComments(entityType: string, entityId: string): Comment[] {
  try {
    const all = JSON.parse(localStorage.getItem(LS_KEY) || '[]') as Comment[];
    return all.filter((c) => c.entityType === entityType && c.entityId === entityId);
  } catch {
    return [];
  }
}

function saveLocalComment(comment: Comment) {
  try {
    const all = JSON.parse(localStorage.getItem(LS_KEY) || '[]') as Comment[];
    all.push(comment);
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  } catch {
    // silent
  }
}

function updateLocalComment(id: string, content: string) {
  try {
    const all = JSON.parse(localStorage.getItem(LS_KEY) || '[]') as Comment[];
    const updated = all.map((c) => (c.id === id ? { ...c, content, updatedAt: new Date().toISOString() } : c));
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
  } catch {
    // silent
  }
}

function deleteLocalComment(id: string) {
  try {
    const all = JSON.parse(localStorage.getItem(LS_KEY) || '[]') as Comment[];
    localStorage.setItem(LS_KEY, JSON.stringify(all.filter((c) => c.id !== id)));
  } catch {
    // silent
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface ThreadedComment extends Comment {
  replies: Comment[];
}

function buildThreaded(comments: Comment[]): ThreadedComment[] {
  const parents = comments.filter((c) => !c.parentId);
  const childMap: Record<string, Comment[]> = {};
  for (const c of comments) {
    if (c.parentId) {
      if (!childMap[c.parentId]) childMap[c.parentId] = [];
      childMap[c.parentId].push(c);
    }
  }
  return parents.map((p) => ({ ...p, replies: childMap[p.id] || [] }));
}

export function CommentThread({ entityType, entityId, projectId }: CommentThreadProps) {
  const { t } = useTranslation();
  const { mode } = useAppMode();
  const { user } = useAuth();
  const isServer = mode === 'server';

  const [comments, setComments] = useState<ThreadedComment[]>([]);
  const [newContent, setNewContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionUsers, setMentionUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [mentionFilter, setMentionFilter] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mentionInputRef = useRef<'new' | 'reply'>('new');

  const fetchComments = useCallback(async () => {
    if (isServer) {
      try {
        const res = await apiFetch<{ comments: ThreadedComment[] }>(
          `/comments?entityType=${encodeURIComponent(entityType)}&entityId=${encodeURIComponent(entityId)}&projectId=${encodeURIComponent(projectId)}`
        );
        setComments(res.comments);
      } catch {
        // silent
      }
    } else {
      const local = getLocalComments(entityType, entityId);
      setComments(buildThreaded(local));
    }
  }, [isServer, entityType, entityId, projectId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Fetch team members for @mention
  useEffect(() => {
    if (isServer) {
      apiFetch<{ users: { id: string; name: string; email: string }[] }>('/users')
        .then((res) => setMentionUsers(res.users || []))
        .catch(() => {});
    }
  }, [isServer]);

  const handleContentChange = (value: string, source: 'new' | 'reply') => {
    if (source === 'new') setNewContent(value);
    else setReplyContent(value);

    // Detect @mention trigger
    const lastAt = value.lastIndexOf('@');
    if (lastAt >= 0) {
      const afterAt = value.substring(lastAt + 1);
      if (!afterAt.includes(' ') && afterAt.length < 30) {
        setShowMentions(true);
        setMentionFilter(afterAt.toLowerCase());
        mentionInputRef.current = source;
        return;
      }
    }
    setShowMentions(false);
  };

  const insertMention = (name: string) => {
    const source = mentionInputRef.current;
    const current = source === 'new' ? newContent : replyContent;
    const lastAt = current.lastIndexOf('@');
    const newValue = current.substring(0, lastAt) + `@${name} `;
    if (source === 'new') setNewContent(newValue);
    else setReplyContent(newValue);
    setShowMentions(false);
  };

  const filteredMentionUsers = mentionUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(mentionFilter) ||
      u.email.toLowerCase().includes(mentionFilter)
  );

  const currentUserId = user?.id || 'local-user';
  const currentUserName = user?.name || user?.email || 'You';

  const handleSubmit = async (parentId?: string) => {
    const content = parentId ? replyContent : newContent;
    if (!content.trim()) return;

    if (isServer) {
      try {
        await apiFetch('/comments', {
          method: 'POST',
          body: JSON.stringify({ entityType, entityId, projectId, content, parentId }),
        });
        if (parentId) {
          setReplyContent('');
          setReplyingTo(null);
        } else {
          setNewContent('');
        }
        fetchComments();
      } catch {
        // silent
      }
    } else {
      const comment: Comment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        entityType,
        entityId,
        projectId,
        userId: currentUserId,
        userName: currentUserName,
        content,
        parentId: parentId || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveLocalComment(comment);
      if (parentId) {
        setReplyContent('');
        setReplyingTo(null);
      } else {
        setNewContent('');
      }
      fetchComments();
    }
  };

  const handleEdit = async (id: string) => {
    if (!editContent.trim()) return;
    if (isServer) {
      try {
        await apiFetch(`/comments/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ content: editContent }),
        });
        setEditingId(null);
        setEditContent('');
        fetchComments();
      } catch {
        // silent
      }
    } else {
      updateLocalComment(id, editContent);
      setEditingId(null);
      setEditContent('');
      fetchComments();
    }
  };

  const handleDelete = async (id: string) => {
    if (isServer) {
      try {
        await apiFetch(`/comments/${id}`, { method: 'DELETE' });
        fetchComments();
      } catch {
        // silent
      }
    } else {
      deleteLocalComment(id);
      fetchComments();
    }
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const isOwn = comment.userId === currentUserId;
    const initial = comment.userName?.charAt(0)?.toUpperCase() || '?';

    return (
      <div key={comment.id} className={`flex gap-3 ${isReply ? 'ml-8 mt-2' : 'mt-3'}`}>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center text-white text-xs font-bold shrink-0">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">{comment.userName}</span>
            <span className="text-xs text-text-tertiary">{timeAgo(comment.createdAt)}</span>
            {comment.updatedAt !== comment.createdAt && (
              <span className="text-xs text-text-tertiary italic">{t('comments.edited')}</span>
            )}
          </div>

          {editingId === comment.id ? (
            <div className="mt-1 flex gap-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="flex-1 px-3 py-2 text-sm bg-surface border border-border rounded-lg text-text-primary resize-none focus:outline-none focus:ring-1 focus:ring-accent"
                rows={2}
              />
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleEdit(comment.id)}
                  className="p-1.5 rounded bg-accent text-white hover:bg-accent-hover transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => { setEditingId(null); setEditContent(''); }}
                  className="p-1.5 rounded text-text-tertiary hover:bg-surface-hover transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-text-secondary mt-0.5 whitespace-pre-wrap break-words">{comment.content}</p>
          )}

          {editingId !== comment.id && (
            <div className="flex items-center gap-2 mt-1">
              {!isReply && (
                <button
                  onClick={() => { setReplyingTo(replyingTo === comment.id ? null : comment.id); setReplyContent(''); }}
                  className="inline-flex items-center gap-1 text-xs text-text-tertiary hover:text-accent transition-colors"
                >
                  <Reply className="w-3 h-3" />
                  {t('comments.reply')}
                </button>
              )}
              {isOwn && (
                <>
                  <button
                    onClick={() => { setEditingId(comment.id); setEditContent(comment.content); }}
                    className="inline-flex items-center gap-1 text-xs text-text-tertiary hover:text-accent transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    {t('common.edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="inline-flex items-center gap-1 text-xs text-text-tertiary hover:text-danger transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    {t('common.delete')}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-4 h-4 text-text-tertiary" />
        <h3 className="text-sm font-semibold text-text-primary">{t('comments.title')}</h3>
        <span className="text-xs text-text-tertiary">({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})</span>
      </div>

      {/* Comment list */}
      <div className="space-y-1">
        {comments.length === 0 && (
          <p className="text-sm text-text-tertiary py-4 text-center">{t('comments.empty')}</p>
        )}
        {comments.map((c) => (
          <div key={c.id}>
            {renderComment(c)}
            {/* Replies */}
            {c.replies?.map((r) => renderComment(r, true))}
            {/* Reply input */}
            {replyingTo === c.id && (
              <div className="ml-8 mt-2 flex gap-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => handleContentChange(e.target.value, 'reply')}
                  placeholder={t('comments.replyPlaceholder')}
                  className="flex-1 px-3 py-2 text-sm bg-surface border border-border rounded-lg text-text-primary resize-none focus:outline-none focus:ring-1 focus:ring-accent"
                  rows={2}
                />
                <button
                  onClick={() => handleSubmit(c.id)}
                  disabled={!replyContent.trim()}
                  className="self-end p-2 rounded-lg bg-accent text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New comment input */}
      <div className="mt-4 relative">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={newContent}
            onChange={(e) => handleContentChange(e.target.value, 'new')}
            placeholder={t('comments.addPlaceholder')}
            className="flex-1 px-3 py-2 text-sm bg-surface border border-border rounded-lg text-text-primary resize-none focus:outline-none focus:ring-1 focus:ring-accent"
            rows={2}
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!newContent.trim()}
            className="self-end p-2 rounded-lg bg-accent text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* @mention autocomplete */}
        {showMentions && filteredMentionUsers.length > 0 && (
          <div className="absolute bottom-full mb-1 left-0 w-64 bg-surface-elevated rounded-lg shadow-xl border border-border max-h-40 overflow-y-auto z-50">
            {filteredMentionUsers.slice(0, 8).map((u) => (
              <button
                key={u.id}
                onClick={() => insertMention(u.email)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-surface-hover transition-colors flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="text-text-primary">{u.name}</span>
                  <span className="text-text-tertiary ml-1 text-xs">{u.email}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
