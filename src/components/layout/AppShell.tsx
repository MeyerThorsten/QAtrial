import { useState, lazy, Suspense, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList, FlaskConical, BarChart3, FolderPlus, ScrollText, X, FileText, Settings, Layers, LogOut, Users, FileSpreadsheet, Download, AlertTriangle, Building2, Beaker, GraduationCap, FileCheck, Server, GitBranch, Activity, Barcode, TestTube2, Thermometer, ClipboardCheck, Workflow, RefreshCw, TriangleAlert, CheckSquare, Gauge, FormInput, FolderOpen, ShieldCheck, Package, Clock } from 'lucide-react';
import { ImportExportBar } from '../shared/ImportExportBar';
import { ImportWizard } from '../import/ImportWizard';
import { ExportPanel } from '../import/ExportPanel';
import { ThemeToggle } from '../shared/ThemeToggle';
import { LanguageSelector } from '../shared/LanguageSelector';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { NotificationInbox } from '../shared/NotificationInbox';
import { GlobalSearch } from '../shared/GlobalSearch';
import { useProjectStore } from '../../store/useProjectStore';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useTestsStore } from '../../store/useTestsStore';
import { useAuditStore } from '../../store/useAuditStore';
import { useAuth } from '../../hooks/useAuth';
import { useAppMode } from '../../hooks/useAppMode';
import { useApiProjects } from '../../hooks/useApiProjects';
import { useApiRequirements } from '../../hooks/useApiRequirements';
import { useApiTests } from '../../hooks/useApiTests';
import { useApiAudit } from '../../hooks/useApiAudit';
import { WorkspaceManager } from '../auth/WorkspaceManager';
import { MigrateDataButton } from '../auth/MigrateDataButton';
import { ShareAuditLink } from '../audit/ShareAuditLink';
import { ShareSupplierLink } from '../suppliers/ShareSupplierLink';
import { ProjectDataProvider } from '../../context/ProjectDataContext';
import { getProjectId } from '../../lib/projectUtils';
import type { ViewTab } from '../../types';

