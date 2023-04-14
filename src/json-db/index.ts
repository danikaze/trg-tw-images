import fs, { existsSync } from 'fs';
import { dirname } from 'path';
import { ASSIGN_DEFAULT_OPTIONS, getCustomAssign } from 'super-assign';
import { sync as mkdirpSync } from 'mkdirp';
import { getLogger } from '@utils/logger';
import { formatSize } from '@utils/format';

const assignDeepWithDelete = getCustomAssign({
  ...ASSIGN_DEFAULT_OPTIONS,
  deleteValue: null,
});

const logger = getLogger('JsonDb');

// eslint-disable-next-line @typescript-eslint/ban-types
export type BaseData = {};

export interface JsonDbOptions<Data extends BaseData, SerializedData = Data> {
  /** ms to throttle the update to disc */
  syncThrottle?: number;
  /** When `true`, sync will be called again after `throttleTime` */
  prettify?: boolean;
  /** Data to initialize the file if it doesn't exist first */
  initialData?: Data;
  /** If `true` and the file doesn't exist, throws an error */
  throwIfNotExists?: boolean;
  /**
   * If provided, the callback will be called before writing to disk
   * Note that it can return a copy or the same object modified.
   * If modified, it will affect directly to the internal data.
   *
   * Returning a copy with differnt type allows to have in memory data
   * different than serialized in disk (i.e. to build indices, etc.)
   */
  beforeSync?: (data: Data) => SerializedData;
  /**
   * If the data is serialized, this allows for de-serialization
   */
  afterLoad?: (rawData: SerializedData) => Data;
}

export interface JsonDbMetadata {
  /** Timestamp of when the file was created originally */
  createTime: number;
  /** Last timestamp of when `update` was caled */
  lastUpdate: number;
  /** Last timestamp of when `sync` was called */
  lastSync: number;
}

export interface JsonDb<Data extends unknown> {
  data: DeepReadonly<Data>;
  meta: Readonly<JsonDbMetadata>;
  update: (data: DeepNullable<DeepPartial<Data>>) => void;
}

export function createJsonDb<Data extends BaseData, SerializedData = Data>(
  path: string,
  options?: JsonDbOptions<Data, SerializedData>
): JsonDb<Data> {
  return new RawJsonDb<Data, SerializedData>(
    path,
    options
  ) as unknown as JsonDb<Data>;
}

interface StoredData<SerializedData> {
  data: SerializedData;
  meta: JsonDbMetadata;
}

/**
 * Private class so the exported type has the `data` field as DeepReadonly
 */
class RawJsonDb<Data extends BaseData, SerializedData = Data> {
  /** Current state of the data */
  public data: Data;

  /** Metadata */
  public readonly meta: JsonDbMetadata;

  /** Options to use (constructor + default)  */
  private readonly options: Required<JsonDbOptions<Data, SerializedData>>;

  /** Path of the file to sync */
  private readonly path: string;

  /**
   * `true` while writing in the file, like a semaphore
   * (no multi-thread safe)
   */
  private writing = false;

  /** Handler of `setTimeout` to schedule the next sync */
  private schedule?: ReturnType<typeof setTimeout>;

  /** When `true`, sync will be called again after `throttleTime` */
  private moreChanges = false;

  constructor(path: string, options?: JsonDbOptions<Data, SerializedData>) {
    this.options = {
      syncThrottle: 5000,
      prettify: true,
      initialData: {} as Data,
      throwIfNotExists: false,
      beforeSync: (data: Data) => data as unknown as SerializedData,
      afterLoad: (data: SerializedData) => data as unknown as Data,
      ...options,
    };

    this.path = path;
    const readResult = this.read();
    if (!readResult) {
      this.data = this.options.initialData || ({} as unknown as Data);
      this.meta = {
        createTime: Date.now(),
        lastSync: 0,
        lastUpdate: 0,
      };
    } else {
      this.meta = readResult.meta;
      this.data = readResult.data;
    }

    this.store = this.store.bind(this);
  }

  private static isValidData<T>(raw: unknown): raw is StoredData<T> {
    if (!raw) return false;
    const { meta } = raw as StoredData<T>;
    return (
      typeof meta.createTime === 'number' &&
      typeof meta.lastSync === 'number' &&
      typeof meta.lastUpdate === 'number'
    );
  }

  public update(data: DeepPartial<Data>): void {
    assignDeepWithDelete(this.data, data);
    this.meta.lastUpdate = Date.now();
    this.store(false);
  }

  private read(): { data: Data; meta: JsonDbMetadata } | undefined {
    if (this.options.throwIfNotExists && !existsSync(this.path)) {
      throw new Error(`File doesn't exist: ${this.path}`);
    }

    const folder = dirname(this.path);
    if (!existsSync(folder)) {
      mkdirpSync(folder);
    }
    if (!existsSync(this.path)) {
      return;
    }

    try {
      const rawData = JSON.parse(fs.readFileSync(this.path).toString());
      if (!RawJsonDb.isValidData<SerializedData>(rawData)) {
        logger.warn(`Invalid data when loading ${this.path}`);
        return;
      }

      return {
        data: this.options.afterLoad(rawData.data),
        meta: rawData.meta,
      };
    } catch (e) {
      logger.warn(`Unknown error while reading data from ${this.path}: ${e}`);
    }
  }

  private async store(isScheduled: boolean): Promise<void> {
    if (!isScheduled) {
      // if the sync is already scheduled, just wait
      if (this.schedule) return;

      // if it's already being written,
      // note that there are more changes after this
      if (this.writing) {
        this.moreChanges = true;
        return;
      }
    }

    // if the last sync was too recent,
    // schedule the next one based on the throttle
    const diff = this.meta.lastSync + this.options.syncThrottle - Date.now();
    if (diff > 0) {
      this.schedule = setTimeout(this.store, diff, true);
      return;
    }

    this.schedule = undefined;
    this.moreChanges = false;
    this.writing = true;
    await this.sync();
    this.writing = false;

    if (this.moreChanges) {
      this.schedule = setTimeout(this.store, this.options.syncThrottle, true);
    }
  }

  private async sync(): Promise<void> {
    this.meta.lastSync = Date.now();

    const data = this.options.beforeSync(this.data);
    const meta = this.meta;

    const content: StoredData<SerializedData> = { meta, data };
    const strContent = this.options.prettify
      ? JSON.stringify(content, null, 2)
      : JSON.stringify(content);

    logger.info(`Sync: ${this.path}`);
    const start = Date.now();
    return fs.promises.writeFile(this.path, strContent).then(() => {
      logger.debug(
        `Sync done in ${Date.now() - start} ms. (${formatSize(
          strContent.length
        )})`
      );
    });
  }
}
