import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CONTEXT_FILES = [
  ['nikandt', 'metaproject', 'README.md'],
  ['nikandt', 'metaproject', 'TODO.md'],
  ['nikandt', 'metaproject', 'projects/omamaya/TODO.md'],
  ['nikandt', 'metaproject', 'projects/pinot/TODO.md'],
  ['nikandt', 'metaproject', 'projects/portfolio/TODO.md'],
  ['nikandt', 'metaproject', 'projects/SLND/TODO.md'],
];

async function loadContext() {
  const parts = await Promise.all(CONTEXT_FILES.map(async ([owner, repo, filePath]) => {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/master/${filePath}`;
    const headers = process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {};
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) return null;
      return `### ${filePath}\n${await res.text()}`;
    } catch { return null; }
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
