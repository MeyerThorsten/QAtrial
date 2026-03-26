import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { useImportExport } from '../../store/useImportExport';

export function ImportExportBar() {
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
        <span className={`text-xs ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </span>
      )}
      <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <Upload className="w-4 h-4" />
        Import
      </button>
      <button
        onClick={exportData}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <Download className="w-4 h-4" />
        Export
      </button>
    </div>
  );
}
