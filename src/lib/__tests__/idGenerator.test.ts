import { generateId } from '../idGenerator';

describe('generateId', () => {
  it('generates ID with correct prefix', () => {
    expect(generateId('REQ', 1)).toBe('REQ-001');
    expect(generateId('TST', 1)).toBe('TST-001');
  });

  it('pads counter to 3 digits', () => {
    expect(generateId('REQ', 1)).toBe('REQ-001');
    expect(generateId('REQ', 10)).toBe('REQ-010');
    expect(generateId('REQ', 100)).toBe('REQ-100');
  });

  it('does not truncate counters larger than 3 digits', () => {
    expect(generateId('REQ', 1000)).toBe('REQ-1000');
    expect(generateId('REQ', 12345)).toBe('REQ-12345');
  });

  it('works with any prefix string', () => {
    expect(generateId('CUSTOM', 42)).toBe('CUSTOM-042');
    expect(generateId('X', 7)).toBe('X-007');
  });
});
