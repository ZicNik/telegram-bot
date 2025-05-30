# Telegram Bot Prototype – A Developer-First Foundation

> A scalable, architecture-first Telegram bot template built with TypeScript and clean code principles.

## Introduction

This is a revisit of one of my earliest projects—back when I was not yet a professional developer. Today, with experience and maturity, I wanted to answer the question: *"How would I approach it now, with modern software design, proper architecture, and clean code practices?"*

This is a **prototype**, not a feature-complete bot. Its purpose is to lay down the foundations of a robust, extensible, and scalable Telegram bot built the right way. The *how* matters more than the *what*.

## Architecture Overview

### Design Principles

- **Domain-Driven Design (DDD)** — Clearly separated presentation, application, domain, and infrastructure layers.
- **Hexagonal Architecture** — The domain logic is isolated from tools.
- **Immutability** — Models are strictly immutable, to improve safety and predictability.

### Design Patterns

- **Dependency Injection** — Using [InversifyJS](https://inversify.io), the object graph is composed at the composition root and all dependencies are injected through constructors, making the system more testable and flexible.
- **Adapter Pattern** — To loosen the coupling, [Telegraf](https://github.com/telegraf/telegraf) is wrapped behind interfaces. `TelegramClient` and `Router` (the *ports*) adapt Telegraf's `Telegram` and `Telegraf` classes respectively, through their concrete implementations (the *adapters*).
- **Repository Pattern** — Data operations are abstracted from core logic.

### Project Structure

```
src/
├── bot.ts # Entry point, where bootstrapping and one-time setup happen
├── clients/ # Interact directly with tools
├── controllers/ # Handle incoming Telegram updates
├── dtos/ # Perform data tasks at a low level, using clients and transformers
├── infrastructure/ # Tools configuration
├── models/
│   ├── core/ # Business models
│   ├── db/ # Database models (essentially table rows)
│   └── telegram/ # Telegram API models
├── repositories/ # Abstract data tasks at a high level, internally using DTOs
├── routers/ # Receive Telegram updates and dispatch them to controllers
├── shared/
│   ├── utils.ts # Utility functions
│   └── interfaces/ # Interfaces reused across modules
└── transformers/ # Convert business models from or into external representations
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org)
- [Telegram Bot Token](https://core.telegram.org/bots/features#botfather)
- **Hosting Environment:** either a Node.js-capable platform with SSL/TLS or a self-hosted setup. For self-hosting, refer to my [nodejs-server](https://github.com/ZicNik/nodejs-server?tab=readme-ov-file#getting-started) repository for guidance.

### Setup

1. Run in the terminal:
```bash
git clone https://github.com/ZicNik/telegram-bot.git
cd telegram-bot
npm install
npm run createDb
npm run build
```
2. Update `.env` with your `BOT_TOKEN` and `WEBHOOK_DOMAIN`.
3. Replace `ssl/cert.pem` and `ssl/key.pem` with the public certificate chain and private key of your domain (either keep the filepaths or edit `.env`).
> **Tip:** Set the [bot commands](https://core.telegram.org/bots/features#commands)—those shown in Telegram under the menu button—via the provided script: `npm run setMyCommands`.

<details>
<summary>Notes for Cloud Hosting</summary>

The above applies as-is to self-hosting. If you’re using a managed platform (arguably the simpler path), keep the following in mind:
- **Skip SSL/TLS setup:** this is handled by the host.
  - Remove the `cert` and `key` arguments from `DefaultRouter.start`, and delete the `tlsOptions` line.
  - Trace these changes through `routers/router.ts` and `bot.ts`.
- **Use injected environment variables.**
  - A `.env` file is generally not required. Most platforms automatically inject common variables like `PORT`, and let you define the custom ones you need (e.g., `DB_PATH`, `BOT_TOKEN`).
  - Update `infrastructure/env-config.ts` to reflect name changes (e.g., replace `SECURE_PORT` with `PORT`) and remove unused entries (`CERT_PATH`, `KEY_PATH`).

</details>

### Running & Usage

Launch the bot with `npm start` or from VS Code's *Run and Debug* panel.  
Search for it on Telegram by username and start chatting.

The bot currently responds with custom messages to the core commands: */start*, */help*, and */settings*. If configured (via the mentioned script or the Bot Father), these appear under the menu button. Other text messages get a generic reply.

Behind the scenes, users and messages are logged to the database—demonstrating the functionality of repositories, DTOs, and transformers.

## Development Environment

### Clean Code Standards

- Strict `tsconfig.json` settings with type safety enforced across the board.
- Extensive `eslint.config.mjs` configuration of [ESLint](https://eslint.org), with strict, typed, and stylistic rules.
- If using [Visual Studio Code](https://code.visualstudio.com), `.vscode/settings.json` settings—together with the above configuration—enable the linter also as an automatic formatter. Even though [you might prefer a separate formatter](https://eslint.style/guide/why).
- Consistent file naming, import structure, and stylistic coherence.

### Tooling

- [SQLite](https://www.sqlite.org) used as a lightweight, portable persistence solution.
- [Scripts](./scripts/) included and added to `package.json` to streamline Telegram API setup.
- [Zod](https://github.com/colinhacks/zod) validates `.env` variables at startup, centralized in the injectable `EnvConfig` class.
- [tsup](https://github.com/egoist/tsup) bundles the build, allowing—among other things—the correct path aliases resolution.

## Extending the Bot

This project is designed for scalability. Here’s how to cleanly extend the codebase.

### Adding a New Command

1. **Declare the command** in `models/core/command.ts`:
```typescript
export const commands = {
  // ... existing commands
  MyNewCommandKey: 'mynewcommand', // Users will type /mynewcommand
} as const
```
2. **Wire it up** in `routers/default-router.ts` by extending the `routes` map. This links the internal routing to Telegraf.
```typescript
this.routes = {
  // ... existing routes
  MyNewCommandKey: routingPreparation, // of type (handler: RouteHandler<'MyNewCommandKey'>) => void
}
```
> **Tip:** Use `commandDefaultRoute` if no custom pre-processing is needed.
3. **Handle it** in `controllers/default-command-controller.ts` by updating the `handleCommand` method (i.e., add a `switch` case). This is how the bot reacts to the command.
> **Note:** Commands implemented this way are automatically dispatched to `CommandController.handleCommand`. You won't need to modify `bot.ts` to route them to any other controller's handler—as you would, if you were handling a new kind of update (see the next section).
4. **Rebuild, relaunch, and update** user-visible command list.

### Other Updates

The bot currently supports only the bare minimum of [Telegram Bot API updates](https://core.telegram.org/bots/api#update). Handling other types (e.g., location, media, callbacks) builds upon the same or similar steps to adding a command, but requires extra setup:
1. **Define the domain model:** add the new type in `models/core/`, nested within the generic `Update` type.
2. **Map the Telegram Structure:** faithfully replicate the structure in `models/telegram/`, as per Bot API.
3. **Create a transformer** in `transformers/`, to map between domain and Telegram model. Register it in `infrastructure/di-config.ts`, and inject it where needed.

> **Tip:** Use the `TextUpdate` as a reference implementation—it shows the entire flow.

## Further Considerations

The project emphasizes clarity and structure while remaining lightweight. Some production-level features were intentionally left out to avoid unnecessary complexity; others are already represented elsewhere in the codebase. Potential improvements include:
- **Complete Hexagonal Architecture**, already in place for the Telegram layer (Telegraf), and extendable to the database layer ([better-sqlite3](https://github.com/WiseLibs/better-sqlite3)).
- **Test suite**, leveraging dependency injection and interfaces.
- Converting selected methods into **async methods**, where appropriate (e.g., repositories).
- Centralized **error handling** for consistency and robustness.
- **Structured logging** (e.g., with [pino](https://github.com/pinojs/pino) or [winston](https://github.com/winstonjs/winston)) for observability and debugging.
- **Extended update handling** to support real-world Telegram scenarios.

## License

Licensed under the [MIT License](./LICENSE).
