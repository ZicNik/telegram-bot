import dotenv from 'dotenv'
import { injectable } from 'inversify'
import { z } from 'zod'

const schema = z.object({
  DB_PATH: z.string(),
  BOT_TOKEN: z.string(),
  WEBHOOK_DOMAIN: z.string(),
  SECURE_PORT: z.coerce.number().nonnegative().int(),
  CERT_PATH: z.string(),
  KEY_PATH: z.string(),
})

@injectable()
export class ConfigService {
  private config: z.infer<typeof schema>

  constructor() {
    dotenv.config()
    const result = schema.safeParse(process.env)
    if (!result.success)
      throw new Error(`Invalid dontenv configuration:\n\t${result.error.message}`)
    this.config = result.data
  }

  get dbPath() { return this.config.DB_PATH }
  get botToken() { return this.config.BOT_TOKEN }
  get webhookDomain() { return this.config.WEBHOOK_DOMAIN }
  get securePort() { return this.config.SECURE_PORT }
  get certPath() { return this.config.CERT_PATH }
  get keyPath() { return this.config.KEY_PATH }
}
