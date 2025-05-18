import { AbstractMessage, DbMessage } from '@/models'
import { Transformer } from '@/shared/interfaces'
import { injectable } from 'inversify'

@injectable()
export class DbAbstractMessageTransformer implements Transformer<AbstractMessage, DbMessage> {
  encode(data: AbstractMessage): DbMessage {
    return {
      id: data.messageId,
      senderid: data.senderId,
      timestamp: data.date.getTime() / 1000,
    }
  }

  decode(data: DbMessage): AbstractMessage {
    return {
      messageId: data.id,
      senderId: data.senderid,
      date: new Date(data.timestamp * 1000),
    }
  }
}
