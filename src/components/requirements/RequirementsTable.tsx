import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
} from '@tanstack/react-table';
import { Plus, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { useTestsStore } from '../../store/useTestsStore';
import { StatusBadge } from '../shared/StatusBadge';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { EmptyState } from '../shared/EmptyState';
import { RequirementModal } from './RequirementModal';
import type { Requirement } from '../../types';

const columnHelper = createColumnHelper<Requirement & { linkedTestCount: number }>();

export function RequirementsTable() {
  const requirements = useRequirementsStore((s) => s.requirements);
  const addRequirement = useRequirementsStore((s) => s.addRequirement);
  const updateRequirement = useRequirementsStore((s) => s.updateRequirement);
  const deleteRequirement = useRequirementsStore((s) => s.deleteRequirement);
  const tests = useTestsStore((s) => s.tests);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReq, setEditingReq] = useState<Requirement | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
        header: 'ID',
        cell: (info) => <span className="font-mono text-xs text-gray-500">{info.getValue()}</span>,
        size: 100,
      }),
      columnHelper.accessor('title', {
        header: 'Titel',
        cell: (info) => <span className="font-medium text-gray-900">{info.getValue()}</span>,
      }),
      columnHelper.accessor('description', {
        header: 'Beschreibung',
        cell: (info) => (
          <span className="text-gray-500 text-sm truncate max-w-xs block">
            {info.getValue() || '—'}
          </span>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => <StatusBadge status={info.getValue()} type="requirement" />,
        size: 100,
      }),
      columnHelper.accessor('linkedTestCount', {
        header: 'Tests',
        cell: (info) => {
          const count = info.getValue();
          return (
            <span className={`text-sm ${count === 0 ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
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
            <button
              onClick={() => { setEditingReq(row.original); setModalOpen(true); }}
              className="p-1 text-gray-400 hover:text-blue-600 rounded"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeleteId(row.original.id)}
              className="p-1 text-gray-400 hover:text-red-600 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
        size: 80,
      }),
    ],
    []
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
        <input
          type="text"
          placeholder="Suchen..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => { setEditingReq(null); setModalOpen(true); }}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Requirement
        </button>
      </div>

      {data.length === 0 && !globalFilter ? (
        <EmptyState
          title="Keine Requirements"
          description="Erstelle dein erstes Requirement, um loszulegen."
          action={{ label: 'Requirement erstellen', onClick: () => { setEditingReq(null); setModalOpen(true); } }}
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-gray-50 border-b border-gray-200">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
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
        title="Requirement löschen"
        message="Alle Verlinkungen zu Tests werden ebenfalls entfernt."
        onConfirm={() => { if (deleteId) deleteRequirement(deleteId); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
