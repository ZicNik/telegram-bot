import { DbMessage, TextMessage } from '@/models'
import { Transformer } from '@/shared/interfaces'
import { inject, injectable } from 'inversify'
import { DbAbstractMessageTransformer } from './db-abstract-message-transformer'

@injectable()
export class DbTextMessageTransformer implements Transformer<TextMessage, DbMessage> {
  constructor(
    @inject(DbAbstractMessageTransformer) private messageTransformer: DbAbstractMessageTransformer,
  ) {}

  encode(data: TextMessage): DbMessage {
    const message = this.messageTransformer.encode(data)
    return {
      ...message,
      text: data.text,
    }
  }

  decode(data: DbMessage): TextMessage {
    const text = data.text
    if (text === undefined)
      throw new Error('DbMessage to TextMessage decoding failed: \'text\' is NULL.')
    const message = this.messageTransformer.decode(data)
    return {
      ...message,
      text,
    }
  }
}
