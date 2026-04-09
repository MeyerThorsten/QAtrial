'use no memo';

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
} from '@tanstack/react-table';
import { Plus, Pencil, Trash2, ArrowUpDown, Search, Paperclip } from 'lucide-react';
import { useTestsStore } from '../../store/useTestsStore';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useEvidenceStore } from '../../store/useEvidenceStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useAppMode } from '../../hooks/useAppMode';
import { StatusBadge } from '../shared/StatusBadge';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { EmptyState } from '../shared/EmptyState';
import { TestModal } from './TestModal';
import { EvidencePanel } from '../evidence/EvidencePanel';
import { useProjectData } from '../../context/ProjectDataContext';
import { getProjectId } from '../../lib/projectUtils';
import type { Test } from '../../types';

const columnHelper = createColumnHelper<Test>();

export function TestsTable() {
  const { t } = useTranslation();
  const { mode } = useAppMode();
  const isServerMode = mode === 'server';
  const tests = useTestsStore((s) => s.tests);
  const addTest = useTestsStore((s) => s.addTest);
  const updateTest = useTestsStore((s) => s.updateTest);
  const deleteTest = useTestsStore((s) => s.deleteTest);
  const requirements = useRequirementsStore((s) => s.requirements);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [evidenceTest, setEvidenceTest] = useState<Test | null>(null);
  const evidenceAttachments = useEvidenceStore((s) => s.attachments);
  const project = useProjectStore((s) => s.project);
  const {
    createTest: createServerTest,
    updateTest: updateServerTest,
    removeTest: removeServerTest,
  } = useProjectData();
  const projectId = getProjectId(project);

  const reqMap = useMemo(() => new Map(requirements.map((r) => [r.id, r])), [requirements]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: t('tests.id'),
        cell: (info) => <span className="font-mono text-xs text-text-tertiary">{info.getValue()}</span>,
        size: 100,
      }),
      columnHelper.accessor('title', {
        header: t('tests.title'),
        cell: (info) => <span className="font-medium text-text-primary">{info.getValue()}</span>,
      }),
      columnHelper.accessor('description', {
        header: t('tests.description'),
        cell: (info) => (
          <span className="text-text-secondary text-sm truncate max-w-xs block">
            {info.getValue() || '—'}
          </span>
        ),
      }),
      columnHelper.accessor('status', {
        header: t('tests.status'),
        cell: (info) => <StatusBadge status={info.getValue()} type="test" />,
        size: 100,
      }),
      columnHelper.accessor('linkedRequirementIds', {
        header: t('tests.requirements'),
        cell: (info) => {
          const ids = info.getValue();
          if (ids.length === 0) {
            return <span className="text-danger text-xs font-medium">{t('tests.noLinked')}</span>;
          }
          return (
            <div className="flex flex-wrap gap-1">
              {ids.map((id) => (
                <span
                  key={id}
                  className="inline-flex items-center rounded-md bg-accent-subtle px-1.5 py-0.5 text-xs font-mono text-accent-text"
                  title={reqMap.get(id)?.title}
                >
                  {id}
                </span>
              ))}
            </div>
          );
        },
        size: 180,
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const evCount = evidenceAttachments.filter((a) => a.entityId === row.original.id).length;
          return (
            <div className="flex items-center gap-1">
              {/* Evidence button */}
              <button
                onClick={() => setEvidenceTest(row.original)}
                className="relative p-1.5 text-text-tertiary hover:text-accent rounded-lg hover:bg-accent-subtle transition-colors"
                title={t('evidence.title')}
              >
                <Paperclip className="w-3.5 h-3.5" />
                {evCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-accent text-white text-[9px] font-bold flex items-center justify-center">
                    {evCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => { setEditingTest(row.original); setModalOpen(true); }}
                className="p-1.5 text-text-tertiary hover:text-accent rounded-lg hover:bg-accent-subtle transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeleteId(row.original.id)}
                className="p-1.5 text-text-tertiary hover:text-danger rounded-lg hover:bg-danger-subtle transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        },
        size: 110,
      }),
    ],
    [reqMap, t, evidenceAttachments]
  );

  const table = useReactTable({
    data: tests,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder={t('common.search')}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 pr-3 py-2 bg-input-bg border border-input-border rounded-lg text-sm w-64 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
          />
        </div>
        <button
          onClick={() => { setEditingTest(null); setModalOpen(true); }}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-colors font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {t('tests.addTest')}
        </button>
      </div>

      {tests.length === 0 && !globalFilter ? (
        <EmptyState
          title={t('tests.noTests')}
          description={t('tests.noTestsDesc')}
          action={{ label: t('tests.createTest'), onClick: () => { setEditingTest(null); setModalOpen(true); } }}
        />
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-surface-tertiary border-b border-border">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider cursor-pointer select-none"
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && <ArrowUpDown className="w-3 h-3 text-text-tertiary" />}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-border-subtle hover:bg-surface-hover transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TestModal
        open={modalOpen}
        test={editingTest}
        onSave={(data) => {
          if (editingTest) {
            if (isServerMode) {
              void updateServerTest(editingTest.id, data);
            } else {
              updateTest(editingTest.id, data);
            }
          } else {
            if (isServerMode) {
              void createServerTest(data);
            } else {
              addTest(data);
            }
          }
        }}
        onClose={() => { setModalOpen(false); setEditingTest(null); }}
      />

      <ConfirmDialog
        open={deleteId !== null}
        title={t('tests.deleteTitle')}
        message={t('tests.deleteMessage')}
        onConfirm={() => {
          if (deleteId) {
            if (isServerMode) {
              void removeServerTest(deleteId);
            } else {
              deleteTest(deleteId);
            }
          }
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />

      {/* Evidence Panel */}
      <EvidencePanel
        open={evidenceTest !== null}
        entityType="test"
        entityId={evidenceTest?.id ?? ''}
        projectId={projectId}
        onClose={() => setEvidenceTest(null)}
      />
    </div>
  );
}
