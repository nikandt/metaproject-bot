# metaproject-bot TODO

## High Priority

- [x] Add error handling for rate limiting from GitHub API
- [ ] Implement caching for TODO.md files to reduce API calls
- [ ] Add authentication for multiple allowed users instead of single ALLOWED_USER_ID
- [x] Add logging for bot activity and errors
- [x] Implement proper configuration validation on startup

## Medium Priority

- [ ] Add support for more projects in the TODO command
- [x] Implement pagination for long TODO files (>3800 chars)
- [x] Add /help command with detailed usage instructions
- [ ] Add version command to show bot version
- [x] Implement health check (systemd watchdog — Zabbix monitoring active)

## Future Features

- [ ] Add support for code search across repositories
- [x] Watch master branch and notify on new commits
- [x] Support issue creation through chat (GitHub issues on metaproject)
- [x] Write to INBOX.md via natural language (GPT function calling)
- [ ] Add support for pull request notifications
- [ ] Implement repository statistics and metrics

## Email Migration (kitsat.fi + spacelabnextdoor.com)

- [ ] Add forwarding addresses in ImprovMX for kitsat.fi (4 addresses)
- [ ] Update MX records in Louhi for kitsat.fi (mx1/mx2.improvmx.com)
- [ ] Add SPF TXT record in Louhi: `v=spf1 include:spf.improvmx.com ~all`
- [ ] Set up Amazon SES: verify kitsat.fi domain, add DKIM records in Louhi
- [ ] Create SES SMTP credentials
- [ ] Configure Gmail "Send mail as" for each kitsat.fi address via SES SMTP
- [ ] Verify spacelabnextdoor.com is working via Hostinger email + Gmail
- [ ] Wait for Google Takeout exports to finish (Gmail .mbox + Drive files)
- [ ] Download and verify Takeout archives before cancelling G Suite
- [ ] Cancel G Suite (~35 EUR/month saving)

## Infrastructure

- [x] Deploy on AWS EC2 (Debian) via systemd
- [x] Zabbix process monitoring (proc.num checks + triggers)
- [x] EC2 on Tailscale — Zabbix accessible at http://100.71.195.61:8080
- [ ] Fix Zabbix agent IP after container restart (update host interface in Zabbix UI)
- [ ] Fix disk usage on EC2 (>90% used, 7.7GB total)
- [ ] Fix drone-api crash loop (restart counter >100)
