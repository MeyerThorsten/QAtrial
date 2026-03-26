export function generateId(prefix: string, counter: number): string {
  return `${prefix}-${String(counter).padStart(3, '0')}`;
}
