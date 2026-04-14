import { Telegraf } from 'telegraf';
import { handleAsk } from './ask.js';
import { gitLog, gitStatus } from './git.js';
import { getTodo } from './todo.js';
import { handleChat, clearHistory } from './chat.js';
import { startWatcher } from './watcher.js';
import { createIssue } from './issues.js';
import { appendNote } from './notes.js';
import { startWatchdog } from './healthcheck.js';
import { log, warn, error } from './logger.js';

// Config validation
const REQUIRED = ['TELEGRAM_TOKEN', 'ALLOWED_USER_ID'];
const OPTIONAL = ['ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'GITHUB_TOKEN'];

for (const key of REQUIRED) {
  if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
}
for (const key of OPTIONAL) {
  if (!process.env[key]) warn(`${key} not set — related features will be unavailable`);
}

const token = process.env.TELEGRAM_TOKEN;
const allowedUserId = parseInt(process.env.ALLOWED_USER_ID, 10);

const bot = new Telegraf(token);

// Pagination — splits text into ≤4096-char chunks on newline boundaries
function paginate(text, limit = 4096) {
  const pages = [];
  while (text.length > limit) {
    let split = text.lastIndexOf('\n', limit);
    if (split === -1) split = limit;
    pages.push(text.slice(0, split));
    text = text.slice(split + 1);
  }
  if (text) pages.push(text);
  return pages;
}

// Auth guard — only respond to the configured user
bot.use((ctx, next) => {
  if (ctx.from?.id !== allowedUserId) return ctx.reply('Unauthorized.');
  return next();
});

const HELP_TEXT =
  'metaproject bot\n\n' +
  '/todo [project]         — show TODO\n' +
  '/inbox                  — show inbox\n' +
  '/log [n]                — recent commits\n' +
  '/status                 — git status\n' +
  '/issue <title> [| body] — create GitHub issue\n' +
  '/ask <question>         — ask Claude about the codebase\n' +
  '/clear                  — clear chat history\n' +
  '/help                   — show this message\n' +
  'anything else           — chat with gpt-4o-mini\n' +
  '"add to TODO: X"        — appends X to INBOX.md';

bot.start((ctx) => ctx.reply(HELP_TEXT));
bot.help((ctx) => ctx.reply(HELP_TEXT));

bot.command('todo', async (ctx) => {
  const project = ctx.message.text.split(' ').slice(1).join(' ').trim() || null;
  log(`/todo ${project ?? 'root'} from ${ctx.from.id}`);
  const result = await getTodo(project);
  for (const page of paginate(result)) {
    await ctx.reply(page, { parse_mode: 'Markdown' });
  }
});

bot.command('log', async (ctx) => {
  const n = parseInt(ctx.message.text.split(' ')[1] ?? '5', 10);
  log(`/log ${n} from ${ctx.from.id}`);
  const result = await gitLog(isNaN(n) ? 5 : n);
  await ctx.reply(result);
});

bot.command('status', async (ctx) => {
  log(`/status from ${ctx.from.id}`);
  const result = await gitStatus();
  await ctx.reply(result);
});

bot.command('inbox', async (ctx) => {
  log(`/inbox from ${ctx.from.id}`);
  const result = await getTodo('bot-inbox');
  for (const page of paginate(result)) {
    await ctx.reply(page, { parse_mode: 'Markdown' });
  }
});

bot.command('issue', async (ctx) => {
  const input = ctx.message.text.split(' ').slice(1).join(' ').trim();
  if (!input) return ctx.reply('Usage: /issue <title> [| body]');
  const [title, ...rest] = input.split('|');
  const body = rest.join('|').trim();
  log(`/issue from ${ctx.from.id}: ${title.trim()}`);
  const result = await createIssue(title.trim(), body);
  await ctx.reply(result);
});

bot.command('ask', async (ctx) => {
  const question = ctx.message.text.split(' ').slice(1).join(' ').trim();
  if (!question) return ctx.reply('Usage: /ask <question>');
  log(`/ask from ${ctx.from.id}: ${question}`);
  await ctx.reply('Thinking...');
  const result = await handleAsk(question);
  for (const page of paginate(result)) {
    await ctx.reply(page);
  }
});

bot.command('clear', (ctx) => {
  log(`/clear from ${ctx.from.id}`);
  ctx.reply(clearHistory());
});

bot.on('text', async (ctx) => {
  log(`chat from ${ctx.from.id}: ${ctx.message.text.slice(0, 60)}`);
  const reply = await handleChat(ctx.message.text);
  await ctx.reply(reply);
});

bot.launch();
log('Bot running');

startWatcher(bot, allowedUserId);
startWatchdog();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
