interface _TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
}

export type TelegramUser = Readonly<_TelegramUser>
