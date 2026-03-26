import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TEST_STATUSES } from '../../lib/constants';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import type { Test, TestStatus } from '../../types';

interface Props {
  open: boolean;
  test?: Test | null;
  onSave: (data: { title: string; description: string; status: TestStatus; linkedRequirementIds: string[] }) => void;
  onClose: () => void;
}

export function TestModal({ open, test, onSave, onClose }: Props) {
  const requirements = useRequirementsStore((s) => s.requirements);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TestStatus>('Not Run');
  const [linkedReqIds, setLinkedReqIds] = useState<string[]>([]);

  useEffect(() => {
    if (test) {
      setTitle(test.title);
      setDescription(test.description);
      setStatus(test.status);
      setLinkedReqIds([...test.linkedRequirementIds]);
    } else {
      setTitle('');
      setDescription('');
      setStatus('Not Run');
      setLinkedReqIds([]);
    }
  }, [test, open]);

  if (!open) return null;

  const toggleReq = (reqId: string) => {
    setLinkedReqIds((prev) =>
      prev.includes(reqId) ? prev.filter((id) => id !== reqId) : [...prev, reqId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim(), status, linkedRequirementIds: linkedReqIds });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {test ? 'Test bearbeiten' : 'Neuer Test'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titel *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Test-Titel eingeben..."
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Beschreibung eingeben..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TestStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {TEST_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verlinkte Requirements ({linkedReqIds.length})
            </label>
            {requirements.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Keine Requirements vorhanden.</p>
            ) : (
              <div className="border border-gray-300 rounded-md max-h-40 overflow-y-auto">
                {requirements.map((req) => (
                  <label
                    key={req.id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                  >
                    <input
                      type="checkbox"
                      checked={linkedReqIds.includes(req.id)}
                      onChange={() => toggleReq(req.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-mono text-gray-400">{req.id}</span>
                    <span className="text-sm text-gray-700 truncate">{req.title}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
              Abbrechen
            </button>
            <button type="submit" disabled={!title.trim()} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
