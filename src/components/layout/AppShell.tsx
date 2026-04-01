import { useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList, FlaskConical, BarChart3, FolderPlus, ScrollText, X, FileText, Settings } from 'lucide-react';
import { ImportExportBar } from '../shared/ImportExportBar';
import { ThemeToggle } from '../shared/ThemeToggle';
import { LanguageSelector } from '../shared/LanguageSelector';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { useProjectStore } from '../../store/useProjectStore';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useTestsStore } from '../../store/useTestsStore';
import type { ViewTab } from '../../types';

// Lazy-loaded components for code splitting
const RequirementsTable = lazy(() => import('../requirements/RequirementsTable').then((m) => ({ default: m.RequirementsTable })));
const TestsTable = lazy(() => import('../tests/TestsTable').then((m) => ({ default: m.TestsTable })));
const EvaluationDashboard = lazy(() => import('../dashboard/EvaluationDashboard').then((m) => ({ default: m.EvaluationDashboard })));
const AuditTrailViewer = lazy(() => import('../audit/AuditTrailViewer').then((m) => ({ default: m.AuditTrailViewer })));
const ReportGenerator = lazy(() => import('../reports/ReportGenerator').then((m) => ({ default: m.ReportGenerator })));
const ProviderSettings = lazy(() => import('../ai/ProviderSettings').then((m) => ({ default: m.ProviderSettings })));
const SetupWizard = lazy(() => import('../wizard/SetupWizard').then((m) => ({ default: m.SetupWizard })));

function TabSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
    </div>
  );
}

export function AppShell() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ViewTab>('requirements');
  const project = useProjectStore((s) => s.project);
  const clearProject = useProjectStore((s) => s.clearProject);
  const requirements = useRequirementsStore((s) => s.requirements);
  const tests = useTestsStore((s) => s.tests);

  const [showWizard, setShowWizard] = useState(false);
  const [confirmNewProject, setConfirmNewProject] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);

  const hasData = project !== null || requirements.length > 0 || tests.length > 0;
  const wizardVisible = showWizard || !hasData;

  const tabs: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
    { id: 'requirements', label: t('nav.requirements'), icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'tests', label: t('nav.tests'), icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'dashboard', label: t('nav.dashboard'), icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'reports', label: t('nav.reports'), icon: <FileText className="w-4 h-4" /> },
  ];

  if (wizardVisible) {
    return (
      <Suspense fallback={<TabSpinner />}>
        <SetupWizard onComplete={() => setShowWizard(false)} />
      </Suspense>
    );
  }

  const handleNewProject = () => {
    if (hasData) {
      setConfirmNewProject(true);
    } else {
      setShowWizard(true);
    }
  };

  const handleConfirmNewProject = () => {
    useRequirementsStore.getState().setRequirements([], 1);
    useTestsStore.getState().setTests([], 1);
    clearProject();
    setConfirmNewProject(false);
    setShowWizard(true);
  };

  return (
    <div className="min-h-screen bg-surface-secondary">
      <header className="bg-surface border-b border-border backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center">
                  <span className="text-xs font-bold text-white">QA</span>
                </div>
                <h1 className="text-lg font-bold text-text-primary tracking-tight">QAtrial</h1>
              </div>
              {project && (
                <>
                  <span className="text-border">/</span>
                  <span className="text-sm font-medium text-text-secondary">{project.name}</span>
                  {project.version && (
                    <span className="text-xs text-accent-text bg-accent-subtle px-1.5 py-0.5 rounded-md font-medium">
                      v{project.version}
                    </span>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAuditTrail(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
              >
                <ScrollText className="w-4 h-4" />
                {t('audit.title')}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`p-1.5 rounded-lg transition-colors ${
                  activeTab === 'settings'
                    ? 'text-accent bg-accent-subtle'
                    : 'text-text-tertiary hover:text-text-secondary hover:bg-surface-hover'
                }`}
                title={t('common.settings')}
              >
                <Settings className="w-4 h-4" />
              </button>
              <LanguageSelector />
              <ThemeToggle />
              <button
                onClick={handleNewProject}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
              >
                <FolderPlus className="w-4 h-4" />
                {t('app.newProject')}
              </button>
              <ImportExportBar />
            </div>
          </div>
          <nav className="-mb-px flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-t-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-surface-secondary text-accent border-b-2 border-accent'
                    : 'text-text-tertiary hover:text-text-secondary hover:bg-surface-hover'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Suspense fallback={<TabSpinner />}>
          {activeTab === 'requirements' && <RequirementsTable />}
          {activeTab === 'tests' && <TestsTable />}
          {activeTab === 'dashboard' && <EvaluationDashboard />}
          {activeTab === 'reports' && <ReportGenerator />}
          {activeTab === 'settings' && <ProviderSettings />}
        </Suspense>
      </main>

      <ConfirmDialog
        open={confirmNewProject}
        title={t('confirm.newProjectTitle')}
        message={t('confirm.newProjectMessage')}
        onConfirm={handleConfirmNewProject}
        onCancel={() => setConfirmNewProject(false)}
      />

      {/* Audit Trail Modal */}
      {showAuditTrail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={() => setShowAuditTrail(false)}>
          <div
            className="bg-surface-elevated rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[85vh] flex flex-col border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-accent" />
                <h2 className="text-base font-semibold text-text-primary">{t('audit.title')}</h2>
              </div>
              <button
                onClick={() => setShowAuditTrail(false)}
                className="text-text-tertiary hover:text-text-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <Suspense fallback={<TabSpinner />}>
                <AuditTrailViewer />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
