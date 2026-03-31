export const passwordChecks = [
  {
    id: 'length',
    label: 'At least 12 characters',
    test: (value: string) => value.length >= 12,
  },
  {
    id: 'upper',
    label: 'One uppercase letter',
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: 'lower',
    label: 'One lowercase letter',
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    id: 'number',
    label: 'One number',
    test: (value: string) => /\d/.test(value),
  },
  {
    id: 'symbol',
    label: 'One symbol',
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
] as const;

export type PasswordCheck = typeof passwordChecks[number];

export function getPasswordFailures(password: string): string[] {
  return passwordChecks
    .filter((rule) => !rule.test(password))
    .map((rule) => rule.label);
}

export function isPasswordStrong(password: string): boolean {
  return getPasswordFailures(password).length === 0;
}
