import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X, FileSpreadsheet, ChevronRight, ChevronLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAppMode } from '../../hooks/useAppMode';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useTestsStore } from '../../store/useTestsStore';
import { useProjectStore } from '../../store/useProjectStore';
import { apiFetch } from '../../lib/apiClient';

interface ImportWizardProps {
  open: boolean;
  onClose: () => void;
}

type Step = 'upload' | 'map' | 'review';
type EntityType = 'requirement' | 'test';
type DuplicateHandling = 'skip' | 'overwrite' | 'create';

const TARGET_FIELDS = [
  { key: 'title', required: true },
  { key: 'description', required: false },
  { key: 'status', required: false },
  { key: 'tags', required: false },
  { key: 'riskLevel', required: false },
  { key: 'regulatoryRef', required: false },
];

const TARGET_FIELDS_TEST = [
  { key: 'title', required: true },
  { key: 'description', required: false },
  { key: 'status', required: false },
  { key: 'linkedRequirements', required: false },
];

// ── Local CSV parsing (standalone mode) ────────────────────────────────────

function detectDelimiter(firstLine: string): string {
  const candidates = [',', ';', '\t'];
  let best = ',';
  let bestCount = 0;
  for (const delim of candidates) {
    const count = firstLine.split(delim).length - 1;
    if (count > bestCount) { bestCount = count; best = delim; }
  }
  return best;
}

function parseCsvLine(line: string, delimiter: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  while (i < line.length) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') { current += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      current += char; i++;
    } else {
      if (char === '"') { inQuotes = true; i++; continue; }
      if (char === delimiter) { fields.push(current.trim()); current = ''; i++; continue; }
      current += char; i++;
    }
  }
  fields.push(current.trim());
  return fields;
}

function parseLocalCsv(text: string): { headers: string[]; rows: string[][] } {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const clean = normalized.startsWith('\ufeff') ? normalized.slice(1) : normalized;
  const lines = clean.split('\n').filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };
  const delimiter = detectDelimiter(lines[0]);
  const headers = parseCsvLine(lines[0], delimiter);
  const rows = lines.slice(1).map((line) => parseCsvLine(line, delimiter));
  return { headers, rows };
}

// ── Auto-mapping ───────────────────────────────────────────────────────────

const FIELD_PATTERNS: Record<string, RegExp[]> = {
  title: [/^title$/i, /^name$/i, /^summary$/i, /^requirement$/i],
  description: [/^desc/i, /^description$/i, /^detail/i, /^body$/i],
  status: [/^status$/i, /^state$/i],
  tags: [/^tags?$/i, /^labels?$/i, /^categor/i],
  riskLevel: [/^risk/i, /^severity$/i, /^priority$/i],
  regulatoryRef: [/^reg/i, /^regulatory/i, /^standard$/i, /^clause$/i],
  linkedRequirements: [/^linked/i, /^req/i, /^requirement/i, /^trace/i],
};

function autoMap(headers: string[]): Record<string, number | null> {
  const mapping: Record<string, number | null> = {};
  for (const field of Object.keys(FIELD_PATTERNS)) {
    mapping[field] = null;
    for (let i = 0; i < headers.length; i++) {
      if (FIELD_PATTERNS[field].some((p) => p.test(headers[i]))) {
        mapping[field] = i;
        break;
      }
    }
  }
  return mapping;
}

