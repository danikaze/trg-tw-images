export interface WaitForOptions {
  /** Ms to wait before the next check */
  pollInterval?: number;
  /** Ms to wait before rejecting the returned Promise */
  timeout?: number;
  /** String to identify the error in case of timeout */
  name?: string;
  /** If the condition returns one of this values is to keep waiting */
  ngValues?: unknown[];
  /** If `true` it will try to bypass fake timers on polling and timeout */
  useRealTimer?: boolean;
}

export async function waitFor<T>(ms: number): Promise<T>;
export async function waitFor<T>(
  condition: () => T | Promise<T>,
  options?: WaitForOptions
): Promise<T>;
/**
 * Wait for the given `condition` to return thruty value
 * (not `undefined` | `null` | `false` | `0`, ``)
 */
export async function waitFor<T>(
  conditionOrTime: number | (() => T | Promise<T>),
  options?: WaitForOptions
): Promise<T> {
  if (typeof conditionOrTime === 'number') {
    return new Promise((resolve) => {
      setTimeout(resolve, conditionOrTime);
    });
  }

  const condition = conditionOrTime;
  const { pollInterval, timeout, name, ngValues, useRealTimer } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };
  const schedule = useRealTimer ? realSetTimeout : setTimeout;
  const cancelSchedule = useRealTimer ? realClearTimeout : clearTimeout;

  let hasTimeout = false;

  const timeoutHandler = schedule(() => {
    hasTimeout = true;
  }, timeout);

  while (!hasTimeout) {
    if (hasTimeout) {
      throw `${name}.timeout`;
    }

    try {
      const value = await condition();
      if (!ngValues.includes(value)) {
        cancelSchedule(timeoutHandler);
        return value;
      }
    } catch {}

    await delay(pollInterval, schedule);
  }

  // this line should never be reached
  throw `${name}.timeout`;
}

function delay(ms: number, schedule: typeof setTimeout): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise<void>((resolve) => {
    schedule(resolve, ms);
  });
}

const DEFAULT_OPTIONS: Required<WaitForOptions> = {
  pollInterval: 50,
  timeout: 15_000,
  name: 'waitFor',
  ngValues: [undefined, null, false, 0],
  useRealTimer: false,
};

const realSetTimeout = setTimeout;
const realClearTimeout = clearTimeout;
