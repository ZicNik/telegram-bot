interface _DbMessage {
  id: number
  senderid: number
  timestamp: number
  command?: string
  text?: string
}

export type DbMessage = Readonly<_DbMessage>
