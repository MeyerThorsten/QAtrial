import { useAuditStore } from '../useAuditStore';

const initialState = useAuditStore.getState();

beforeEach(() => {
  useAuditStore.setState({ ...initialState, entries: [] });
});

describe('useAuditStore', () => {
  describe('log', () => {
    it('creates an entry with correct fields', () => {
      const store = useAuditStore.getState();
      store.log('create', 'requirement', 'REQ-001', undefined, 'new value', 'Initial creation');

      const { entries } = useAuditStore.getState();
      expect(entries).toHaveLength(1);
      expect(entries[0].action).toBe('create');
      expect(entries[0].entityType).toBe('requirement');
      expect(entries[0].entityId).toBe('REQ-001');
      expect(entries[0].previousValue).toBeUndefined();
      expect(entries[0].newValue).toBe('new value');
      expect(entries[0].reason).toBe('Initial creation');
      expect(entries[0].userId).toBe('system');
      expect(entries[0].userName).toBe('System');
      expect(entries[0].id).toMatch(/^audit-/);
      expect(entries[0].timestamp).toBeTruthy();
    });

    it('appends multiple entries', () => {
      const store = useAuditStore.getState();
      store.log('create', 'requirement', 'REQ-001');
      store.log('update', 'requirement', 'REQ-001', 'old', 'new');
      store.log('delete', 'test', 'TST-001');

      const { entries } = useAuditStore.getState();
      expect(entries).toHaveLength(3);
    });
  });

  describe('getEntriesForEntity', () => {
    it('filters entries by entity ID', () => {
      const store = useAuditStore.getState();
      store.log('create', 'requirement', 'REQ-001');
      store.log('create', 'requirement', 'REQ-002');
      store.log('update', 'requirement', 'REQ-001', 'old', 'new');

      const entries = useAuditStore.getState().getEntriesForEntity('REQ-001');
      expect(entries).toHaveLength(2);
      expect(entries.every((e) => e.entityId === 'REQ-001')).toBe(true);
    });

    it('returns empty array when no match', () => {
      const store = useAuditStore.getState();
      store.log('create', 'requirement', 'REQ-001');

      const entries = useAuditStore.getState().getEntriesForEntity('REQ-999');
      expect(entries).toHaveLength(0);
    });
  });

  describe('getEntriesByDateRange', () => {
    it('filters entries by date range', () => {
      // Manually set entries with known timestamps
      useAuditStore.setState({
        entries: [
          {
            id: 'a1',
            timestamp: '2024-01-15T10:00:00.000Z',
            userId: 'u1',
            userName: 'User',
            action: 'create',
            entityType: 'requirement',
            entityId: 'REQ-001',
          },
          {
            id: 'a2',
            timestamp: '2024-02-15T10:00:00.000Z',
            userId: 'u1',
            userName: 'User',
            action: 'update',
            entityType: 'requirement',
            entityId: 'REQ-001',
          },
          {
            id: 'a3',
            timestamp: '2024-03-15T10:00:00.000Z',
            userId: 'u1',
            userName: 'User',
            action: 'delete',
            entityType: 'requirement',
            entityId: 'REQ-002',
          },
        ],
      });

      const from = new Date('2024-01-01T00:00:00.000Z');
      const to = new Date('2024-02-28T23:59:59.999Z');
      const entries = useAuditStore.getState().getEntriesByDateRange(from, to);

      expect(entries).toHaveLength(2);
      expect(entries[0].id).toBe('a1');
      expect(entries[1].id).toBe('a2');
    });
  });

  describe('clearEntries', () => {
    it('empties the audit log', () => {
      const store = useAuditStore.getState();
      store.log('create', 'requirement', 'REQ-001');
      store.log('update', 'requirement', 'REQ-002');

      expect(useAuditStore.getState().entries).toHaveLength(2);

      store.clearEntries();
      expect(useAuditStore.getState().entries).toHaveLength(0);
    });
  });
});
