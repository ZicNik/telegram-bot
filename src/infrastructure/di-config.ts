import { DbClient, DefaultTelegramClient, TelegramClient } from '@/clients'
import { CommandController, DefaultCommandController, DefaultTextMessageController, TextMessageController } from '@/controllers'
import { DbCommandDto, DbTextMessageDto, DbUserDto } from '@/dtos'
import { EnvConfig } from '@/infrastructure/env-config'
import { DefaultMessageRepository, DefaultUserRepository, MessageRepository, UserRepository } from '@/repositories'
import { DefaultRouter, Router } from '@/routers'
import { DbAbstractMessageTransformer, DbCommandTransformer, DbTextMessageTransformer, DbUserTransformer, TelegramAbstractMessageDecoder, TelegramCommandDecoder, TelegramTextMessageDecoder, TelegramUserTransformer } from '@/transformers'
import { Container } from 'inversify'

let objectGraphComposed = false

/**
 * Composes the object graph. This must happen only once and only in one place, the so called `Composition Root`.
 * @returns The DI container. Reference it only from the `Composition Root`.
 */
export function composeObjectGraph(): Container {
  if (objectGraphComposed)
    throw new Error('Attempted to compose object graph after it was already composed. Ensure the composition happens once only.')
  // Configure the object graph here
  const container = new Container()
  // Configs
  container.bind(EnvConfig).toSelf().inSingletonScope()
  // Transformers
  container.bind(DbAbstractMessageTransformer).toSelf().inSingletonScope()
  container.bind(DbCommandTransformer).toSelf().inSingletonScope()
  container.bind(DbTextMessageTransformer).toSelf().inSingletonScope()
  container.bind(DbUserTransformer).toSelf().inSingletonScope()
  container.bind(TelegramAbstractMessageDecoder).toSelf().inSingletonScope()
  container.bind(TelegramCommandDecoder).toSelf().inSingletonScope()
  container.bind(TelegramTextMessageDecoder).toSelf().inSingletonScope()
  container.bind(TelegramUserTransformer).toSelf().inSingletonScope()
  // Dtos
  container.bind(DbTextMessageDto).toSelf().inSingletonScope()
  container.bind(DbCommandDto).toSelf().inSingletonScope()
  container.bind(DbUserDto).toSelf().inSingletonScope()
  // Repositories
  container.bind<MessageRepository>('MessageRepository').to(DefaultMessageRepository).inSingletonScope()
  container.bind<UserRepository>('UserRepository').to(DefaultUserRepository).inSingletonScope()
  // Controllers
  container.bind<CommandController>('CommandController').to(DefaultCommandController).inSingletonScope()
  container.bind<TextMessageController>('TextMessageController').to(DefaultTextMessageController).inSingletonScope()
  // Clients
  container.bind(DbClient).toSelf().inSingletonScope()
  container.bind<TelegramClient>('TelegramClient').to(DefaultTelegramClient).inSingletonScope()
  // Router
  container.bind<Router>('Router').to(DefaultRouter).inSingletonScope()

  objectGraphComposed = true
  return container
}
