import { DbUserDto } from '@/dtos'
import { isUserChanged, User } from '@/models'
import { inject, injectable } from 'inversify'
import { UserRepository } from './user-repository'

@injectable()
export class DefaultUserRepository implements UserRepository {
  private cache: Partial<Record<number, User>>

  constructor(
    @inject(DbUserDto) private datasource: DbUserDto,
  ) {
    this.cache = datasource.getAllUsers()
      .reduce<typeof this.cache>((prev, curr) => {
        prev[curr.userId] = curr
        return prev
      }, {})
  }

  getUser(id: number): User | undefined {
    return this.cache[id]
  }

  getAllUsers(): User[] {
    return Object.values(this.cache).filter(u => u !== undefined)
  }

  addUser(user: User): void {
    this.cache[user.userId] = user
    this.datasource.addUser(user)
  }

  updateUser(user: User): void {
    this.cache[user.userId] = user
    this.datasource.updateUser(user)
  }

  addOrUpdateUserIfNeeded(user: User): void {
    const prev = this.getUser(user.userId)
    if (prev === undefined)
      this.addUser(user)
    else if (isUserChanged(prev, user))
      this.updateUser(user)
  }
}
