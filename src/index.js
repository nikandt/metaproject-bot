import { Telegraf } from 'telegraf';
import { handleAsk } from './ask.js';
import { gitLog, gitStatus } from './git.js';
import { getTodo } from './todo.js';
import { handleChat, clearHistory } from './chat.js';

const token = process.env.TELEGRAM_TOKEN;
const allowedUserId = parseInt(process.env.ALLOWED_USER_ID ?? '0', 10);

if (!token) throw new Error('TELEGRAM_TOKEN is required');
if (!allowedUserId) throw new Error('ALLOWED_USER_ID is required');

const bot = new Telegraf(token);

// Auth guard — only respond to the configured user
bot.use((ctx, next) => {
  if (ctx.from?.id !== allowedUserId) return ctx.reply('Unauthorized.');
  return next();
});

bot.start((ctx) => ctx.reply(
  'metaproject bot\n\n' +
  '/todo [project] — show TODO\n' +
  '/log [n]        — recent commits\n' +
  '/status         — git status\n' +
  '/ask <question> — ask Claude about the codebase\n' +
  '/clear          — clear chat history\n' +
  'anything else   — chat with gpt-4o-mini'
));

bot.command('todo', async (ctx) => {
  const project = ctx.message.text.split(' ').slice(1).join(' ').trim() || null;
  const result = await getTodo(project);
  await ctx.reply(result, { parse_mode: 'Markdown' });
});

bot.command('log', async (ctx) => {
  const n = parseInt(ctx.message.text.split(' ')[1] ?? '5', 10);
  const result = await gitLog(isNaN(n) ? 5 : n);
  await ctx.reply(result);
});

bot.command('status', async (ctx) => {
  const result = await gitStatus();
  await ctx.reply(result);
});

bot.command('ask', async (ctx) => {
  const question = ctx.message.text.split(' ').slice(1).join(' ').trim();
  if (!question) return ctx.reply('Usage: /ask <question>');
  await ctx.reply('Thinking...');
  const result = await handleAsk(question);
  await ctx.reply(result);
});

bot.command('clear', (ctx) => ctx.reply(clearHistory()));

bot.on('text', async (ctx) => {
  const reply = await handleChat(ctx.message.text);
  await ctx.reply(reply);
});

bot.launch();
console.log('Bot running');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
