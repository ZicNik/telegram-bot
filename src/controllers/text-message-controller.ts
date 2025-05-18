import { TextUpdate } from '@/models'

export interface TextMessageController {
  handleTextMessage(update: TextUpdate): void
}
