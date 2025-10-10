export function requireAt<T>(items: T[], index: number): T {
  const value = items[index];
  if (value === undefined) {
    throw new Error(`Expected value at index ${index} to be defined`);
  }
  return value;
}

export function requireDefined<T>(value: T | null | undefined, message?: string): T {
  if (value === undefined || value === null) {
    throw new Error(message ?? 'Expected value to be defined');
  }
  return value;
}
