export function hashCode(str: string): string {
  // eslint-disable-next-line no-bitwise,no-magic-numbers
  return String(Array.from(str).reduce((s, c) => (Math.imul(31, s) + c.charCodeAt(0)) | 0, 0));
}
