# Setup

## AWS EC2 Deployment (Debian)

### 1. Clone and install

```bash
git clone <repo-url> /home/admin/metaproject-bot
cd /home/admin/metaproject-bot
npm install
```

### 2. Environment file

Create `/home/admin/metaproject-bot/.env` with the required variables:

```
TELEGRAM_BOT_TOKEN=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GITHUB_TOKEN=
```

### 3. systemd service

Create the service file:

```bash
sudo tee /etc/systemd/system/metaproject-bot.service > /dev/null << 'EOF'
[Unit]
Description=Metaproject Telegram Bot
After=network.target

[Service]
Type=simple
User=admin
WorkingDirectory=/home/admin/metaproject-bot
ExecStart=/usr/bin/node src/index.js
Restart=on-failure
RestartSec=5
WatchdogSec=60
NotifyAccess=main
StandardOutput=journal
StandardError=journal
SyslogIdentifier=metaproject-bot
EnvironmentFile=/home/admin/metaproject-bot/.env

[Install]
WantedBy=multi-user.target
EOF
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable metaproject-bot
sudo systemctl start metaproject-bot
```

### 4. Useful commands

```bash
# Status
sudo systemctl status metaproject-bot

# Live logs
sudo journalctl -u metaproject-bot -f

# Restart after code update
git pull && sudo systemctl restart metaproject-bot
```
