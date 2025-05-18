import { CommandMessage, isCommand, TelegramCommandMessage } from '@/models'
import { Decoder } from '@/shared/interfaces'
import { inject, injectable } from 'inversify'
import { TelegramAbstractMessageDecoder } from './telegram-abstract-message-decoder'

@injectable()
export class TelegramCommandDecoder implements Decoder<CommandMessage, TelegramCommandMessage> {
  constructor(
    @inject(TelegramAbstractMessageDecoder) private decoder: TelegramAbstractMessageDecoder,
  ) {}

  decode(data: TelegramCommandMessage): CommandMessage {
    const command = data.command
    if (!isCommand(command))
      throw new Error('TelegramTextMessage to CommandMessage decoding failed: the message is not a command.')
    return {
      ...this.decoder.decode(data),
      command,
    }
  }
}
