import { useRequirementsStore } from './useRequirementsStore';
import { useTestsStore } from './useTestsStore';
import type { ProjectData } from '../types';

export function useImportExport() {
  const requirements = useRequirementsStore((s) => s.requirements);
  const reqCounter = useRequirementsStore((s) => s.reqCounter);
  const tests = useTestsStore((s) => s.tests);
  const testCounter = useTestsStore((s) => s.testCounter);
  const setRequirements = useRequirementsStore((s) => s.setRequirements);
  const setTests = useTestsStore((s) => s.setTests);

  const exportData = () => {
    const data: ProjectData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      requirements,
      tests,
      counters: { reqCounter, testCounter },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qatrial-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string) as ProjectData;
          if (data.version !== 1) {
            resolve({ success: false, message: 'Unsupported file version.' });
            return;
          }
          if (!Array.isArray(data.requirements) || !Array.isArray(data.tests)) {
            resolve({ success: false, message: 'Invalid file format.' });
            return;
          }
          // Validate referential integrity: strip dangling links
          const reqIds = new Set(data.requirements.map((r) => r.id));
          const cleanedTests = data.tests.map((t) => ({
            ...t,
            linkedRequirementIds: t.linkedRequirementIds.filter((id) => reqIds.has(id)),
          }));

          setRequirements(data.requirements, data.counters?.reqCounter ?? data.requirements.length + 1);
          setTests(cleanedTests, data.counters?.testCounter ?? cleanedTests.length + 1);
          resolve({ success: true, message: `Imported ${data.requirements.length} requirements and ${cleanedTests.length} tests.` });
        } catch {
          resolve({ success: false, message: 'Failed to parse JSON file.' });
        }
      };
      reader.readAsText(file);
    });
  };

  return { exportData, importData };
}
