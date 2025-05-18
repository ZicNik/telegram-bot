import { DbUser, User } from '@/models'
import { Transformer } from '@/shared/interfaces'
import { injectable } from 'inversify'

@injectable()
export class DbUserTransformer implements Transformer<User, DbUser> {
  encode(data: User): DbUser {
    return {
      id: data.userId,
      username: data.username,
      firstname: data.firstName,
      lastname: data.lastName,
    }
  }

  decode(data: DbUser): User {
    return {
      userId: data.id,
      firstName: data.firstname,
      username: data.username,
      lastName: data.lastname,
    }
  }
}