export function ImportWizard({ open, onClose }: ImportWizardProps) {
  const { t } = useTranslation();
  const { mode } = useAppMode();
  const isServer = mode === 'server';
  const project = useProjectStore((s) => s.project);

  const [step, setStep] = useState<Step>('upload');
  const [entityType, setEntityType] = useState<EntityType>('requirement');
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [allRows, setAllRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<string, number | null>>({});
  const [duplicateHandling, setDuplicateHandling] = useState<DuplicateHandling>('create');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ created: number; skipped: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fields = entityType === 'test' ? TARGET_FIELDS_TEST : TARGET_FIELDS;

  const reset = useCallback(() => {
    setStep('upload');
    setFile(null);
    setHeaders([]);
    setAllRows([]);
    setMapping({});
    setDuplicateHandling('create');
    setImporting(false);
    setResult(null);
  }, []);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFile = async (f: File) => {
    setFile(f);
    const text = await f.text();

    if (isServer) {
      try {
        const formData = new FormData();
        formData.append('file', f);
        const token = localStorage.getItem('qatrial:token');
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        const res = await fetch(`${API_BASE}/import/preview`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        if (!res.ok) throw new Error('Preview failed');
        const data = await res.json();
        setHeaders(data.columns);
        setAllRows(data.sampleRows.length < data.totalRows ? data.sampleRows : data.sampleRows);
        // Store full data for execute
        const fullParse = parseLocalCsv(text);
        setAllRows(fullParse.rows);
        setMapping(data.suggestedMapping);
      } catch {
        // Fallback to local parsing
        const { headers: h, rows } = parseLocalCsv(text);
        setHeaders(h);
        setAllRows(rows);
        setMapping(autoMap(h));
      }
    } else {
      const { headers: h, rows } = parseLocalCsv(text);
      setHeaders(h);
      setAllRows(rows);
      setMapping(autoMap(h));
    }

    setStep('map');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleMappingChange = (field: string, colIndex: number | null) => {
    setMapping((prev) => ({ ...prev, [field]: colIndex }));
  };

  const previewRows = allRows.slice(0, 3);

  const getMappedValue = (row: string[], field: string): string => {
    const idx = mapping[field];
    if (idx === null || idx === undefined || idx < 0 || idx >= row.length) return '';
    return row[idx];
  };

  const itemCount = allRows.length;

  const handleImport = async () => {
    setImporting(true);

    if (isServer && project) {
      try {
        const data = await apiFetch<{ created: number; skipped: number; errors: string[] }>('/import/execute', {
          method: 'POST',
          body: JSON.stringify({
            projectId: (project as any).id ?? project.name,
            entityType,
            mapping,
            data: allRows,
            duplicateHandling,
          }),
        });
        setResult(data);
      } catch (err: any) {
        setResult({ created: 0, skipped: 0, errors: [err.message] });
      }
    } else {
      // Standalone mode: add directly to stores
      let created = 0;
      let skipped = 0;
      const errors: string[] = [];

      if (entityType === 'requirement') {
        const addReq = useRequirementsStore.getState().addRequirement;
        for (let i = 0; i < allRows.length; i++) {
          const row = allRows[i];
          const title = getMappedValue(row, 'title');
          if (!title) { errors.push(`Row ${i + 1}: Missing title`); continue; }

          const tagsStr = getMappedValue(row, 'tags');
          addReq({
            title,
            description: getMappedValue(row, 'description'),
            status: (getMappedValue(row, 'status') as any) || 'Draft',
            tags: tagsStr ? tagsStr.split(',').map((t) => t.trim()) : undefined,
            riskLevel: (getMappedValue(row, 'riskLevel') as any) || undefined,
            regulatoryRef: getMappedValue(row, 'regulatoryRef') || undefined,
          });
          created++;
        }
      } else {
        const addTest = useTestsStore.getState().addTest;
        for (let i = 0; i < allRows.length; i++) {
          const row = allRows[i];
          const title = getMappedValue(row, 'title');
          if (!title) { errors.push(`Row ${i + 1}: Missing title`); continue; }

          const linkedStr = getMappedValue(row, 'linkedRequirements');
          addTest({
            title,
            description: getMappedValue(row, 'description'),
            status: (getMappedValue(row, 'status') as any) || 'Not Run',
            linkedRequirementIds: linkedStr ? linkedStr.split(',').map((r) => r.trim()).filter(Boolean) : [],
          });
          created++;
        }
      }

      setResult({ created, skipped, errors });
    }

    setImporting(false);
    setStep('review');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={handleClose}>
      <div
        className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-accent" />
            <h2 className="text-base font-semibold text-text-primary">{t('import.title')}</h2>
          </div>
          <button onClick={handleClose} className="text-text-tertiary hover:text-text-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-border-subtle bg-surface-tertiary">
          {['upload', 'map', 'review'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="w-3 h-3 text-text-tertiary" />}
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${step === s ? 'bg-accent text-white' : 'text-text-tertiary'}`}>
                {i + 1}. {s === 'upload' ? t('import.upload') : s === 'map' ? t('import.mapColumns') : t('import.review')}
              </span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div className="space-y-4">
              {/* Entity type selector */}
              <div className="flex gap-2">
                <button
                  onClick={() => setEntityType('requirement')}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${entityType === 'requirement' ? 'bg-accent text-white border-accent' : 'border-border text-text-secondary hover:bg-surface-hover'}`}
                >
                  {t('nav.requirements')}
                </button>
                <button
                  onClick={() => setEntityType('test')}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${entityType === 'test' ? 'bg-accent text-white border-accent' : 'border-border text-text-secondary hover:bg-surface-hover'}`}
                >
                  {t('nav.tests')}
                </button>
              </div>

              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-accent hover:bg-accent-subtle/30 transition-colors"
              >
                <Upload className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
                <p className="text-sm text-text-secondary">{t('import.dropZone')}</p>
                <p className="text-xs text-text-tertiary mt-1">.csv, .tsv, .xlsx</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.tsv,.xlsx,.xls"
                onChange={handleFileInput}
                className="hidden"
              />

              {file && (
                <div className="flex items-center gap-2 p-3 bg-surface-tertiary rounded-lg">
                  <FileSpreadsheet className="w-4 h-4 text-accent" />
                  <span className="text-sm text-text-primary font-medium">{file.name}</span>
                  <span className="text-xs text-text-tertiary">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Map columns */}
          {step === 'map' && (
            <div className="space-y-4">
              <p className="text-sm text-text-secondary">{t('import.mapColumns')}</p>

              <div className="space-y-2">
                {fields.map((field) => (
                  <div key={field.key} className="flex items-center gap-3">
                    <span className="text-sm text-text-primary w-36 shrink-0">
                      {t(`requirements.${field.key}`, t(`tests.${field.key}`, field.key))}
                      {field.required && <span className="text-danger ml-1">*</span>}
                    </span>
                    <select
                      value={mapping[field.key] ?? -1}
                      onChange={(e) => handleMappingChange(field.key, e.target.value === '-1' ? null : Number(e.target.value))}
                      className="flex-1 px-2 py-1.5 text-sm bg-input-bg border border-input-border rounded-lg text-text-primary"
                    >
                      <option value={-1}>-- {t('common.none')} --</option>
                      {headers.map((h, i) => (
                        <option key={i} value={i}>{h}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Preview table */}
              {previewRows.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-text-tertiary uppercase mb-2">{t('import.preview')}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border border-border rounded">
                      <thead>
                        <tr className="bg-surface-tertiary">
                          {fields.filter((f) => mapping[f.key] !== null && mapping[f.key] !== undefined).map((f) => (
                            <th key={f.key} className="px-2 py-1.5 text-left text-text-tertiary font-medium border-b border-border">
                              {t(`requirements.${f.key}`, t(`tests.${f.key}`, f.key))}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewRows.map((row, ri) => (
                          <tr key={ri} className="border-b border-border-subtle">
                            {fields.filter((f) => mapping[f.key] !== null && mapping[f.key] !== undefined).map((f) => (
                              <td key={f.key} className="px-2 py-1.5 text-text-secondary truncate max-w-[200px]">
                                {getMappedValue(row, f.key) || '\u2014'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review & Import */}
          {step === 'review' && !result && (
            <div className="space-y-4">
              <div className="p-4 bg-surface-tertiary rounded-lg">
                <p className="text-sm text-text-primary font-medium">
                  {t('import.itemsToCreate', { count: itemCount })}
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  {entityType === 'requirement' ? t('nav.requirements') : t('nav.tests')}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-text-primary block mb-2">{t('import.duplicateHandling')}</label>
                <div className="space-y-1">
                  {(['skip', 'overwrite', 'create'] as DuplicateHandling[]).map((opt) => (
                    <label key={opt} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-hover cursor-pointer">
                      <input
                        type="radio"
                        name="duplicateHandling"
                        value={opt}
                        checked={duplicateHandling === opt}
                        onChange={() => setDuplicateHandling(opt)}
                        className="accent-accent"
                      />
                      <span className="text-sm text-text-secondary">{t(`import.${opt}`)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-4 bg-badge-passed-bg/30 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <p className="text-sm text-text-primary font-medium">
                  {t('import.success', { created: result.created, skipped: result.skipped, errors: result.errors.length })}
                </p>
              </div>
              {result.errors.length > 0 && (
                <div className="space-y-1">
                  {result.errors.slice(0, 10).map((err, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-danger">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>{err}</span>
                    </div>
                  ))}
                  {result.errors.length > 10 && (
                    <p className="text-xs text-text-tertiary">...and {result.errors.length - 10} more errors</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0">
          <div>
            {step === 'map' && (
              <button
                onClick={() => setStep('upload')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                {t('common.back')}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {result ? t('common.close') : t('common.cancel')}
            </button>
            {step === 'map' && (
              <button
                onClick={() => setStep('review')}
                disabled={mapping.title === null && mapping.title === undefined}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-colors font-medium disabled:opacity-50"
              >
                {t('common.next')}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {step === 'review' && !result && (
              <button
                onClick={handleImport}
                disabled={importing}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-colors font-medium disabled:opacity-50"
              >
                {importing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('import.importing')}
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    {t('import.upload')}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
