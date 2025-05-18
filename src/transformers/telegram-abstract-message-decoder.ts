import { AbstractMessage, TelegramMessage } from '@/models'
import { Decoder } from '@/shared/interfaces'
import { injectable } from 'inversify'

@injectable()
export class TelegramAbstractMessageDecoder implements Decoder<AbstractMessage, TelegramMessage> {
  decode(data: TelegramMessage): AbstractMessage {
    return {
      messageId: data.message_id,
      senderId: data.from.id,
      date: new Date(data.date * 1000),
    }
  }
}
