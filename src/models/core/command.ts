import { includesValue } from '@/shared/utils'

/** Supported commands.
 * @see https://core.telegram.org/bots/features#commands
*/
export const commands = {
  StartCommand: 'start',
  HelpCommand: 'help',
  SettingsCommand: 'settings',
} as const

/**
 * @see https://core.telegram.org/bots/features#commands
*/
export type CommandType = keyof typeof commands

interface _Command<T extends CommandType> {
  command: (typeof commands)[T]
}

export type Command<T extends CommandType = CommandType> = Readonly<_Command<T>>

/** Determines whether a `Command` can be instantiated from `cmd`. */
export function isCommand(cmd: string): cmd is Command['command'] {
  return includesValue(commands as Record<CommandType, string>, cmd)
}
