import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Upload, Download, Trash2, Paperclip, FileText, AlertTriangle } from 'lucide-react';
import { useAppMode } from '../../hooks/useAppMode';
import { useEvidenceStore, type EvidenceAttachment } from '../../store/useEvidenceStore';
import { useAuthStore } from '../../store/useAuthStore';

interface Props {
  entityType: 'requirement' | 'test' | 'capa';
  entityId: string;
  projectId: string;
  open: boolean;
  onClose: () => void;
}

export function EvidencePanel({ entityType, entityId, projectId, open, onClose }: Props) {
  const { t } = useTranslation();
  const { mode } = useAppMode();
  const isServerMode = mode === 'server';

  const attachments = useEvidenceStore((s) => s.attachments.filter((a) => a.entityId === entityId));
  const addAttachment = useEvidenceStore((s) => s.addAttachment);
  const removeAttachment = useEvidenceStore((s) => s.removeAttachment);
  const currentUser = useAuthStore((s) => s.currentUser);

  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFileAsDataUrl = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const addFileLocally = useCallback(async (file: File, desc: string) => {
    const dataUrl = await readFileAsDataUrl(file);
    addAttachment({
      entityId,
      entityType,
      name: file.name,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      evidenceType: 'document',
      description: desc || undefined,
      dataUrl,
      uploadedBy: currentUser?.displayName || 'Anonymous',
    });
  }, [readFileAsDataUrl, addAttachment, entityId, entityType, currentUser]);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      setUploading(true);
      setUploadProgress(0);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(Math.round(((i) / files.length) * 100));

        if (isServerMode) {
          try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('entityType', entityType);
            formData.append('entityId', entityId);
            formData.append('projectId', projectId);
            formData.append('description', description);

            const token = localStorage.getItem('qatrial:token');
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            await fetch(`${apiBase}/evidence/upload`, {
              method: 'POST',
              headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: formData,
            });
          } catch {
            // Fall back to client-side storage on error
            await addFileLocally(file, description);
          }
        } else {
          await addFileLocally(file, description);
        }

        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      setUploading(false);
      setUploadProgress(0);
      setDescription('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [isServerMode, entityType, entityId, projectId, description, addFileLocally],
  );

  const handleDownload = (attachment: EvidenceAttachment) => {
    if (attachment.dataUrl) {
      const link = document.createElement('a');
      link.href = attachment.dataUrl;
      link.download = attachment.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (isServerMode) {
      const token = localStorage.getItem('qatrial:token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      window.open(`${apiBase}/evidence/${attachment.id}/download?token=${token}`, '_blank');
    }
  };

  const handleDelete = (id: string) => {
    removeAttachment(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number): string => {
    return Math.round(bytes / 1024).toString();
  };

  const formatDate = (iso: string): string => {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onClose}>
      <div
        className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-subtle flex items-center justify-center">
              <Paperclip className="w-4 h-4 text-accent" />
            </div>
            <h2 className="text-base font-semibold text-text-primary">
              {t('evidence.forEntity', { type: entityType, id: entityId })}
            </h2>
          </div>
          <button onClick={onClose} className="text-text-tertiary hover:text-text-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Standalone mode warning */}
          {!isServerMode && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/30">
              <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
              <p className="text-xs text-warning">{t('evidence.serverRequired')}</p>
            </div>
          )}

          {/* Upload area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              dragActive
                ? 'border-accent bg-accent-subtle'
                : 'border-border hover:border-accent/50 hover:bg-surface-hover'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-text-tertiary" />
            <p className="text-sm text-text-secondary">{t('evidence.dragDrop')}</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {/* Description field */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              {t('evidence.description')}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('evidence.descPlaceholder')}
              className="w-full px-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
            />
          </div>

          {/* Upload progress */}
          {uploading && (
            <div className="space-y-1">
              <p className="text-sm text-text-secondary">{t('evidence.uploading')}</p>
              <div className="w-full bg-surface-tertiary rounded-full h-2">
                <div
                  className="bg-accent rounded-full h-2 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Evidence list */}
          {attachments.length === 0 ? (
            <div className="text-center py-8 text-text-tertiary">
              <FileText className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">{t('evidence.noEvidence')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-text-tertiary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{att.fileName}</p>
                      <p className="text-xs text-text-tertiary">
                        {t('evidence.fileSize', { size: formatFileSize(att.sizeBytes) })}
                        {' · '}
                        {att.uploadedBy}
                        {' · '}
                        {formatDate(att.uploadedAt)}
                      </p>
                      {att.description && (
                        <p className="text-xs text-text-secondary mt-0.5">{att.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleDownload(att)}
                      className="p-1.5 text-text-tertiary hover:text-accent rounded-lg hover:bg-accent-subtle transition-colors"
                      title={t('evidence.download')}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(att.id)}
                      className="p-1.5 text-text-tertiary hover:text-danger rounded-lg hover:bg-danger-subtle transition-colors"
                      title={t('evidence.delete')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
