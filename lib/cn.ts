type ClassValue = string | number | null | undefined | false | ClassValue[];

/**
 * Joins class names, dropping falsy values.
 *
 * Deliberately not `tailwind-merge`: the UI primitives own their base classes and
 * append the caller's `className` last, so later utilities win by source order.
 * Callers overriding a base utility should pass the full replacement.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  const walk = (v: ClassValue) => {
    if (!v && v !== 0) return;
    if (Array.isArray(v)) {
      v.forEach(walk);
      return;
    }
    out.push(String(v));
  };
  inputs.forEach(walk);
  return out.join(" ");
}
