import sqlite from 'better-sqlite3'
import { inject, injectable } from 'inversify'
import { ConfigService } from './config-service'

@injectable()
export class DbService {
  readonly db: sqlite.Database

  constructor(
    @inject(ConfigService) config: ConfigService,
  ) {
    this.db = sqlite(config.dbPath, { fileMustExist: true, verbose: console.log })
  }
}
