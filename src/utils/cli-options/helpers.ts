export function getArgs(): string[] {
  return process.argv.map((arg) => arg.toLowerCase());
}

export function getArgValue(name: string): string | undefined {
  const arg = getArgs().find((arg) => arg.startsWith(`--${name}=`));
  if (!arg) return;
  return arg.substr(name.length + '--='.length);
}

export function getFlag(name: string, defaultValue?: boolean): boolean {
  if (getArgs().includes(`--${name}`)) return true;
  return defaultValue === undefined ? false : defaultValue;
}

export function getBool(name: string, defaultValue?: boolean): boolean {
  const argValue = getArgValue(name);

  if (!argValue) {
    if (defaultValue === undefined) {
      throw new Error(`Required boolean argument "--${name}" not found`);
    }
    return defaultValue;
  }

  if (argValue === 'on' || argValue === 'true') return true;
  if (argValue === 'off' || argValue === 'false') return false;
  throw new Error(`Wrong value for the boolean argument "${name}"`);
}

export function getNumber(name: string, defaultValue?: number): number {
  const argValue = getArgValue(name);

  if (!argValue) {
    if (defaultValue === undefined) {
      throw new Error(`Required numeric argument "--${name}" not found`);
    }
    return defaultValue;
  }

  const val = Number(argValue);
  if (!isNaN(val)) return val;

  throw new Error(`Wrong value for the numeric argument "--${name}"`);
}

export function getString(name: string, defaultValue?: string): string {
  const argValue = getArgValue(name);

  if (!argValue) {
    if (defaultValue === undefined) {
      throw new Error(`Required string argument "--${name}" not found`);
    }
    return defaultValue;
  }

  return argValue;
}
