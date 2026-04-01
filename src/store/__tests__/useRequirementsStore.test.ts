import { useRequirementsStore } from '../useRequirementsStore';
import { useTestsStore } from '../useTestsStore';

const initialReqState = useRequirementsStore.getState();
const initialTestState = useTestsStore.getState();

beforeEach(() => {
  useRequirementsStore.setState({ ...initialReqState, requirements: [], reqCounter: 1 });
  useTestsStore.setState({ ...initialTestState, tests: [], testCounter: 1 });
});

describe('useRequirementsStore', () => {
  describe('addRequirement', () => {
    it('creates a requirement with correct REQ-XXX ID format', () => {
      const store = useRequirementsStore.getState();
      store.addRequirement({ title: 'Test Req', description: 'Desc', status: 'Draft' });

      const { requirements, reqCounter } = useRequirementsStore.getState();
      expect(requirements).toHaveLength(1);
      expect(requirements[0].id).toBe('REQ-001');
      expect(requirements[0].title).toBe('Test Req');
      expect(requirements[0].description).toBe('Desc');
      expect(requirements[0].status).toBe('Draft');
      expect(requirements[0].createdAt).toBeTruthy();
      expect(requirements[0].updatedAt).toBeTruthy();
      expect(reqCounter).toBe(2);
    });

    it('increments counter for sequential IDs', () => {
      const store = useRequirementsStore.getState();
      store.addRequirement({ title: 'First', description: 'D1', status: 'Draft' });
      store.addRequirement({ title: 'Second', description: 'D2', status: 'Active' });

      const { requirements } = useRequirementsStore.getState();
      expect(requirements).toHaveLength(2);
      expect(requirements[0].id).toBe('REQ-001');
      expect(requirements[1].id).toBe('REQ-002');
    });
  });

  describe('updateRequirement', () => {
    it('updates fields and updatedAt timestamp', () => {
      const store = useRequirementsStore.getState();
      store.addRequirement({ title: 'Original', description: 'Desc', status: 'Draft' });

      // Small delay to ensure timestamp differs
      store.updateRequirement('REQ-001', { title: 'Updated Title', status: 'Active' });

      const { requirements } = useRequirementsStore.getState();
      expect(requirements[0].title).toBe('Updated Title');
      expect(requirements[0].status).toBe('Active');
      expect(requirements[0].description).toBe('Desc'); // unchanged
      expect(requirements[0].updatedAt).toBeTruthy();
    });

    it('does not modify other requirements', () => {
      const store = useRequirementsStore.getState();
      store.addRequirement({ title: 'First', description: 'D1', status: 'Draft' });
      store.addRequirement({ title: 'Second', description: 'D2', status: 'Draft' });

      store.updateRequirement('REQ-001', { title: 'Updated First' });

      const { requirements } = useRequirementsStore.getState();
      expect(requirements[1].title).toBe('Second');
    });
  });

  describe('deleteRequirement', () => {
    it('removes the requirement from the list', () => {
      const store = useRequirementsStore.getState();
      store.addRequirement({ title: 'To Delete', description: 'Desc', status: 'Draft' });
      store.addRequirement({ title: 'To Keep', description: 'Desc', status: 'Draft' });

      store.deleteRequirement('REQ-001');

      const { requirements } = useRequirementsStore.getState();
      expect(requirements).toHaveLength(1);
      expect(requirements[0].id).toBe('REQ-002');
    });

    it('unlinks the requirement from tests', () => {
      const testStore = useTestsStore.getState();
      testStore.addTest({
        title: 'Test',
        description: 'Desc',
        status: 'Not Run',
        linkedRequirementIds: ['REQ-001', 'REQ-002'],
      });

      const reqStore = useRequirementsStore.getState();
      reqStore.addRequirement({ title: 'Req', description: 'Desc', status: 'Draft' });
      reqStore.deleteRequirement('REQ-001');

      const { tests } = useTestsStore.getState();
      expect(tests[0].linkedRequirementIds).toEqual(['REQ-002']);
    });
  });

  describe('setRequirements', () => {
    it('bulk replaces requirements and counter', () => {
      const store = useRequirementsStore.getState();
      store.addRequirement({ title: 'Old', description: 'Desc', status: 'Draft' });

      const newReqs = [
        {
          id: 'REQ-010',
          title: 'Imported',
          description: 'Imported desc',
          status: 'Active' as const,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      store.setRequirements(newReqs, 11);

      const { requirements, reqCounter } = useRequirementsStore.getState();
      expect(requirements).toHaveLength(1);
      expect(requirements[0].id).toBe('REQ-010');
      expect(reqCounter).toBe(11);
    });
  });
});
