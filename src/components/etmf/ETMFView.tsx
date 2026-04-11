import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight, Upload, Check, Ban, ShieldCheck, FolderOpen, Loader2, AlertTriangle } from 'lucide-react';
import { apiFetch } from '../../lib/apiClient';
import { useProjectStore } from '../../store/useProjectStore';
import { getProjectId } from '../../lib/projectUtils';

interface ZoneStats {
  id: string;
  number: number;
  name: string;
  sectionCount: number;
  artifactCount: number;
  uploaded: number;
  approved: number;
  notApplicable: number;
  completeness: number;
}

interface SectionStats {
  id: string;
  number: string;
  name: string;
  artifactCount: number;
  uploaded: number;
  approved: number;
  notApplicable: number;
  completeness: number;
}

interface Artifact {
  id: string;
  sectionId: string;
  name: string;
  fileName: string | null;
  fileSize: number | null;
  storagePath: string | null;
  status: string;
  retentionYears: number;
  uploadedBy: string | null;
  uploadedAt: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
}

interface InspectionReadiness {
  score: number;
  level: string;
  uploaded: number;
  approved: number;
  missing: number;
  total: number;
}

interface CompletenessData {
  overall: { total: number; applicable: number; uploaded: number; approved: number; completeness: number };
  perZone: { zoneNumber: number; zoneName: string; total: number; applicable: number; uploaded: number; approved: number; completeness: number }[];
}

