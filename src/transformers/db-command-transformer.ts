import { CommandMessage, DbMessage, isCommand } from '@/models'
import { Transformer } from '@/shared/interfaces'
import { inject, injectable } from 'inversify'
import { DbAbstractMessageTransformer } from './db-abstract-message-transformer'

@injectable()
export class DbCommandTransformer implements Transformer<CommandMessage, DbMessage> {
  constructor(
    @inject(DbAbstractMessageTransformer) private messageTransformer: DbAbstractMessageTransformer,
  ) {}

  encode(data: CommandMessage): DbMessage {
    return {
      ...this.messageTransformer.encode(data),
      command: data.command,
    }
  }

  decode(data: DbMessage): CommandMessage {
    const command = data.command
    if (command === undefined || !isCommand(command))
      throw new Error('DbMessage to CommandMessage decoding failed: the message is not a command.')
    const message = this.messageTransformer.decode(data)
    return {
      ...message,
      command,
    }
  }
}
