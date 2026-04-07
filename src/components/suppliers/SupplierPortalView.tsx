import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, ClipboardCheck, AlertTriangle, FileText, Upload, Send, Clock, Shield, CheckCircle } from 'lucide-react';

interface PortalDashboard {
  supplier: { name: string; category: string; qualificationStatus: string };
  scorecard: { overallScore: number | null; defectRate: number | null; onTimeDelivery: number | null; qualificationStatus: string };
  upcomingAuditsCount: number;
  openCorrectiveActionsCount: number;
  expiresAt: string;
}

interface PortalAudit {
  id: string;
  auditDate: string;
  auditType: string;
  status: string;
  score: number | null;
  findings: string | null;
  auditor: string;
}

interface PortalAction {
  id: string;
  classification: string;
  area: string;
  description: string;
  dueDate: string | null;
  status: string;
  response: string | null;
}

interface PortalDocument {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  description: string;
  createdAt: string;
  uploadedBy: string;
}

type PortalTab = 'dashboard' | 'audits' | 'actions' | 'documents';

export function SupplierPortalView({ token }: { token: string }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<PortalTab>('dashboard');
  const [dashboard, setDashboard] = useState<PortalDashboard | null>(null);
  const [audits, setAudits] = useState<PortalAudit[]>([]);
  const [actions, setActions] = useState<PortalAction[]>([]);
  const [documents, setDocuments] = useState<PortalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadDesc, setUploadDesc] = useState('');

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/api/supplier-portal/${token}/dashboard`);
      if (!res.ok) {
        if (res.status === 403) throw new Error('Portal link has expired');
        if (res.status === 404) throw new Error('Invalid portal link');
        throw new Error('Failed to load dashboard');
      }
      const data = await res.json();
      setDashboard(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, apiBase]);

  const fetchAudits = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/api/supplier-portal/${token}/audits`);
      if (res.ok) {
        const data = await res.json();
        setAudits(data.audits || []);
      }
    } catch (err) {
      console.error('Failed to fetch audits:', err);
    }
  }, [token, apiBase]);

  const fetchActions = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/api/supplier-portal/${token}/actions`);
      if (res.ok) {
        const data = await res.json();
        setActions(data.actions || []);
      }
    } catch (err) {
      console.error('Failed to fetch actions:', err);
    }
  }, [token, apiBase]);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/api/supplier-portal/${token}/documents`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  }, [token, apiBase]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (activeTab === 'audits') fetchAudits();
    if (activeTab === 'actions') fetchActions();
    if (activeTab === 'documents') fetchDocuments();
  }, [activeTab, fetchAudits, fetchActions, fetchDocuments]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', uploadDesc);
      const res = await fetch(`${apiBase}/api/supplier-portal/${token}/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setUploadDesc('');
        fetchDocuments();
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleRespond = async (findingId: string) => {
    const text = responseText[findingId];
    if (!text) return;
    try {
      await fetch(`${apiBase}/api/supplier-portal/${token}/respond/${findingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: text }),
      });
      setResponseText((prev) => ({ ...prev, [findingId]: '' }));
      fetchActions();
    } catch (err) {
      console.error('Respond failed:', err);
    }
  };

  const scoreColor = (score: number | null) => {
    if (score === null) return 'text-text-tertiary';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const qualColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    qualified: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    conditional: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    disqualified: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center">
        <div className="bg-surface rounded-xl border border-border p-8 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-text-primary mb-2">{t('supplierPortal.accessDenied')}</h2>
          <p className="text-text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  const tabs: { id: PortalTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: t('supplierPortal.tabDashboard'), icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'audits', label: t('supplierPortal.tabAudits'), icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'actions', label: t('supplierPortal.tabActions'), icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'documents', label: t('supplierPortal.tabDocuments'), icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center">
                <span className="text-xs font-bold text-white">QA</span>
              </div>
              <h1 className="text-lg font-bold text-text-primary tracking-tight">
                {t('supplierPortal.header')}
              </h1>
              <span className="text-border">/</span>
              <span className="text-sm font-medium text-text-secondary">{dashboard.supplier.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-text-tertiary" />
              <span className="text-xs text-text-tertiary">{t('supplierPortal.externalAccess')}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Expiry Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm text-amber-800 dark:text-amber-200">
            {t('supplierPortal.expiryBanner', { date: new Date(dashboard.expiresAt).toLocaleDateString() })}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-accent text-accent'
                    : 'border-transparent text-text-tertiary hover:text-text-secondary'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Scorecard */}
            <div className="bg-surface rounded-xl border border-border p-6">
              <h3 className="text-sm font-semibold text-text-primary mb-4">{t('supplierPortal.scorecard')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Overall Score */}
                <div className="text-center">
                  <div className={`text-3xl font-bold ${scoreColor(dashboard.scorecard.overallScore)}`}>
                    {dashboard.scorecard.overallScore ?? '--'}
                  </div>
                  <div className="text-xs text-text-tertiary mt-1">{t('suppliers.overallScore')}</div>
                  <div className="w-full bg-border rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        (dashboard.scorecard.overallScore ?? 0) >= 80 ? 'bg-green-500' :
                        (dashboard.scorecard.overallScore ?? 0) >= 60 ? 'bg-yellow-500' :
                        (dashboard.scorecard.overallScore ?? 0) >= 40 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${dashboard.scorecard.overallScore ?? 0}%` }}
                    />
                  </div>
                </div>

                {/* Defect Rate */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-text-primary">
                    {dashboard.scorecard.defectRate !== null ? `${dashboard.scorecard.defectRate}%` : '--'}
                  </div>
                  <div className="text-xs text-text-tertiary mt-1">{t('suppliers.defectRate')}</div>
                </div>

                {/* On-Time Delivery */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-text-primary">
                    {dashboard.scorecard.onTimeDelivery !== null ? `${dashboard.scorecard.onTimeDelivery}%` : '--'}
                  </div>
                  <div className="text-xs text-text-tertiary mt-1">{t('suppliers.onTimeDelivery')}</div>
                </div>

                {/* Qualification Status */}
                <div className="text-center">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${qualColors[dashboard.scorecard.qualificationStatus] || qualColors.pending}`}>
                    {t(`suppliers.qual_${dashboard.scorecard.qualificationStatus}`)}
                  </span>
                  <div className="text-xs text-text-tertiary mt-2">{t('supplierPortal.qualificationStatus')}</div>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface rounded-xl border border-border p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-text-primary">{dashboard.upcomingAuditsCount}</div>
                  <div className="text-xs text-text-tertiary">{t('supplierPortal.upcomingAudits')}</div>
                </div>
              </div>
              <div className="bg-surface rounded-xl border border-border p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-text-primary">{dashboard.openCorrectiveActionsCount}</div>
                  <div className="text-xs text-text-tertiary">{t('supplierPortal.openActions')}</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Audits Tab */}
        {activeTab === 'audits' && (
          <div className="bg-surface rounded-xl border border-border">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary">{t('supplierPortal.auditHistory')}</h3>
            </div>
            {audits.length === 0 ? (
              <div className="p-8 text-center text-text-tertiary">{t('supplierPortal.noAudits')}</div>
            ) : (
              <div className="divide-y divide-border">
                {audits.map((audit) => (
                  <div key={audit.id} className="px-4 py-3 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary">
                          {new Date(audit.auditDate).toLocaleDateString()}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-surface-secondary text-text-secondary capitalize">
                          {audit.auditType.replace('_', ' ')}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                          audit.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                          audit.status === 'scheduled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}>
                          {audit.status}
                        </span>
                      </div>
                      <p className="text-xs text-text-tertiary mt-1">{t('supplierPortal.auditor')}: {audit.auditor}</p>
                      {audit.findings && (
                        <p className="text-xs text-text-secondary mt-1">{audit.findings}</p>
                      )}
                    </div>
                    {audit.score !== null && (
                      <div className={`text-xl font-bold ${scoreColor(audit.score)}`}>
                        {audit.score}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">{t('supplierPortal.openFindings')}</h3>
            {actions.length === 0 ? (
              <div className="bg-surface rounded-xl border border-border p-8 text-center">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <p className="text-text-tertiary">{t('supplierPortal.noActions')}</p>
              </div>
            ) : (
              actions.map((action) => (
                <div key={action.id} className="bg-surface rounded-xl border border-border p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          action.classification === 'critical' ? 'bg-red-100 text-red-700' :
                          action.classification === 'major' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {action.classification}
                        </span>
                        <span className="text-xs text-text-tertiary">{action.area}</span>
                      </div>
                      <p className="text-sm text-text-primary mt-1">{action.description}</p>
                      {action.dueDate && (
                        <p className="text-xs text-text-tertiary mt-1">
                          {t('supplierPortal.dueDate')}: {new Date(action.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      action.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {action.status}
                    </span>
                  </div>

                  {action.response && (
                    <div className="bg-surface-secondary rounded-lg p-3">
                      <p className="text-xs font-medium text-text-tertiary mb-1">{t('supplierPortal.yourResponse')}</p>
                      <p className="text-sm text-text-primary">{action.response}</p>
                    </div>
                  )}

                  {!action.response && (
                    <div className="flex gap-2">
                      <textarea
                        rows={2}
                        placeholder={t('supplierPortal.responsePlaceholder')}
                        value={responseText[action.id] || ''}
                        onChange={(e) => setResponseText((prev) => ({ ...prev, [action.id]: e.target.value }))}
                        className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                      />
                      <button
                        onClick={() => handleRespond(action.id)}
                        disabled={!responseText[action.id]}
                        className="self-end inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        {t('supplierPortal.submit')}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            {/* Upload Zone */}
            <div
              className={`bg-surface rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                dragOver ? 'border-accent bg-accent/5' : 'border-border'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <Upload className="w-10 h-10 text-text-tertiary mx-auto mb-2" />
              <p className="text-sm text-text-primary font-medium">{t('supplierPortal.dropFiles')}</p>
              <p className="text-xs text-text-tertiary mt-1">{t('supplierPortal.dropFilesHint')}</p>
              <div className="mt-3 flex items-center gap-2 justify-center">
                <input
                  type="text"
                  placeholder={t('supplierPortal.fileDescription')}
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 w-64"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  {uploading ? t('supplierPortal.uploading') : t('supplierPortal.browse')}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file);
                    }}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            {/* Documents List */}
            <div className="bg-surface rounded-xl border border-border">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-text-primary">{t('supplierPortal.uploadedDocuments')}</h3>
              </div>
              {documents.length === 0 ? (
                <div className="p-8 text-center text-text-tertiary">{t('supplierPortal.noDocuments')}</div>
              ) : (
                <div className="divide-y divide-border">
                  {documents.map((doc) => (
                    <div key={doc.id} className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-text-tertiary" />
                        <div>
                          <p className="text-sm font-medium text-text-primary">{doc.fileName}</p>
                          <p className="text-xs text-text-tertiary">
                            {Math.round(doc.fileSize / 1024)} KB
                            {doc.description && ` - ${doc.description}`}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-text-tertiary">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SupplierPortalView;
