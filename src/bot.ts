import { CommandController, TextMessageController } from '@/controllers'
import { composeObjectGraph } from '@/infrastructure/di-config'
import { EnvConfig } from '@/infrastructure/env-config'
import { commands, CommandType } from '@/models'
import { Router } from '@/routers'
import { readFileSync } from 'fs'

export class Bot {
  constructor(
    private config: EnvConfig,
    private router: Router,
    private commandController: CommandController,
    private messageController: TextMessageController,
  ) {}

  start() {
    Object.keys(commands).forEach((command) => {
      this.router.on(command as CommandType, (update) => {
        this.commandController.handleCommand(update)
      })
    })
    this.router.on('TextMessage', (update) => {
      this.messageController.handleTextMessage(update)
    })
    void this.router.start(
      this.config.webhookDomain,
      this.config.securePort,
      readFileSync(this.config.certPath),
      readFileSync(this.config.keyPath),
    )
  }
}

const container = composeObjectGraph()
const bot = new Bot(
  container.get(EnvConfig),
  container.get<Router>('Router'),
  container.get<CommandController>('CommandController'),
  container.get<TextMessageController>('TextMessageController'),
)
bot.start()
