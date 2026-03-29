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
import { Plus, Pencil, Trash2, ArrowUpDown, Search, Sparkles, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useTestsStore } from '../../store/useTestsStore';
import { useLLMStore } from '../../store/useLLMStore';
import { useAuditStore } from '../../store/useAuditStore';
import { StatusBadge } from '../shared/StatusBadge';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { EmptyState } from '../shared/EmptyState';
import { RequirementModal } from './RequirementModal';
import { SignatureModal } from '../audit/SignatureModal';
import { TestGenerationPanel } from '../ai/TestGenerationPanel';
import { RiskClassificationPanel } from '../ai/RiskClassificationPanel';
import { isApproved } from '../../lib/approvalHelpers';
import type { Requirement } from '../../types';

const columnHelper = createColumnHelper<Requirement & { linkedTestCount: number }>();

export function RequirementsTable() {
  const { t } = useTranslation();
  const requirements = useRequirementsStore((s) => s.requirements);
  const addRequirement = useRequirementsStore((s) => s.addRequirement);
  const updateRequirement = useRequirementsStore((s) => s.updateRequirement);
  const deleteRequirement = useRequirementsStore((s) => s.deleteRequirement);
  const tests = useTestsStore((s) => s.tests);
  const hasAnyProvider = useLLMStore((s) => s.hasAnyProvider());
  // Subscribe to audit entries so approval badges re-render when signatures are added
  const auditEntries = useAuditStore((s) => s.entries);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReq, setEditingReq] = useState<Requirement | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [testGenReqId, setTestGenReqId] = useState<string | null>(null);
  const [riskClassReqId, setRiskClassReqId] = useState<string | null>(null);
  const [signReq, setSignReq] = useState<Requirement | null>(null);

  const data = useMemo(
    () =>
      requirements.map((r) => ({
        ...r,
        linkedTestCount: tests.filter((t) => t.linkedRequirementIds.includes(r.id)).length,
      })),
    [requirements, tests]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: t('requirements.id'),
        cell: (info) => <span className="font-mono text-xs text-text-tertiary">{info.getValue()}</span>,
        size: 100,
      }),
      columnHelper.accessor('title', {
        header: t('requirements.title'),
        cell: (info) => <span className="font-medium text-text-primary">{info.getValue()}</span>,
      }),
      columnHelper.accessor('description', {
        header: t('requirements.description'),
        cell: (info) => (
          <span className="text-text-secondary text-sm truncate max-w-xs block">
            {info.getValue() || '\u2014'}
          </span>
        ),
      }),
      columnHelper.accessor('status', {
        header: t('requirements.status'),
        cell: (info) => {
          const req = info.row.original;
          const approved = isApproved(req.id);
          return (
            <div className="flex items-center gap-1.5">
              <StatusBadge status={info.getValue()} type="requirement" />
              {approved && (
                <span className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium bg-badge-passed-bg text-badge-passed-text">
                  <ShieldCheck className="w-3 h-3" />
                  {t('statuses.Approved')}
                </span>
              )}
            </div>
          );
        },
        size: 160,
      }),
      columnHelper.accessor('linkedTestCount', {
        header: t('requirements.tests'),
        cell: (info) => {
          const count = info.getValue();
          return (
            <span className={`text-sm font-medium ${count === 0 ? 'text-danger' : 'text-success'}`}>
              {count}
            </span>
          );
        },
        size: 80,
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {/* Sign button — only for Active requirements that are not yet approved */}
            {row.original.status === 'Active' && !isApproved(row.original.id) && (
              <button
                onClick={() => setSignReq(row.original)}
                className="p-1.5 text-text-tertiary hover:text-accent rounded-lg hover:bg-accent-subtle transition-colors"
                title={t('changeControl.approve')}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </button>
            )}
            {hasAnyProvider && (
              <>
                <button
                  onClick={() => setTestGenReqId(row.original.id)}
                  className="p-1.5 text-text-tertiary hover:text-accent rounded-lg hover:bg-accent-subtle transition-colors"
                  title={t('requirements.generateTests')}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setRiskClassReqId(row.original.id)}
                  className="p-1.5 text-text-tertiary hover:text-accent rounded-lg hover:bg-accent-subtle transition-colors"
                  title={t('requirements.classifyRisk')}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                </button>
              </>
            )}
            <button
              onClick={() => { setEditingReq(row.original); setModalOpen(true); }}
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
        ),
        size: hasAnyProvider ? 170 : 110,
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, hasAnyProvider, auditEntries]
  );

  const table = useReactTable({
    data,
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
          onClick={() => { setEditingReq(null); setModalOpen(true); }}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-text-inverse bg-accent rounded-lg hover:bg-accent-hover transition-colors font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {t('requirements.addRequirement')}
        </button>
      </div>

      {data.length === 0 && !globalFilter ? (
        <EmptyState
          title={t('requirements.noRequirements')}
          description={t('requirements.noRequirementsDesc')}
          action={{ label: t('requirements.createRequirement'), onClick: () => { setEditingReq(null); setModalOpen(true); } }}
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

      <RequirementModal
        open={modalOpen}
        requirement={editingReq}
        onSave={(data) => {
          if (editingReq) {
            updateRequirement(editingReq.id, data);
          } else {
            addRequirement(data);
          }
        }}
        onClose={() => { setModalOpen(false); setEditingReq(null); }}
      />

      <ConfirmDialog
        open={deleteId !== null}
        title={t('requirements.deleteTitle')}
        message={t('requirements.deleteMessage')}
        onConfirm={() => { if (deleteId) deleteRequirement(deleteId); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
      />

      {testGenReqId && (
        <TestGenerationPanel
          requirementId={testGenReqId}
          onClose={() => setTestGenReqId(null)}
        />
      )}

      {riskClassReqId && (
        <RiskClassificationPanel
          requirementId={riskClassReqId}
          onClose={() => setRiskClassReqId(null)}
        />
      )}

      {/* Signature Modal for approving Active requirements */}
      <SignatureModal
        open={signReq !== null}
        entityType="requirement"
        entityId={signReq?.id ?? ''}
        entityTitle={signReq?.title ?? ''}
        onSign={() => {
          setSignReq(null);
        }}
        onCancel={() => setSignReq(null)}
      />
    </div>
  );
}