// Lazy-loaded components for code splitting
const RequirementsTable = lazy(() => import('../requirements/RequirementsTable').then((m) => ({ default: m.RequirementsTable })));
const TestsTable = lazy(() => import('../tests/TestsTable').then((m) => ({ default: m.TestsTable })));
const EvaluationDashboard = lazy(() => import('../dashboard/EvaluationDashboard').then((m) => ({ default: m.EvaluationDashboard })));
const AuditTrailViewer = lazy(() => import('../audit/AuditTrailViewer').then((m) => ({ default: m.AuditTrailViewer })));
const ReportGenerator = lazy(() => import('../reports/ReportGenerator').then((m) => ({ default: m.ReportGenerator })));
const SettingsPage = lazy(() => import('../settings/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const DesignControlView = lazy(() => import('../design/DesignControlView'));
const ComplaintTrending = lazy(() => import('../complaints/ComplaintTrending').then((m) => ({ default: m.ComplaintTrending })));
const SupplierScorecard = lazy(() => import('../suppliers/SupplierScorecard').then((m) => ({ default: m.SupplierScorecard })));
const BatchRecordForm = lazy(() => import('../pharma/BatchRecordForm').then((m) => ({ default: m.BatchRecordForm })));
const TrainingDashboard = lazy(() => import('../training/TrainingDashboard').then((m) => ({ default: m.TrainingDashboard })));
const DocumentManager = lazy(() => import('../documents/DocumentManager').then((m) => ({ default: m.DocumentManager })));
const SystemInventory = lazy(() => import('../gamp/SystemInventory').then((m) => ({ default: m.SystemInventory })));
const ImpactAnalysis = lazy(() => import('../traceability/ImpactAnalysis').then((m) => ({ default: m.ImpactAnalysis })));
const PMSDashboard = lazy(() => import('../dashboard/PMSDashboard').then((m) => ({ default: m.PMSDashboard })));
const UDIManager = lazy(() => import('../device/UDIManager').then((m) => ({ default: m.UDIManager })));
const StabilityStudyView = lazy(() => import('../pharma/StabilityStudy').then((m) => ({ default: m.StabilityStudy })));
const EnvironmentalMonitoring = lazy(() => import('../pharma/EnvironmentalMonitoring').then((m) => ({ default: m.EnvironmentalMonitoring })));
const AuditSchedule = lazy(() => import('../audits/AuditSchedule').then((m) => ({ default: m.AuditSchedule })));
const SetupWizard = lazy(() => import('../wizard/SetupWizard').then((m) => ({ default: m.SetupWizard })));
const WorkflowInbox = lazy(() => import('../workflows/WorkflowInbox').then((m) => ({ default: m.WorkflowInbox })));
const ChangeControlTracker = lazy(() => import('../change/ChangeControlTracker').then((m) => ({ default: m.ChangeControlTracker })));
const DeviationInvestigationView = lazy(() => import('../deviations/DeviationInvestigation').then((m) => ({ default: m.DeviationInvestigation })));
const TaskDashboard = lazy(() => import('../tasks/TaskDashboard').then((m) => ({ default: m.TaskDashboard })));
const KPIDashboardManager = lazy(() => import('../kpi/KPIDashboardManager').then((m) => ({ default: m.KPIDashboardManager })));
const FormManagerView = lazy(() => import('../forms/FormManagerView').then((m) => ({ default: m.FormManagerView })));
const ETMFView = lazy(() => import('../etmf/ETMFView').then((m) => ({ default: m.ETMFView })));
const EConsentManager = lazy(() => import('../econsent/EConsentManager').then((m) => ({ default: m.EConsentManager })));
const SubmissionBuilder = lazy(() => import('../submissions/SubmissionBuilder').then((m) => ({ default: m.SubmissionBuilder })));
const ScheduledReports = lazy(() => import('../reports/ScheduledReports').then((m) => ({ default: m.ScheduledReports })));

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
  const setProject = useProjectStore((s) => s.setProject);
  const clearProject = useProjectStore((s) => s.clearProject);
  const requirements = useRequirementsStore((s) => s.requirements);
  const setRequirements = useRequirementsStore((s) => s.setRequirements);
  const tests = useTestsStore((s) => s.tests);
  const setTests = useTestsStore((s) => s.setTests);

  const { user, isAuthenticated, logout } = useAuth();
  const { mode } = useAppMode();
  const isServerMode = mode === 'server';

  const {
    projects,
    loading: projectsLoading,
    activeProject,
    setActiveProject,
    refetch: refetchProjects,
  } = useApiProjects(isServerMode);
  const activeProjectId = isServerMode ? activeProject?.id ?? getProjectId(project) : '';
  const requirementApi = useApiRequirements(activeProjectId);
  const testApi = useApiTests(activeProjectId);
  const auditApi = useApiAudit(activeProjectId);

  const [showWizard, setShowWizard] = useState(false);
  const [confirmNewProject, setConfirmNewProject] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [showImportWizard, setShowImportWizard] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);

  useEffect(() => {
    if (!isServerMode || projectsLoading) return;

    if (projects.length === 0) {
      setActiveProject(null);
      clearProject();
      setRequirements([], 1);
      setTests([], 1);
      useAuditStore.setState({ entries: [] });
      return;
    }

    const storedProjectId = getProjectId(project);
    if (storedProjectId) {
      const matchedProject = projects.find((candidate) => candidate.id === storedProjectId);
      if (matchedProject && activeProject?.id !== matchedProject.id) {
        setActiveProject(matchedProject);
        return;
      }
    }

    if (!activeProject) {
      setActiveProject(projects[0]);
    }
  }, [
    activeProject,
    clearProject,
    isServerMode,
    project,
    projects,
    projectsLoading,
    setActiveProject,
    setRequirements,
    setTests,
  ]);

  useEffect(() => {
    if (!isServerMode || !activeProject) return;
    setProject(activeProject);
  }, [activeProject, isServerMode, setProject]);

  useEffect(() => {
    if (!isServerMode) return;
    setRequirements(requirementApi.requirements, requirementApi.requirements.length + 1);
  }, [isServerMode, requirementApi.requirements, setRequirements]);

  useEffect(() => {
    if (!isServerMode) return;
    setTests(testApi.tests, testApi.tests.length + 1);
  }, [isServerMode, setTests, testApi.tests]);

  useEffect(() => {
    if (!isServerMode) return;
    useAuditStore.setState({ entries: auditApi.entries });
  }, [auditApi.entries, isServerMode]);

  const hasLocalData = project !== null || requirements.length > 0 || tests.length > 0;
  const wizardVisible = showWizard || (isServerMode ? !projectsLoading && projects.length === 0 : !hasLocalData);
  const shellLoading = isServerMode && !wizardVisible && (
    projectsLoading ||
    (Boolean(activeProjectId) && (requirementApi.loading || testApi.loading))
  );

  const projectDataValue = useMemo(
    () => ({
      isServerMode,
      loading: shellLoading,
      projects,
      activeProject,
      setActiveProject,
      refetchProjects,
      createRequirement: requirementApi.create,
      updateRequirement: requirementApi.update,
      removeRequirement: requirementApi.remove,
      createTest: testApi.create,
      updateTest: testApi.update,
      removeTest: testApi.remove,
      refetchAudit: auditApi.refetch,
    }),
    [
      activeProject,
      auditApi.refetch,
      isServerMode,
      projects,
      refetchProjects,
      requirementApi.create,
      requirementApi.remove,
      requirementApi.update,
      setActiveProject,
      shellLoading,
      testApi.create,
      testApi.remove,
      testApi.update,
    ],
  );

  const tabs: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
    { id: 'requirements', label: t('nav.requirements'), icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'tests', label: t('nav.tests'), icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'dashboard', label: t('nav.dashboard'), icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'reports', label: t('nav.reports'), icon: <FileText className="w-4 h-4" /> },
    { id: 'design_control', label: t('nav.designControl'), icon: <Layers className="w-4 h-4" /> },
    { id: 'complaints', label: t('nav.complaints'), icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'suppliers', label: t('nav.suppliers'), icon: <Building2 className="w-4 h-4" /> },
    { id: 'batches', label: t('nav.batches'), icon: <Beaker className="w-4 h-4" /> },
    { id: 'training', label: t('nav.training'), icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'documents', label: t('nav.documents'), icon: <FileCheck className="w-4 h-4" /> },
    { id: 'audit_records', label: t('nav.auditRecords'), icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'udi', label: t('nav.udi'), icon: <Barcode className="w-4 h-4" /> },
    { id: 'pms', label: t('nav.pms'), icon: <Activity className="w-4 h-4" /> },
    { id: 'stability', label: t('nav.stability'), icon: <TestTube2 className="w-4 h-4" /> },
    { id: 'envmon', label: t('nav.envmon'), icon: <Thermometer className="w-4 h-4" /> },
    { id: 'systems', label: t('nav.systems'), icon: <Server className="w-4 h-4" /> },
    { id: 'impact', label: t('nav.impact'), icon: <GitBranch className="w-4 h-4" /> },
    { id: 'workflows', label: t('nav.workflows'), icon: <Workflow className="w-4 h-4" /> },
    { id: 'change_control', label: t('nav.changeControl'), icon: <RefreshCw className="w-4 h-4" /> },
    { id: 'deviations', label: t('nav.deviations'), icon: <TriangleAlert className="w-4 h-4" /> },
    { id: 'tasks', label: t('nav.tasks'), icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'kpi', label: t('nav.kpi'), icon: <Gauge className="w-4 h-4" /> },
    { id: 'forms', label: t('nav.forms'), icon: <FormInput className="w-4 h-4" /> },
    { id: 'etmf', label: t('nav.etmf'), icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'econsent', label: t('nav.econsent'), icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'submissions', label: t('nav.submissions'), icon: <Package className="w-4 h-4" /> },
    { id: 'scheduled_reports', label: t('nav.scheduledReports'), icon: <Clock className="w-4 h-4" /> },
  ];

  const handleNewProject = () => {
    if (isServerMode) {
      setShowWizard(true);
      return;
    }

    if (hasLocalData) {
      setConfirmNewProject(true);
    } else {
      setShowWizard(true);
    }
  };

  const handleConfirmNewProject = () => {
    if (isServerMode) {
      setConfirmNewProject(false);
      setShowWizard(true);
      return;
    }

    useRequirementsStore.getState().setRequirements([], 1);
    useTestsStore.getState().setTests([], 1);
    clearProject();
    setConfirmNewProject(false);
    setShowWizard(true);
  };

  return (
    <ProjectDataProvider value={projectDataValue}>
      {wizardVisible ? (
        <Suspense fallback={<TabSpinner />}>
          <SetupWizard onComplete={() => setShowWizard(false)} />
        </Suspense>
      ) : (
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
              {isServerMode && projects.length > 0 && (
                <select
                  value={activeProject?.id ?? ''}
                  onChange={(event) => {
                    const nextProject = projects.find((candidate) => candidate.id === event.target.value) ?? null;
                    setActiveProject(nextProject);
                  }}
                  className="ml-2 max-w-[220px] rounded-lg border border-border bg-surface px-2.5 py-1.5 text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
                  aria-label="Project"
                >
                  {projects.map((serverProject) => (
                    <option key={serverProject.id} value={serverProject.id}>
                      {serverProject.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Server mode: migrate data button */}
              {isServerMode && isAuthenticated && <MigrateDataButton projectId={activeProject?.id} />}

              <GlobalSearch />
              <NotificationInbox />
              {/* Share Audit Link — admin only */}
              {isServerMode && isAuthenticated && <ShareAuditLink />}
              {/* Share Supplier Portal — admin only */}
              {isServerMode && isAuthenticated && <ShareSupplierLink />}

              <button
                onClick={() => setShowAuditTrail(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
              >
                <ScrollText className="w-4 h-4" />
                {t('audit.title')}
              </button>

              {/* Server mode: team button */}
              {isServerMode && isAuthenticated && (
                <button
                  onClick={() => setShowTeam(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
                >
                  <Users className="w-4 h-4" />
                  {t('auth.team')}
                </button>
              )}

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
              <button
                onClick={() => setShowImportWizard(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
                title={t('import.title')}
              >
                <FileSpreadsheet className="w-4 h-4" />
                {t('import.title')}
              </button>
              <button
                onClick={() => setShowExportPanel(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
                title={t('import.exportCsv')}
              >
                <Download className="w-4 h-4" />
                {t('import.exportCsv')}
              </button>

              {/* Server mode: user display + logout */}
              {isServerMode && isAuthenticated && user && (
                <div className="flex items-center gap-2 ml-1 pl-2 border-l border-border">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-text-secondary hidden sm:inline max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <button
                    onClick={logout}
                    className="p-1.5 rounded-lg text-text-tertiary hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title={t('auth.logout')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <nav className="-mb-px flex gap-1 overflow-x-auto scrollbar-thin">
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
        {shellLoading ? (
          <TabSpinner />
        ) : (
          <Suspense fallback={<TabSpinner />}>
            {activeTab === 'requirements' && <RequirementsTable />}
            {activeTab === 'tests' && <TestsTable />}
            {activeTab === 'dashboard' && <EvaluationDashboard />}
            {activeTab === 'reports' && <ReportGenerator />}
            {activeTab === 'design_control' && <DesignControlView />}
            {activeTab === 'complaints' && <ComplaintTrending />}
            {activeTab === 'suppliers' && <SupplierScorecard />}
            {activeTab === 'batches' && <BatchRecordForm />}
            {activeTab === 'training' && <TrainingDashboard />}
            {activeTab === 'documents' && <DocumentManager />}
            {activeTab === 'systems' && <SystemInventory />}
            {activeTab === 'impact' && <ImpactAnalysis />}
            {activeTab === 'pms' && <PMSDashboard />}
            {activeTab === 'udi' && <UDIManager />}
            {activeTab === 'stability' && <StabilityStudyView />}
            {activeTab === 'envmon' && <EnvironmentalMonitoring />}
            {activeTab === 'audit_records' && <AuditSchedule />}
            {activeTab === 'workflows' && <WorkflowInbox />}
            {activeTab === 'change_control' && <ChangeControlTracker />}
            {activeTab === 'deviations' && <DeviationInvestigationView />}
            {activeTab === 'tasks' && <TaskDashboard />}
            {activeTab === 'kpi' && <KPIDashboardManager />}
            {activeTab === 'forms' && <FormManagerView />}
            {activeTab === 'etmf' && <ETMFView />}
            {activeTab === 'econsent' && <EConsentManager />}
            {activeTab === 'submissions' && <SubmissionBuilder />}
            {activeTab === 'scheduled_reports' && <ScheduledReports />}
            {activeTab === 'settings' && <SettingsPage />}
          </Suspense>
        )}
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

      {/* Team / Workspace Modal */}
      <WorkspaceManager open={showTeam} onClose={() => setShowTeam(false)} />

      {/* Import Wizard */}
      <ImportWizard open={showImportWizard} onClose={() => setShowImportWizard(false)} />

      {/* Export Panel */}
      <ExportPanel open={showExportPanel} onClose={() => setShowExportPanel(false)} />
    </div>
      )}
    </ProjectDataProvider>
  );
}
