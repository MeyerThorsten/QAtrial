import { useState, useCallback } from 'react';
import { Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StepCompliancePack } from './StepCompliancePack';
import { StepCountry } from './StepCountry';
import { StepVertical } from './StepVertical';
import { StepMetadata } from './StepMetadata';
import { StepProjectType } from './StepProjectType';
import { StepModules } from './StepModules';
import { StepPreview } from './StepPreview';
import { composeTemplate } from '../../templates/composer';
import type { ComposeResult } from '../../templates/composer';
import { useProjectStore } from '../../store/useProjectStore';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useTestsStore } from '../../store/useTestsStore';
import { useAuditStore } from '../../store/useAuditStore';
import { useAppMode } from '../../hooks/useAppMode';
import { apiFetch } from '../../lib/apiClient';
import { useProjectData } from '../../context/ProjectDataContext';
import { generateId } from '../../lib/idGenerator';
import type { IndustryVertical } from '../../types';
import type { DemoProject } from '../../lib/demoProjects';
import type { CompliancePack } from '../../templates/packs';

const TOTAL_STEPS = 7; // 0=packs, 1=country, 2=vertical, 3=metadata, 4=type, 5=modules, 6=preview

interface MetaData {
  name: string;
  description: string;
  owner: string;
  version: string;
}

