import { TelegramUser } from './telegram-user'

interface _TelegramMessage {
  message_id: number
  from: TelegramUser
  date: number
}

export type TelegramMessage = Readonly<_TelegramMessage>
