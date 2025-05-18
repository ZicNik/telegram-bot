import { User } from '@/models'

export interface UserRepository {
  getUser(id: number): User | undefined
  getAllUsers(): User[]
  addUser(user: User): void
  updateUser(user: User): void
  addOrUpdateUserIfNeeded(user: User): void
}