export function SetupWizard({ onComplete }: { onComplete: () => void }) {
  const { t } = useTranslation();
  const { mode } = useAppMode();
  const { refetchProjects, setActiveProject } = useProjectData();

  const [step, setStep] = useState(0);
  const [country, setCountry] = useState<string | null>(null);
  const [vertical, setVertical] = useState<string | null>(null);
  const [meta, setMeta] = useState<MetaData>({ name: '', description: '', owner: '', version: '1.0' });
  const [projectType, setProjectType] = useState<string>('software');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [composedTemplate, setComposedTemplate] = useState<ComposeResult | null>(null);
  const [selectedReqs, setSelectedReqs] = useState<boolean[]>([]);
  const [selectedTests, setSelectedTests] = useState<boolean[]>([]);
  const [creating, setCreating] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleToggleModule = useCallback((id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  }, []);

  /** Handle compliance pack selection — auto-fills fields and skips to metadata */
  const handleSelectPack = useCallback((pack: CompliancePack) => {
    setCountry(pack.country);
    setVertical(pack.vertical);
    setProjectType(pack.projectType);
    setSelectedModules(pack.modules);
    setStep(3); // Jump to metadata step
  }, []);

  /** Pre-fill all wizard fields from a demo project and jump to the vertical step */
  const handleLoadDemo = useCallback((demo: DemoProject) => {
    setCountry(demo.countryCode);
    setVertical(demo.vertical);
    setMeta({
      name: demo.projectName,
      description: demo.description,
      owner: demo.owner,
      version: demo.version,
    });
    setProjectType(demo.projectType);
    setSelectedModules(demo.modules);
    // Advance to step 2 so user can review and continue through the wizard
    setStep(2);
  }, []);

  /** Compose template and enter the Preview step */
  const enterPreview = useCallback(async () => {
    if (!country) return;

    if (projectType === 'empty') {
      // Skip composition for empty projects
      setComposedTemplate({ requirements: [], tests: [] });
      setSelectedReqs([]);
      setSelectedTests([]);
      setStep(6);
      return;
    }

    const result = await composeTemplate({
      country,
      vertical: vertical ?? undefined,
      projectType: projectType !== 'empty' ? projectType : undefined,
      modules: selectedModules,
    });

    setComposedTemplate(result);
    setSelectedReqs(result.requirements.map(() => true));
    setSelectedTests(result.tests.map(() => true));
    setStep(6);
  }, [country, vertical, projectType, selectedModules]);

  const handleCreate = useCallback(async () => {
    const setProject = useProjectStore.getState().setProject;
    const setReqState = useRequirementsStore.getState().setRequirements;
    const setTestState = useTestsStore.getState().setTests;
    const auditLog = useAuditStore.getState().log;
    const now = new Date().toISOString();

    setCreating(true);
    setSaveError(null);

    try {
      if (mode === 'server') {
        const projectResponse = await apiFetch<{
          project: {
            id: string;
            name: string;
            description: string;
            owner: string;
            version: string;
            type: 'software' | 'embedded' | 'compliance' | 'empty';
            createdAt?: string;
            country?: string;
            vertical?: IndustryVertical | null;
            modules?: string[];
          };
        }>('/projects', {
          method: 'POST',
          body: JSON.stringify({
            name: meta.name,
            description: meta.description,
            owner: meta.owner,
            version: meta.version,
            type: projectType,
            country: country ?? undefined,
            vertical: vertical ?? undefined,
            modules: selectedModules,
          }),
        });

        const createdProject = {
          ...projectResponse.project,
          createdAt: projectResponse.project.createdAt ?? now,
          vertical: projectResponse.project.vertical ?? undefined,
        };

        const requirementIdMap: Record<number, string> = {};

        if (composedTemplate) {
          for (const [index, req] of composedTemplate.requirements.entries()) {
            if (!selectedReqs[index]) continue;

            const result = await apiFetch<{ requirement: { id: string } }>('/requirements', {
              method: 'POST',
              body: JSON.stringify({
                projectId: createdProject.id,
                title: `[${req.category}] ${req.title}`,
                description: req.description,
                status: 'Draft',
                tags: req.tags,
                regulatoryRef: req.regulatoryRef,
              }),
            });

            requirementIdMap[index] = result.requirement.id;
          }

          for (const [index, test] of composedTemplate.tests.entries()) {
            if (!selectedTests[index]) continue;

            const linkedRequirementIds = composedTemplate.requirements
              .map((req, reqIndex) => {
                if (!selectedReqs[reqIndex]) return null;
                const hasTagMatch = test.linkedReqTags.some((tag) => req.tags.includes(tag));
                return hasTagMatch ? requirementIdMap[reqIndex] ?? null : null;
              })
              .filter((value): value is string => Boolean(value));

            await apiFetch('/tests', {
              method: 'POST',
              body: JSON.stringify({
                projectId: createdProject.id,
                title: `[${test.category}] ${test.title}`,
                description: test.description,
                status: 'Not Run',
                linkedRequirementIds,
              }),
            });
          }
        }

        setProject(createdProject);
        setReqState([], 1);
        setTestState([], 1);
        useAuditStore.setState({ entries: [] });
        setActiveProject(createdProject);
        await refetchProjects();
        onComplete();
        return;
      }

      // Clear existing data
      setReqState([], 1);
      setTestState([], 1);

      // Set project metadata
      setProject({
        name: meta.name,
        description: meta.description,
        owner: meta.owner,
        version: meta.version,
        type: projectType as 'software' | 'embedded' | 'compliance' | 'empty',
        createdAt: now,
        country: country ?? undefined,
        vertical: (vertical as IndustryVertical) ?? undefined,
        modules: selectedModules.length > 0 ? selectedModules : undefined,
      });

      if (!composedTemplate || (composedTemplate.requirements.length === 0 && composedTemplate.tests.length === 0)) {
        auditLog('create', 'project', meta.name, undefined, meta.name, 'Project created via wizard');
        onComplete();
        return;
      }

      // Create selected requirements
      const reqIdMap: Record<number, string> = {};
      let reqCounter = 1;

      const reqs = composedTemplate.requirements
        .map((req, index) => {
          if (!selectedReqs[index]) return null;
          const id = generateId('REQ', reqCounter);
          reqIdMap[index] = id;
          reqCounter++;
          return {
            id,
            title: `[${req.category}] ${req.title}`,
            description: req.description,
            status: 'Draft' as const,
            createdAt: now,
            updatedAt: now,
          };
        })
        .filter(Boolean) as Array<{
          id: string; title: string; description: string;
          status: 'Draft'; createdAt: string; updatedAt: string;
        }>;

      setReqState(reqs, reqCounter);

      // Create selected tests with tag-based linking
      const tests = composedTemplate.tests
        .map((test, index) => {
          if (!selectedTests[index]) return null;
          // Link tests to requirements by matching tags
          const linkedIds = composedTemplate.requirements
            .map((req, ri) => {
              if (!selectedReqs[ri]) return null;
              const hasMatch = test.linkedReqTags.some((tag) => req.tags.includes(tag));
              return hasMatch ? reqIdMap[ri] : null;
            })
            .filter(Boolean) as string[];
          return {
            id: generateId('TST', index + 1),
            title: `[${test.category}] ${test.title}`,
            description: test.description,
            status: 'Not Run' as const,
            linkedRequirementIds: linkedIds,
            createdAt: now,
            updatedAt: now,
          };
        })
        .filter(Boolean) as Array<{
          id: string; title: string; description: string;
          status: 'Not Run'; linkedRequirementIds: string[];
          createdAt: string; updatedAt: string;
        }>;

      // Renumber test IDs to be sequential
      let testCounter = 1;
      const finalTests = tests.map((tst) => ({
        ...tst,
        id: generateId('TST', testCounter++),
      }));

      setTestState(finalTests, testCounter);

      // Audit entry
      auditLog(
        'create',
        'project',
        meta.name,
        undefined,
        JSON.stringify({ country, vertical, modules: selectedModules, reqs: reqs.length, tests: finalTests.length }),
        'Project created via wizard',
      );

      onComplete();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to create project');
    } finally {
      setCreating(false);
    }
  }, [
    composedTemplate,
    country,
    meta,
    mode,
    onComplete,
    projectType,
    refetchProjects,
    selectedModules,
    selectedReqs,
    selectedTests,
    setActiveProject,
    vertical,
  ]);

  // Display step is 1-indexed for the progress bar; internal step is 0-indexed
  const displayStep = step + 1;

  return (
    <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-lg w-full max-w-2xl border border-border">
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">{t('wizard.title')}</h1>
              <p className="text-sm text-text-tertiary">{t('wizard.stepOf', { step: displayStep, total: TOTAL_STEPS })}</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="flex gap-2 mt-4">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? 'bg-accent' : 'bg-surface-tertiary'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-4">
          {step === 0 && (
            <StepCompliancePack
              onSelectPack={handleSelectPack}
              onSkip={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <StepCountry
              selected={country}
              onSelect={setCountry}
              onNext={() => setStep(2)}
              onLoadDemo={handleLoadDemo}
            />
          )}
          {step === 2 && country && (
            <StepVertical
              countryCode={country}
              selected={vertical}
              onSelect={setVertical}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <StepMetadata
              meta={meta}
              onChange={setMeta}
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
            />
          )}
          {step === 4 && (
            <StepProjectType
              selected={projectType}
              onSelect={setProjectType}
              onBack={() => setStep(3)}
              onNext={() => {
                if (projectType === 'empty') {
                  // Skip modules, go directly to compose & create
                  enterPreview();
                } else {
                  setStep(5);
                }
              }}
            />
          )}
          {step === 5 && (
            <StepModules
              selected={selectedModules}
              onToggle={handleToggleModule}
              onBack={() => setStep(4)}
              onNext={enterPreview}
            />
          )}
          {step === 6 && composedTemplate && (
            <StepPreview
              requirements={composedTemplate.requirements}
              tests={composedTemplate.tests}
              selectedReqs={selectedReqs}
              selectedTests={selectedTests}
              onToggleReq={(i) => setSelectedReqs((prev) => prev.map((v, j) => (j === i ? !v : v)))}
              onToggleTest={(i) => setSelectedTests((prev) => prev.map((v, j) => (j === i ? !v : v)))}
              onBack={() => setStep(5)}
              onCreate={handleCreate}
              creating={creating}
              errorMessage={saveError}
            />
          )}
        </div>
      </div>
    </div>
  );
}
