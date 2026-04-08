import Anthropic from '@anthropic-ai/sdk';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const base = process.env.METAPROJECT_PATH ?? '.';

async function loadContext() {
  const files = [
    'README.md',
    'TODO.md',
    'projects/omamaya/TODO.md',
    'projects/pinot/TODO.md',
    'projects/portfolio/TODO.md',
    'projects/SLND/TODO.md',
  ];

  const parts = await Promise.all(files.map(async (f) => {
    const p = path.join(base, f);
    if (!existsSync(p)) return null;
    const content = await readFile(p, 'utf8');
    return `### ${f}\n${content}`;
  }));

  return parts.filter(Boolean).join('\n\n');
}

export async function handleAsk(question) {
  try {
    const context = await loadContext();
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system:
        'You are a helpful assistant with access to the metaproject repository context. ' +
        'Answer questions concisely. Here is the current project context:\n\n' + context,
      messages: [{ role: 'user', content: question }],
    });
    return message.content[0].type === 'text' ? message.content[0].text : 'No response.';
  } catch (e) {
    return `Error: ${e.message}`;
  }
}
