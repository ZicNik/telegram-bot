import { CommandType, CommandUpdate } from '@/models'

export interface CommandController {
  handleCommand<T extends CommandType>(update: CommandUpdate<T>): void
}
