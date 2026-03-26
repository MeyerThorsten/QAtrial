import { useState } from 'react';
import { ClipboardList, FlaskConical, BarChart3 } from 'lucide-react';
import { ImportExportBar } from '../shared/ImportExportBar';
import { RequirementsTable } from '../requirements/RequirementsTable';
import { TestsTable } from '../tests/TestsTable';
import { EvaluationDashboard } from '../dashboard/EvaluationDashboard';
import type { ViewTab } from '../../types';

const tabs: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
  { id: 'requirements', label: 'Requirements', icon: <ClipboardList className="w-4 h-4" /> },
  { id: 'tests', label: 'Tests', icon: <FlaskConical className="w-4 h-4" /> },
  { id: 'dashboard', label: 'Auswertung', icon: <BarChart3 className="w-4 h-4" /> },
];

export function AppShell() {
  const [activeTab, setActiveTab] = useState<ViewTab>('requirements');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <h1 className="text-lg font-semibold text-gray-900">QAtrial</h1>
            <ImportExportBar />
          </div>
          <nav className="-mb-px flex gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-1 py-3 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
        {activeTab === 'requirements' && <RequirementsTable />}
        {activeTab === 'tests' && <TestsTable />}
        {activeTab === 'dashboard' && <EvaluationDashboard />}
      </main>
    </div>
  );
}
