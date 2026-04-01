import { useTestsStore } from '../useTestsStore';

const initialState = useTestsStore.getState();

beforeEach(() => {
  useTestsStore.setState({ ...initialState, tests: [], testCounter: 1 });
});

describe('useTestsStore', () => {
  describe('addTest', () => {
    it('creates a test with correct TST-XXX ID format', () => {
      const store = useTestsStore.getState();
      store.addTest({
        title: 'Test Case 1',
        description: 'Description',
        status: 'Not Run',
        linkedRequirementIds: ['REQ-001'],
      });

      const { tests, testCounter } = useTestsStore.getState();
      expect(tests).toHaveLength(1);
      expect(tests[0].id).toBe('TST-001');
      expect(tests[0].title).toBe('Test Case 1');
      expect(tests[0].status).toBe('Not Run');
      expect(tests[0].linkedRequirementIds).toEqual(['REQ-001']);
      expect(tests[0].createdAt).toBeTruthy();
      expect(tests[0].updatedAt).toBeTruthy();
      expect(testCounter).toBe(2);
    });

    it('increments counter for sequential IDs', () => {
      const store = useTestsStore.getState();
      store.addTest({
        title: 'First',
        description: 'D1',
        status: 'Not Run',
        linkedRequirementIds: [],
      });
      store.addTest({
        title: 'Second',
        description: 'D2',
        status: 'Passed',
        linkedRequirementIds: [],
      });

      const { tests } = useTestsStore.getState();
      expect(tests[0].id).toBe('TST-001');
      expect(tests[1].id).toBe('TST-002');
    });
  });

  describe('updateTest', () => {
    it('updates fields and updatedAt', () => {
      const store = useTestsStore.getState();
      store.addTest({
        title: 'Original',
        description: 'Desc',
        status: 'Not Run',
        linkedRequirementIds: [],
      });

      store.updateTest('TST-001', { title: 'Updated', status: 'Passed' });

      const { tests } = useTestsStore.getState();
      expect(tests[0].title).toBe('Updated');
      expect(tests[0].status).toBe('Passed');
      expect(tests[0].description).toBe('Desc'); // unchanged
    });

    it('does not modify other tests', () => {
      const store = useTestsStore.getState();
      store.addTest({ title: 'A', description: 'D', status: 'Not Run', linkedRequirementIds: [] });
      store.addTest({ title: 'B', description: 'D', status: 'Not Run', linkedRequirementIds: [] });

      store.updateTest('TST-001', { title: 'A Updated' });

      const { tests } = useTestsStore.getState();
      expect(tests[1].title).toBe('B');
    });
  });

  describe('deleteTest', () => {
    it('removes the test from the list', () => {
      const store = useTestsStore.getState();
      store.addTest({ title: 'A', description: 'D', status: 'Not Run', linkedRequirementIds: [] });
      store.addTest({ title: 'B', description: 'D', status: 'Not Run', linkedRequirementIds: [] });

      store.deleteTest('TST-001');

      const { tests } = useTestsStore.getState();
      expect(tests).toHaveLength(1);
      expect(tests[0].id).toBe('TST-002');
    });
  });

  describe('removeRequirementLink', () => {
    it('cleans up requirement links across all tests', () => {
      const store = useTestsStore.getState();
      store.addTest({
        title: 'A',
        description: 'D',
        status: 'Not Run',
        linkedRequirementIds: ['REQ-001', 'REQ-002'],
      });
      store.addTest({
        title: 'B',
        description: 'D',
        status: 'Not Run',
        linkedRequirementIds: ['REQ-001'],
      });

      store.removeRequirementLink('REQ-001');

      const { tests } = useTestsStore.getState();
      expect(tests[0].linkedRequirementIds).toEqual(['REQ-002']);
      expect(tests[1].linkedRequirementIds).toEqual([]);
    });
  });
});
