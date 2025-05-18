import { Command, CommandType } from './command'
import { Text } from './text'

// Put here message types, one per row
type MessageTypeMap = {
  [T in CommandType]: Command<T>
} & {
  TextMessage: Text
}

/** Supported message types. */
// Same as `type MessageType = keyof MessageTypeMap` but forces the editor to resolve the types
export type MessageType = {
  [K in keyof MessageTypeMap]: K
}[keyof MessageTypeMap]

interface _AbstractMessage {
  messageId: number
  senderId: number
  date: Date
}

export type AbstractMessage = Readonly<_AbstractMessage>

export type Message<T extends MessageType = MessageType> = AbstractMessage & MessageTypeMap[T]

// Utility types
export type CommandMessage<T extends CommandType = CommandType> = Message<T>
export type TextMessage = Message<'TextMessage'>

export function isCommandMessage(msg: Message): msg is CommandMessage {
  return 'command' in msg
}

export function isTextMessage(msg: Message): msg is TextMessage {
  return 'text' in msg
}
