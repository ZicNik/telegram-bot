import { ConfigService } from '@/services'
import { inject, injectable } from 'inversify'
import { Telegram } from 'telegraf'
import { TelegramClient } from './telegram-client'

@injectable()
export class DefaultTelegramClient implements TelegramClient {
  private client: Telegram

  constructor(
    @inject(ConfigService) config: ConfigService,
  ) {
    this.client = new Telegram(config.botToken)
  }

  async sendMessage(chatId: number, text: string): Promise<void> {
    await this.client.sendMessage(chatId, text)
  }
}
