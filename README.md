# metaproject-bot

Telegram bot for accessing the metaproject codebase from mobile. Powered by Telegraf + Claude API. Hosted on Hostinger as a persistent Node.js process.

## Commands

| Command | Description |
|---------|-------------|
| `/todo [project]` | Show TODO.md for a project (`root`, `subproject`) |
| `/log [n]` | Last n git commits (default 5) |
| `/status` | Git status of the metaproject repo |
| `/ask <question>` | Ask Claude a question about the codebase |

## Setup

### 1. Get credentials

- Create a bot via [@BotFather](https://t.me/BotFather) → copy the token
- Get your Telegram user ID via [@userinfobot](https://t.me/userinfobot)
- Get a Claude API key from [console.anthropic.com](https://console.anthropic.com)

### 2. Configure

```bash
cp .env.example .env
# Fill in TELEGRAM_TOKEN, ANTHROPIC_API_KEY, ALLOWED_USER_ID, METAPROJECT_PATH
```

### 3. Install and run

```bash
npm install
npm start
```

## Hostinger deployment

1. Upload to Hostinger Node.js app (or push via git and configure auto-deploy)
2. Set environment variables in Hostinger's app settings (not in `.env` file)
3. Set startup file to `src/index.js`
4. Enable the Node.js process manager to keep it alive

## Security

The bot rejects all messages from users whose Telegram ID does not match `ALLOWED_USER_ID`. Only read-only git operations are exposed.
