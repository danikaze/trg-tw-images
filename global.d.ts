/*
 * Constants defined in webpack at build time
 */
declare const IS_PRODUCTION: boolean;
declare const PACKAGE_NAME: string;
declare const PACKAGE_VERSION: string;
declare const COMMIT_HASH: string;
declare const COMMIT_HASH_SHORT: string;
declare const PROJECT_ROOT: string;

type DeepPartial<T> = T extends Record<string, unknown>
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

type DeepReadonly<T> = T extends Record<string, unknown>
  ? {
      [P in keyof T]: DeepReadonly<T[P]>;
    }
  : Readonly<T>;

type Nullable<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] | null;
};

type DeepNullable<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T]: DeepNullable<T[K]> | null;
    }
  : T | null;

type KeysOfWithValue<O extends Record<string, unknown>, T> = Exclude<
  {
    [K in keyof O]: O[K] extends T ? K : never;
  }[keyof O],
  undefined
>;
