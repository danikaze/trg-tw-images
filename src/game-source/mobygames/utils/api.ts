import fetch from 'node-fetch';
import { delay } from '@utils/delay';
import { logger } from './logger';
import { ApiErrorCode } from '../api/other-types';
import { ApiError } from '../api/response-types';
import { envVars } from './env-vars';

/**
 * Provides information about the Mobygames API usage
 */
export function getApiMeta() {
  return {
    totalCalls: queue.length,
    // totalCallsProcessed: queue.filter((i) => !!i.processTime).length,
  };
}

export function isError(data: unknown | ApiError): data is ApiError {
  return (data as ApiError).error !== undefined;
}

/**
 * Call the mobygames API and automatically preppend the base
 * url and the api key
 *
 * To avoid hitting the limit of requests, it's just managed as a queue system
 * instead of making the call directly
 *
 * @rest changing part of the url (i.e. just `games?genre=1&genre=2`)
 */
export function callApi<Data>(rest: string): Promise<Data> {
  return new Promise<Data>((resolve, reject) => {
    queue.push({
      rest,
      resolve,
      reject,
    });
    logger.debug(`Api call queued (${queue.length}): "${rest}"`);
    startProcessing();
  });
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface QueueItem {
  rest: string;
  resolve: (data: any) => void;
  reject: (error: any) => void;
  processTime?: number;
  duration?: number;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Time to wait between calls */
const WAIT_BETWEEN_CALLS = 1100;
/** Extra time to wait if we hit the limit */
const WAIT_AFTER_TOO_MANY_CALLS = 10000;
/** Base url for the API */
const BASE_URL = 'https://api.mobygames.com/v1/';
/** Queued calls to process (FIFO) */
const queue: QueueItem[] = [];
/** `true` when already processing the queue */
let processing = false;
/** Next item to process */
let queueIndex = 0;

async function startProcessing(): Promise<void> {
  if (processing) return;
  processing = true;

  for (;;) {
    const currentIndex = queueIndex;
    const requestData = queue[currentIndex];

    if (!requestData) {
      logger.debug(`Api call queue emptied!`);
      processing = false;
      return;
    }
    logger.debug(
      `Processing api call (${currentIndex + 1}/${queue.length}): "${
        requestData.rest
      }"`
    );

    queueIndex++;
    const { rest, resolve, reject } = requestData;
    const processTime = Date.now();
    const lastItem = queue[currentIndex - 1];
    const lastCallTime = lastItem?.processTime ?? 0;
    const ellapsed = processTime - lastCallTime;
    const waitTime = WAIT_BETWEEN_CALLS - ellapsed + (lastItem?.duration ?? 0);

    if (waitTime > 0) {
      logger.debug(`Waiting ${waitTime}ms...`);
      await delay(waitTime);
    }

    try {
      logger.debug(`Api call: "${rest}"`);
      requestData.processTime = processTime;
      const result = await doApiCall(rest);
      requestData.duration = Date.now() - processTime;
      resolve(result);
    } catch (e) {
      reject(e);
    }
  }
}

async function doApiCall<Data>(rest: string): Promise<Data> {
  const url = new URL(BASE_URL + rest);
  url.searchParams.set('api_key', envVars.MG_API_KEY);

  const res = await fetch(url.href);
  const json = (await res.json()) as Data | ApiError;
  if (isError(json)) {
    if (json.code === ApiErrorCode.TOO_MANY_REQUESTS) {
      await delay(WAIT_AFTER_TOO_MANY_CALLS);
    }
    const errorMsg = JSON.stringify({
      rest,
      ...json,
    });
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  return json;
}
