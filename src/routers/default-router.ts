import { CommandMessage, commands, CommandType, CommandUpdate, UpdateType } from '@/models'
import { UserRepository } from '@/repositories'
import { ConfigService } from '@/services'
import { TelegramCommandDecoder, TelegramTextMessageDecoder, TelegramUserTransformer } from '@/transformers'
import { inject, injectable } from 'inversify'
import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { RouteHandler, Router } from './router'

type RouteMap = { [T in UpdateType]: (handler: RouteHandler<T>) => void }

function commandDefaultRoute<T extends CommandType>(
  type: T,
  telegraf: Telegraf,
  commandDecoder: TelegramCommandDecoder,
  userTransformer: TelegramUserTransformer,
  usersRepository: UserRepository,
): (handler: RouteHandler<T>) => void {
  return (handler) => {
    telegraf.command(commands[type], (ctx) => {
      const user = userTransformer.decode(ctx.from)
      usersRepository.addOrUpdateUserIfNeeded(user)
      const commandMessage = commandDecoder.decode({ ...ctx.message, command: ctx.command }) as CommandMessage<T>
      const commandUpdate = { ...commandMessage, updateId: ctx.update.update_id } as CommandUpdate<T>
      handler(commandUpdate)
    })
  }
}

@injectable()
export class DefaultRouter implements Router {
  private telegraf: Telegraf
  private routes: RouteMap

  constructor(
    @inject(ConfigService) config: ConfigService,
    @inject(TelegramCommandDecoder) commandDecoder: TelegramCommandDecoder,
    @inject(TelegramTextMessageDecoder) textDecoder: TelegramTextMessageDecoder,
    @inject(TelegramUserTransformer) userTransformer: TelegramUserTransformer,
    @inject('UserRepository') usersRepository: UserRepository,
  ) {
    const telegraf = new Telegraf(config.botToken)
    this.telegraf = telegraf
    this.routes = {
      StartCommand: commandDefaultRoute('StartCommand', telegraf, commandDecoder, userTransformer, usersRepository),
      HelpCommand: commandDefaultRoute('HelpCommand', telegraf, commandDecoder, userTransformer, usersRepository),
      SettingsCommand: commandDefaultRoute('SettingsCommand', telegraf, commandDecoder, userTransformer, usersRepository),
      TextMessage: (handler) => {
        telegraf.on(message('text'), (ctx) => {
          const user = userTransformer.decode(ctx.from)
          usersRepository.addOrUpdateUserIfNeeded(user)
          const message = textDecoder.decode(ctx.update.message)
          handler({ ...message, updateId: ctx.update.update_id })
        })
      },
    }
  }

  on<T extends UpdateType>(type: T, handler: RouteHandler<T>): void {
    this.routes[type](handler)
  }

  async start(domain: string, port: number, cert: Buffer, key: Buffer): Promise<void> {
    for (const sig of ['SIGINT', 'SITERM'] as const)
      process.once(sig, () => {
        this.telegraf.stop(sig)
      })
    await this.telegraf.launch({ webhook: {
      domain,
      port,
      tlsOptions: { cert, key },
    } })
  }
}
