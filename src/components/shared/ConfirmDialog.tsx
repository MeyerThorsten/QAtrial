import { useTranslation } from 'react-i18next';
import { AlertTriangle, X } from 'lucide-react';

interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, onConfirm, onCancel }: Props) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onCancel}>
      <div className="bg-surface-elevated rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4 border border-border" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-danger-subtle flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-danger" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
            <p className="text-sm text-text-secondary mt-1">{message}</p>
          </div>
          <button onClick={onCancel} className="text-text-tertiary hover:text-text-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onCancel} className="px-3 py-1.5 text-sm text-text-secondary bg-surface-tertiary rounded-lg hover:bg-surface-hover transition-colors">
            {t('common.cancel')}
          </button>
          <button onClick={onConfirm} className="px-3 py-1.5 text-sm text-white bg-danger rounded-lg hover:bg-danger-hover transition-colors">
            {t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  );
}
