import { tableKeyMap } from '@/infrastructure/db/db-schema'
import { DbMessage, TextMessage } from '@/models'
import { DbService } from '@/services'
import { dedent } from '@/shared/utils'
import { DbTextMessageTransformer } from '@/transformers'
import sqlite from 'better-sqlite3'
import { inject, injectable } from 'inversify'

function preparedStatements(db: sqlite.Database) {
  const { tableKey, fieldKeys } = tableKeyMap('messages')
  return {
    add: db.prepare<DbMessage>(dedent(`
      INSERT INTO ${tableKey}
        (${fieldKeys.id}, ${fieldKeys.senderid}, ${fieldKeys.timestamp}, ${fieldKeys.text})
      VALUES
        (@${fieldKeys.id}, @${fieldKeys.senderid}, @${fieldKeys.timestamp}, @${fieldKeys.text})`)),
  }
}

@injectable()
export class DbTextMessageDto {
  private statements: ReturnType<typeof preparedStatements>

  constructor(
    @inject(DbService) dbService: DbService,
    @inject(DbTextMessageTransformer) private transformer: DbTextMessageTransformer,
  ) {
    this.statements = preparedStatements(dbService.db)
  }

  addTextMessage(message: TextMessage): void {
    this.statements.add.run(this.transformer.encode(message))
  }
}
