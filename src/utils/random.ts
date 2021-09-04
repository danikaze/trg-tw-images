export function selectRandom<T>(items: T[]): T | undefined {
  if (!items.length) return;
  const index =
    Math.round(Math.random() * Number.MAX_SAFE_INTEGER) % items.length;
  return items[index];
}
