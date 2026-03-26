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
import { useTestsStore } from '../../store/useTestsStore';
import { useRequirementsStore } from '../../store/useRequirementsStore';
import { StatusBadge } from '../shared/StatusBadge';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { EmptyState } from '../shared/EmptyState';
import { TestModal } from './TestModal';
import type { Test } from '../../types';

const columnHelper = createColumnHelper<Test>();

export function TestsTable() {
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

  const reqMap = useMemo(() => new Map(requirements.map((r) => [r.id, r])), [requirements]);

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
        cell: (info) => <StatusBadge status={info.getValue()} type="test" />,
        size: 100,
      }),
      columnHelper.accessor('linkedRequirementIds', {
        header: 'Requirements',
        cell: (info) => {
          const ids = info.getValue();
          if (ids.length === 0) {
            return <span className="text-red-500 text-xs font-medium">Keine</span>;
          }
          return (
            <div className="flex flex-wrap gap-1">
              {ids.map((id) => (
                <span
                  key={id}
                  className="inline-flex items-center rounded bg-blue-50 px-1.5 py-0.5 text-xs font-mono text-blue-700"
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
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setEditingTest(row.original); setModalOpen(true); }}
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
    [reqMap]
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
        <input
          type="text"
          placeholder="Suchen..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => { setEditingTest(null); setModalOpen(true); }}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Test
        </button>
      </div>

      {tests.length === 0 && !globalFilter ? (
        <EmptyState
          title="Keine Tests"
          description="Erstelle deinen ersten Test, um loszulegen."
          action={{ label: 'Test erstellen', onClick: () => { setEditingTest(null); setModalOpen(true); } }}
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

      <TestModal
        open={modalOpen}
        test={editingTest}
        onSave={(data) => {
          if (editingTest) {
            updateTest(editingTest.id, data);
          } else {
            addTest(data);
          }
        }}
        onClose={() => { setModalOpen(false); setEditingTest(null); }}
      />

      <ConfirmDialog
        open={deleteId !== null}
        title="Test löschen"
        message="Dieser Test wird unwiderruflich gelöscht."
        onConfirm={() => { if (deleteId) deleteTest(deleteId); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
