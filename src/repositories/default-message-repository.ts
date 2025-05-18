import { DbCommandDto, DbTextMessageDto } from '@/dtos'
import { isCommandMessage, isTextMessage, Message } from '@/models'
import { inject, injectable } from 'inversify'
import { MessageRepository } from './message-repository'

@injectable()
export class DefaultMessageRepository implements MessageRepository {
  constructor(
    @inject(DbCommandDto) private commandDto: DbCommandDto,
    @inject(DbTextMessageDto) private textMessageDto: DbTextMessageDto,
  ) {}

  addMessage(message: Message): void {
    if (isCommandMessage(message))
      this.commandDto.addCommand(message)
    else if (isTextMessage(message))
      this.textMessageDto.addTextMessage(message)
  }
}
