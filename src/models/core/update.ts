import { CommandType } from './command'
import { Message, MessageType } from './message'

// Put here all update types, one per row
type UpdateTypeMap = {
  [T in MessageType]: Message<T>
}

/** Supported update types. */
// Same as `type UpdateType = keyof UpdateTypeMap` but forces the editor to resolve the types
export type UpdateType = {
  [K in keyof UpdateTypeMap]: K
}[keyof UpdateTypeMap]

interface _AbstractUpdate {
  updateId: number
}

export type AbstractUpdate = Readonly<_AbstractUpdate>

export type Update<T extends UpdateType = UpdateType> = AbstractUpdate & UpdateTypeMap[T]

// Utility types
export type MessageUpdate<T extends MessageType = MessageType> = Update<T>
export type CommandUpdate<T extends CommandType = CommandType> = Update<T>
export type TextUpdate = Update<'TextMessage'>
