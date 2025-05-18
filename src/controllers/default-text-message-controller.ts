import { TelegramClient } from '@/clients'
import { TextUpdate } from '@/models'
import { MessageRepository } from '@/repositories'
import { inject, injectable } from 'inversify'
import { TextMessageController } from './text-message-controller'

const defaultReply = 'Couldn\'t match any command. Try typing "/" or using the Menu button.'

@injectable()
export class DefaultTextMessageController implements TextMessageController {
  constructor(
    @inject('TelegramClient') private client: TelegramClient,
    @inject('MessageRepository') private messageRepository: MessageRepository,
  ) {}

  handleTextMessage(update: TextUpdate): void {
    this.messageRepository.addMessage(update)
    void this.client.sendMessage(update.senderId, defaultReply)
  }
}
