import { TelegramTextMessage, TextMessage } from '@/models'
import { Decoder } from '@/shared/interfaces'
import { inject, injectable } from 'inversify'
import { TelegramAbstractMessageDecoder } from './telegram-abstract-message-decoder'

@injectable()
export class TelegramTextMessageDecoder implements Decoder<TextMessage, TelegramTextMessage> {
  constructor(
    @inject(TelegramAbstractMessageDecoder) private decoder: TelegramAbstractMessageDecoder,
  ) {}

  decode(data: TelegramTextMessage): TextMessage {
    const message = this.decoder.decode(data)
    return {
      ...message,
      text: data.text,
    }
  }
}
