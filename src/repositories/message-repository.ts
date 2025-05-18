import { Message } from '@/models'

export interface MessageRepository {
  addMessage(message: Message): void
}
