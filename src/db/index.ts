export class DB {
  public async load(): Promise<void> {}

  public async save(): Promise<void> {}

  public reset(): void {}
}

export const db = new DB();