export function ETMFView() {
  const { t } = useTranslation();
  const project = useProjectStore((s) => s.project);
  const projectId = getProjectId(project);

  const [zones, setZones] = useState<ZoneStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);
  const [readiness, setReadiness] = useState<InspectionReadiness | null>(null);
  const [completeness, setCompleteness] = useState<CompletenessData | null>(null);

  const [expandedZone, setExpandedZone] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [sections, setSections] = useState<Record<string, SectionStats[]>>({});
  const [artifacts, setArtifacts] = useState<Record<string, Artifact[]>>({});
  const [loadingSections, setLoadingSections] = useState<string | null>(null);
  const [loadingArtifacts, setLoadingArtifacts] = useState<string | null>(null);

  const loadZones = useCallback(async () => {
    if (!projectId) return;
    try {
      const data = await apiFetch<{ zones: ZoneStats[] }>(`/etmf/${projectId}/zones`);
      setZones(data.zones);
    } catch {
      setZones([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const loadReadiness = useCallback(async () => {
    if (!projectId) return;
    try {
      const data = await apiFetch<InspectionReadiness>(`/etmf/${projectId}/inspection-readiness`);
      setReadiness(data);
    } catch {
      setReadiness(null);
    }
  }, [projectId]);

  const loadCompleteness = useCallback(async () => {
    if (!projectId) return;
    try {
      const data = await apiFetch<CompletenessData>(`/etmf/${projectId}/completeness`);
      setCompleteness(data);
    } catch {
      setCompleteness(null);
    }
  }, [projectId]);

  useEffect(() => {
    loadZones();
    loadReadiness();
    loadCompleteness();
  }, [loadZones, loadReadiness, loadCompleteness]);

  const initializeTMF = async () => {
    if (!projectId) return;
    setInitializing(true);
    try {
      await apiFetch(`/etmf/${projectId}/initialize`, { method: 'POST' });
      await loadZones();
      await loadReadiness();
      await loadCompleteness();
    } catch (err) {
      console.error('Failed to initialize TMF:', err);
    } finally {
      setInitializing(false);
    }
  };

  const toggleZone = async (zoneId: string) => {
    if (expandedZone === zoneId) {
      setExpandedZone(null);
      return;
    }
    setExpandedZone(zoneId);
    setExpandedSection(null);

    if (!sections[zoneId]) {
      setLoadingSections(zoneId);
      try {
        const data = await apiFetch<{ sections: SectionStats[] }>(`/etmf/${projectId}/zones/${zoneId}/sections`);
        setSections((prev) => ({ ...prev, [zoneId]: data.sections }));
      } catch {
        setSections((prev) => ({ ...prev, [zoneId]: [] }));
      } finally {
        setLoadingSections(null);
      }
    }
  };

  const toggleSection = async (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
      return;
    }
    setExpandedSection(sectionId);

    if (!artifacts[sectionId]) {
      setLoadingArtifacts(sectionId);
      try {
        const data = await apiFetch<{ artifacts: Artifact[] }>(`/etmf/${projectId}/sections/${sectionId}/artifacts`);
        setArtifacts((prev) => ({ ...prev, [sectionId]: data.artifacts }));
      } catch {
        setArtifacts((prev) => ({ ...prev, [sectionId]: [] }));
      } finally {
        setLoadingArtifacts(null);
      }
    }
  };

  const uploadArtifact = async (artifactId: string) => {
    if (!projectId) return;
    // Simulate file selection — in production use a file input
    const fileName = `document_${Date.now()}.pdf`;
    try {
      await apiFetch(`/etmf/${projectId}/artifacts/${artifactId}/upload`, {
        method: 'POST',
        body: JSON.stringify({ fileName, fileSize: 1024 }),
      });
      // Refresh data
      setArtifacts({});
      setSections({});
      setExpandedSection(null);
      setExpandedZone(null);
      await loadZones();
      await loadReadiness();
      await loadCompleteness();
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const approveArtifact = async (artifactId: string) => {
    if (!projectId) return;
    try {
      await apiFetch(`/etmf/${projectId}/artifacts/${artifactId}/approve`, { method: 'PUT' });
      setArtifacts({});
      setSections({});
      setExpandedSection(null);
      setExpandedZone(null);
      await loadZones();
      await loadReadiness();
      await loadCompleteness();
    } catch (err) {
      console.error('Approve failed:', err);
    }
  };

  const markNA = async (artifactId: string) => {
    if (!projectId) return;
    try {
      await apiFetch(`/etmf/${projectId}/artifacts/${artifactId}/na`, { method: 'PUT' });
      setArtifacts({});
      setSections({});
      setExpandedSection(null);
      setExpandedZone(null);
      await loadZones();
      await loadReadiness();
      await loadCompleteness();
    } catch (err) {
      console.error('Mark N/A failed:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-md"><Check className="w-3 h-3" />{t('etmf.approved')}</span>;
      case 'uploaded':
        return <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded-md"><Upload className="w-3 h-3" />{t('etmf.uploaded')}</span>;
      case 'not_applicable':
        return <span className="inline-flex items-center gap-1 text-xs font-medium text-text-tertiary bg-surface-secondary px-1.5 py-0.5 rounded-md"><Ban className="w-3 h-3" />{t('etmf.notApplicable')}</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-xs font-medium text-text-tertiary bg-surface-secondary px-1.5 py-0.5 rounded-md">{t('etmf.expected')}</span>;
    }
  };

  const readinessColor = readiness
    ? readiness.level === 'inspection_ready' ? 'text-green-600'
    : readiness.level === 'near_ready' ? 'text-amber-600'
    : readiness.level === 'in_progress' ? 'text-orange-500'
    : 'text-red-500'
    : 'text-text-tertiary';

  if (!projectId) {
    return <div className="text-center text-text-tertiary py-12">{t('etmf.noProject')}</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }

  if (zones.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <FolderOpen className="w-12 h-12 mx-auto text-text-tertiary" />
        <h3 className="text-lg font-semibold text-text-primary">{t('etmf.noTMF')}</h3>
        <p className="text-sm text-text-secondary">{t('etmf.initializeDescription')}</p>
        <button
          onClick={initializeTMF}
          disabled={initializing}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gradient-start to-gradient-end rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {initializing && <Loader2 className="w-4 h-4 animate-spin" />}
          {t('etmf.initializeTMF')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">{t('etmf.title')}</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall Completeness */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="text-sm font-medium text-text-secondary mb-2">{t('etmf.overallCompleteness')}</div>
          <div className="text-3xl font-bold text-text-primary">{completeness?.overall.completeness ?? 0}%</div>
          <div className="mt-2 h-2 bg-surface-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gradient-start to-gradient-end rounded-full transition-all"
              style={{ width: `${completeness?.overall.completeness ?? 0}%` }}
            />
          </div>
          <div className="mt-2 flex gap-3 text-xs text-text-tertiary">
            <span>{completeness?.overall.uploaded ?? 0} {t('etmf.uploaded')}</span>
            <span>{completeness?.overall.approved ?? 0} {t('etmf.approved')}</span>
          </div>
        </div>

        {/* Inspection Readiness */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="text-sm font-medium text-text-secondary mb-2">{t('etmf.inspectionReadiness')}</div>
          <div className={`text-3xl font-bold ${readinessColor}`}>
            {readiness?.score ?? 0}%
          </div>
          <div className="mt-2 flex items-center gap-2">
            <ShieldCheck className={`w-4 h-4 ${readinessColor}`} />
            <span className={`text-sm font-medium ${readinessColor}`}>
              {readiness ? t(`etmf.readiness_${readiness.level}`) : t('etmf.readiness_not_started')}
            </span>
          </div>
          {readiness && readiness.missing > 0 && (
            <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
              <AlertTriangle className="w-3 h-3" />
              {readiness.missing} {t('etmf.artifactsMissing')}
            </div>
          )}
        </div>

        {/* Artifact Summary */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="text-sm font-medium text-text-secondary mb-2">{t('etmf.artifactSummary')}</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">{t('etmf.totalArtifacts')}</span>
              <span className="font-medium text-text-primary">{completeness?.overall.total ?? 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-600">{t('etmf.approved')}</span>
              <span className="font-medium text-green-600">{completeness?.overall.approved ?? 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-amber-600">{t('etmf.uploaded')}</span>
              <span className="font-medium text-amber-600">{(completeness?.overall.uploaded ?? 0) - (completeness?.overall.approved ?? 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Accordion */}
      <div className="space-y-2">
        {zones.map((zone) => (
          <div key={zone.id} className="bg-surface border border-border rounded-lg overflow-hidden">
            {/* Zone Header */}
            <button
              onClick={() => toggleZone(zone.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-3">
                {expandedZone === zone.id ? <ChevronDown className="w-4 h-4 text-text-tertiary" /> : <ChevronRight className="w-4 h-4 text-text-tertiary" />}
                <span className="text-sm font-semibold text-accent">Zone {zone.number}</span>
                <span className="text-sm font-medium text-text-primary">{zone.name}</span>
                <span className="text-xs text-text-tertiary">({zone.sectionCount} sections, {zone.artifactCount} artifacts)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-surface-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${zone.completeness}%`,
                      background: zone.completeness >= 80 ? '#22c55e' : zone.completeness >= 50 ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-text-secondary w-10 text-right">{zone.completeness}%</span>
              </div>
            </button>

            {/* Sections */}
            {expandedZone === zone.id && (
              <div className="border-t border-border">
                {loadingSections === zone.id ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  </div>
                ) : (
                  (sections[zone.id] ?? []).map((section) => (
                    <div key={section.id} className="border-b border-border last:border-b-0">
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between px-6 py-2.5 hover:bg-surface-hover transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {expandedSection === section.id ? <ChevronDown className="w-3.5 h-3.5 text-text-tertiary" /> : <ChevronRight className="w-3.5 h-3.5 text-text-tertiary" />}
                          <span className="text-xs font-medium text-accent">{section.number}</span>
                          <span className="text-sm text-text-primary">{section.name}</span>
                          <span className="text-xs text-text-tertiary">({section.artifactCount})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-surface-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${section.completeness}%`,
                                background: section.completeness >= 80 ? '#22c55e' : section.completeness >= 50 ? '#f59e0b' : '#ef4444',
                              }}
                            />
                          </div>
                          <span className="text-xs text-text-tertiary w-8 text-right">{section.completeness}%</span>
                        </div>
                      </button>

                      {/* Artifacts */}
                      {expandedSection === section.id && (
                        <div className="bg-surface-secondary px-8 py-2">
                          {loadingArtifacts === section.id ? (
                            <div className="flex items-center justify-center py-3">
                              <Loader2 className="w-4 h-4 animate-spin text-accent" />
                            </div>
                          ) : (
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-xs text-text-tertiary border-b border-border">
                                  <th className="text-left py-1.5 font-medium">{t('etmf.artifact')}</th>
                                  <th className="text-left py-1.5 font-medium w-28">{t('etmf.status')}</th>
                                  <th className="text-left py-1.5 font-medium w-32">{t('etmf.fileName')}</th>
                                  <th className="text-right py-1.5 font-medium w-40">{t('common.actions')}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(artifacts[section.id] ?? []).map((artifact) => (
                                  <tr key={artifact.id} className="border-b border-border/50 last:border-b-0">
                                    <td className="py-2 text-text-primary">{artifact.name}</td>
                                    <td className="py-2">{getStatusBadge(artifact.status)}</td>
                                    <td className="py-2 text-text-tertiary text-xs truncate max-w-[120px]">{artifact.fileName ?? '-'}</td>
                                    <td className="py-2 text-right">
                                      <div className="flex items-center justify-end gap-1">
                                        {artifact.status === 'expected' && (
                                          <>
                                            <button
                                              onClick={() => uploadArtifact(artifact.id)}
                                              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-accent bg-accent-subtle rounded hover:opacity-80 transition-opacity"
                                            >
                                              <Upload className="w-3 h-3" />
                                              {t('etmf.upload')}
                                            </button>
                                            <button
                                              onClick={() => markNA(artifact.id)}
                                              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-text-tertiary bg-surface rounded hover:opacity-80 transition-opacity border border-border"
                                            >
                                              <Ban className="w-3 h-3" />
                                              N/A
                                            </button>
                                          </>
                                        )}
                                        {artifact.status === 'uploaded' && (
                                          <button
                                            onClick={() => approveArtifact(artifact.id)}
                                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-600 bg-green-500/10 rounded hover:opacity-80 transition-opacity"
                                          >
                                            <Check className="w-3 h-3" />
                                            {t('etmf.approve')}
                                          </button>
                                        )}
                                        {artifact.status === 'not_applicable' && (
                                          <span className="text-xs text-text-tertiary italic">{t('etmf.markedNA')}</span>
                                        )}
                                        {artifact.status === 'approved' && (
                                          <span className="text-xs text-green-600 italic">{t('etmf.fullyApproved')}</span>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ETMFView;
