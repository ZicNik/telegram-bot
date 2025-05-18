import { TelegramMessage } from './telegram-message'

interface _TelegramCommandMessage extends TelegramMessage {
  command: string
}

export type TelegramCommandMessage = Readonly<_TelegramCommandMessage>
