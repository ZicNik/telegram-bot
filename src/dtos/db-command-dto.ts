import { DbClient } from '@/clients'
import { tableKeyMap } from '@/infrastructure/db-schema'
import { CommandMessage, DbMessage } from '@/models'
import { dedent } from '@/shared/utils'
import { DbCommandTransformer } from '@/transformers'
import sqlite from 'better-sqlite3'
import { inject, injectable } from 'inversify'

function preparedStatements(db: sqlite.Database) {
  const { tableKey, fieldKeys } = tableKeyMap('messages')
  return {
    add: db.prepare<DbMessage>(dedent(`
      INSERT INTO ${tableKey}
        (${fieldKeys.id}, ${fieldKeys.senderid}, ${fieldKeys.timestamp}, ${fieldKeys.command})
      VALUES
        (@${fieldKeys.id}, @${fieldKeys.senderid}, @${fieldKeys.timestamp}, @${fieldKeys.command})`)),
  }
}

@injectable()
export class DbCommandDto {
  private statements: ReturnType<typeof preparedStatements>

  constructor(
    @inject(DbClient) client: DbClient,
    @inject(DbCommandTransformer) private transformer: DbCommandTransformer,
  ) {
    this.statements = preparedStatements(client.db)
  }

  addCommand(message: CommandMessage): void {
    this.statements.add.run(this.transformer.encode(message))
  }
}
