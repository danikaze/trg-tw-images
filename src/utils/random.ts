export function selectRandom<T>(items: T[] | undefined): T | undefined;
export function selectRandom<T>(items: T[] | undefined, n: number): T[];
export function selectRandom<T>(
  items: T[] | undefined,
  n?: number
): T | T[] | undefined {
  // n specified
  if (n !== undefined) {
    if (!items || !items.length) return [];
    const available = [...items];
    const res: T[] = [];
    for (let i = 0; i < Math.min(n, items.length); i++) {
      const index =
        Math.round(Math.random() * Number.MAX_SAFE_INTEGER) % available.length;
      res.push(available[index]);
      available.splice(index, 1);
    }
    return res;
  }

  // no n specified
  if (!items || !items.length) return;
  const index =
    Math.round(Math.random() * Number.MAX_SAFE_INTEGER) % items.length;
  return items[index];
}
