interface _DbUser {
  id: number
  firstname: string
  lastname?: string
  username?: string
}

export type DbUser = Readonly<_DbUser>
