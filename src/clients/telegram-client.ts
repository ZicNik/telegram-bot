export interface TelegramClient {
  sendMessage(chatId: number, text: string): Promise<void>
}
