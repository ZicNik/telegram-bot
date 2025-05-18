import { Update, UpdateType } from '@/models'

export type RouteHandler<T extends UpdateType> = (update: Update<T>) => void

export interface Router {
  /** Registers a handler for updates of type `type`. */
  on<T extends UpdateType>(type: T, handler: RouteHandler<T>): void
  start(domain: string, port: number, cert: Buffer, key: Buffer): Promise<void>
}
