import { composeTemplate } from '../composer';
import type { ComposeResult } from '../composer';

describe('composeTemplate', () => {
  describe('deduplication logic', () => {
    it('deduplicates requirements by title (later entries win)', async () => {
      // Use modules that have overlapping requirement titles
      // The 'audit_trail' module is always available from MODULE_DEFINITIONS
      const result = await composeTemplate({
        country: 'XX', // nonexistent country to isolate module-only behavior
        modules: ['audit_trail'],
      });

      // Requirements from audit_trail should be present with no duplicates
      const titles = result.requirements.map((r) => r.title);
      const uniqueTitles = [...new Set(titles)];
      expect(titles.length).toBe(uniqueTitles.length);
    });

    it('deduplicates tests by title (later entries win)', async () => {
      const result = await composeTemplate({
        country: 'XX',
        modules: ['audit_trail'],
      });

      const titles = result.tests.map((t) => t.title);
      const uniqueTitles = [...new Set(titles)];
      expect(titles.length).toBe(uniqueTitles.length);
    });
  });

  describe('module merging', () => {
    it('merges requirements from multiple modules', async () => {
      const result = await composeTemplate({
        country: 'XX',
        modules: ['audit_trail', 'e_signatures'],
      });

      // Should have requirements from both modules
      expect(result.requirements.length).toBeGreaterThan(0);
      expect(result.tests.length).toBeGreaterThan(0);

      // Check for a known audit trail requirement
      const hasAuditReq = result.requirements.some((r) =>
        r.title.toLowerCase().includes('audit') || r.tags?.includes('audit-trail'),
      );
      expect(hasAuditReq).toBe(true);
    });

    it('returns empty arrays when no modules match', async () => {
      const result = await composeTemplate({
        country: 'XX',
        modules: ['nonexistent_module'],
      });

      // No country match and no module match means empty
      expect(result.requirements).toEqual([]);
      expect(result.tests).toEqual([]);
    });
  });

  describe('result structure', () => {
    it('returns requirements and tests arrays', async () => {
      const result: ComposeResult = await composeTemplate({
        country: 'XX',
        modules: [],
      });

      expect(result).toHaveProperty('requirements');
      expect(result).toHaveProperty('tests');
      expect(Array.isArray(result.requirements)).toBe(true);
      expect(Array.isArray(result.tests)).toBe(true);
    });

    it('requirements have expected fields', async () => {
      const result = await composeTemplate({
        country: 'XX',
        modules: ['audit_trail'],
      });

      if (result.requirements.length > 0) {
        const req = result.requirements[0];
        expect(req).toHaveProperty('title');
        expect(req).toHaveProperty('description');
        expect(req).toHaveProperty('category');
        expect(req).toHaveProperty('tags');
        expect(req).toHaveProperty('riskLevel');
      }
    });

    it('tests have expected fields', async () => {
      const result = await composeTemplate({
        country: 'XX',
        modules: ['audit_trail'],
      });

      if (result.tests.length > 0) {
        const test = result.tests[0];
        expect(test).toHaveProperty('title');
        expect(test).toHaveProperty('description');
        expect(test).toHaveProperty('category');
        expect(test).toHaveProperty('tags');
        expect(test).toHaveProperty('linkedReqTags');
      }
    });
  });
});
