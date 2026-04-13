# metaproject-bot TODO

## High Priority

- [ ] Add error handling for rate limiting from GitHub API
- [ ] Implement caching for TODO.md files to reduce API calls
- [ ] Add authentication for multiple allowed users instead of single ALLOWED_USER_ID
- [ ] Add logging for bot activity and errors
- [ ] Implement proper configuration validation on startup

## Medium Priority

- [ ] Add support for more projects in the TODO command
- [ ] Implement pagination for long TODO files (>3800 chars)
- [x] Add /help command with detailed usage instructions
- [ ] Add version command to show bot version
- [ ] Implement health check endpoint for monitoring

## Low Priority

- [ ] Add unit tests for all command handlers
- [ ] Add integration tests with mock Telegram API
- [ ] Implement proper documentation generation
- [ ] Add CI/CD pipeline for automated testing and deployment
- [ ] Add support for multiple Claude API models
- [ ] Implement conversation history for the /ask command
- [ ] Add support for file attachments in responses
- [ ] Implement proper error messages for network failures

## Technical Debt

- [ ] Refactor error handling to be more consistent
- [ ] Add proper TypeScript types instead of JavaScript
- [ ] Improve code organization and modularity
- [ ] Add proper input validation for all commands
- [ ] Implement proper configuration management

## Future Features

- [ ] Add support for code search across repositories
- [ ] Watch master branch and notify on new commits
- [ ] Support issue creation through chat (MyDoo is capable of that — see ../MyDoo)
- [ ] Implement issue tracking integration
- [ ] Add support for pull request notifications
- [ ] Implement repository statistics and metrics
- [ ] Add support for multiple metaproject repositories
