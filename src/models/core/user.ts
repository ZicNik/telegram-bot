interface _User {
  userId: number
  firstName: string
  lastName?: string
  username?: string
}

export type User = Readonly<_User>

export function isUserChanged(before: User, after: User): boolean {
  return before.firstName !== after.firstName
    || before.lastName !== after.lastName
    || before.username !== after.username
}
