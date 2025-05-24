import { EnvConfig } from '@/infrastructure/env-config'
import sqlite from 'better-sqlite3'
import { inject, injectable } from 'inversify'

@injectable()
export class DbClient {
  readonly db: sqlite.Database

  constructor(
    @inject(EnvConfig) config: EnvConfig,
  ) {
    this.db = sqlite(config.dbPath, { fileMustExist: true, verbose: console.log })
  }
}
