import { tableKeyMap } from '@/infrastructure/db/db-schema'
import { DbUser, User } from '@/models'
import { DbService } from '@/services'
import { dedent } from '@/shared/utils'
import { DbUserTransformer } from '@/transformers'
import sqlite from 'better-sqlite3'
import { inject, injectable } from 'inversify'

function preparedStatements(db: sqlite.Database) {
  const { tableKey, fieldKeys } = tableKeyMap('users')
  return {
    getAll: db.prepare<[], DbUser>(`SELECT * FROM ${tableKey}`),
    add: db.prepare<DbUser>(dedent(`
      INSERT INTO ${tableKey}
        (${fieldKeys.id}, ${fieldKeys.firstname}, ${fieldKeys.lastname}, ${fieldKeys.username})
      VALUES
        (@${fieldKeys.id}, @${fieldKeys.firstname}, @${fieldKeys.lastname}, @${fieldKeys.username})`)),
    update: db.prepare<DbUser>(dedent(`
      UPDATE ${tableKey} SET
        ${fieldKeys.firstname} = @${fieldKeys.firstname},
        ${fieldKeys.lastname} = @${fieldKeys.lastname},
        ${fieldKeys.username} = @${fieldKeys.username}
      WHERE ${fieldKeys.id} = @${fieldKeys.id}`)),
  }
}

@injectable()
export class DbUserDto {
  private statements: ReturnType<typeof preparedStatements>

  constructor(
    @inject(DbService) dbService: DbService,
    @inject(DbUserTransformer) private mapper: DbUserTransformer,
  ) {
    this.statements = preparedStatements(dbService.db)
  }

  getAllUsers(): User[] {
    return this.statements.getAll.all()
      .map(user => this.mapper.decode(user))
  }

  addUser(user: User): void {
    this.statements.add.run(this.mapper.encode(user))
  }

  updateUser(user: User): void {
    this.statements.update.run(this.mapper.encode(user))
  }
}
