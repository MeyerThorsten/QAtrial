import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Upload } from 'lucide-react';
import { useImportExport } from '../../store/useImportExport';

export function ImportExportBar() {
  const { t } = useTranslation();
  const { exportData, importData } = useImportExport();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await importData(file);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    setTimeout(() => setMessage(null), 3000);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex items-center gap-2">
      {message && (
        <span className={`text-xs font-medium ${message.type === 'success' ? 'text-success' : 'text-danger'}`}>
          {message.text}
        </span>
      )}
      <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
      >
        <Upload className="w-4 h-4" />
        {t('importExport.import')}
      </button>
      <button
        onClick={exportData}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
      >
        <Download className="w-4 h-4" />
        {t('importExport.export')}
      </button>
    </div>
  );
}
