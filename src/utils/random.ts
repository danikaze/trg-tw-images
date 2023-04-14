/**
 * Returns a random integer between [0, max]
 */
export function randomInt(max: number): number {
  return Math.round(Math.random() * Number.MAX_SAFE_INTEGER) % max;
}

/**
 * Return a random item from the array
 */
export function selectRandom<T>(items: T[] | undefined): T | undefined;
/**
 * Return a list of random items (without repeating) from the given list
 */
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
      const index = randomInt(available.length);
      res.push(available[index]);
      available.splice(index, 1);
    }
    return res;
  }

  // no n specified
  if (!items || !items.length) return;
  const index = randomInt(items.length);
  return items[index];
}
