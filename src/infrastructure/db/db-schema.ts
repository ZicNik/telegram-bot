import { conformance, keyMap } from '@/shared/utils'

// Types definition

type Schema = Readonly<Record<string, Table>>
type Table = Readonly<Record<string, Field>>
type Field = Readonly<_Field>
interface _Field {
  Type: FieldType
  Options?: readonly FieldOption[]
}
type FieldType = typeof types[keyof typeof types]
const types = {
  Integer: 'INTEGER',
  Real: 'REAL',
  Text: 'TEXT',
} as const
type FieldOption = ReturnType<typeof options[keyof typeof options]>
const options = {
  NotNull: () => 'NOT NULL' as const,
  PrimaryKey: () => 'PRIMARY KEY' as const,
  AutoIncrement: () => 'AUTOINCREMENT' as const,
  Default: (value: string | number) => `DEFAULT ${value}` as const,
} as const

// Concrete instances

const users = conformance<Table>()
  .check({
    id: { Type: types.Integer, Options: [options.PrimaryKey()] },
    firstname: { Type: types.Text, Options: [options.NotNull()] },
    lastname: { Type: types.Text },
    username: { Type: types.Text },
  } as const)

const messages = conformance<Table>()
  .check({
    id: { Type: types.Integer, Options: [options.PrimaryKey()] },
    senderid: { Type: types.Integer, Options: [options.NotNull()] },
    timestamp: { Type: types.Integer, Options: [options.NotNull()] },
    command: { Type: types.Text },
    text: { Type: types.Text },
  } as const)

export const schema = conformance<Schema>()
  .check({ users, messages } as const)

// Utilities

export function tableKeyMap<K extends keyof typeof schema>(tableKey: K) {
  return { tableKey, fieldKeys: keyMap(schema[tableKey]) }
}
