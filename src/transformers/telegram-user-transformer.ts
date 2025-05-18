import { TelegramUser, User } from '@/models'
import { Transformer } from '@/shared/interfaces'
import { injectable } from 'inversify'

@injectable()
export class TelegramUserTransformer implements Transformer<User, TelegramUser> {
  encode(data: User): TelegramUser {
    return {
      id: data.userId,
      first_name: data.firstName,
      username: data.username,
      last_name: data.lastName,
    }
  }

  decode(data: TelegramUser): User {
    return {
      userId: data.id,
      firstName: data.first_name,
      username: data.username,
      lastName: data.last_name,
    }
  }
}
