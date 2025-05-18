import { TelegramMessage } from './telegram-message'

interface _TelegramTextMessage extends TelegramMessage {
  text: string
}

export type TelegramTextMessage = Readonly<_TelegramTextMessage>
