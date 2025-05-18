import { TelegramClient } from '@/clients'
import { CommandType, CommandUpdate } from '@/models'
import { MessageRepository } from '@/repositories'
import { inject, injectable } from 'inversify'
import { CommandController } from './command-controller'

@injectable()
export class DefaultCommandController implements CommandController {
  constructor(
    @inject('TelegramClient') private client: TelegramClient,
    @inject('MessageRepository') private messageRepository: MessageRepository,
  ) {}

  handleCommand<T extends CommandType>(update: CommandUpdate<T>): void {
    this.messageRepository.addMessage(update)
    switch (update.command) {
      case 'start':
        void this.client.sendMessage(update.senderId, 'Welcome!')
        break
      case 'settings':
        void this.client.sendMessage(update.senderId, 'No settings available')
        break
      case 'help':
        void this.client.sendMessage(update.senderId, 'I wish I could...')
        break
    }
  }
}
