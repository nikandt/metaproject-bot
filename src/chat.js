import OpenAI from 'openai';
import { appendNote } from './notes.js';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const history = [];
const MAX_HISTORY = 20;

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'add_todo',
      description: 'Add an item to the inbox / TODO list',
      parameters: {
        type: 'object',
        properties: {
          item: { type: 'string', description: 'The item to add' },
        },
        required: ['item'],
      },
    },
  },
];

export async function handleChat(text) {
  history.push({ role: 'user', content: text });
  if (history.length > MAX_HISTORY) history.splice(0, history.length - MAX_HISTORY);

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `You are a sharp personal assistant for a solo developer. Be concise — short sentences, no filler. Respond in the same language as the user. Today: ${new Date().toISOString().split('T')[0]}` },
        ...history,
      ],
      tools: TOOLS,
      temperature: 0.8,
    });

    const msg = response.choices[0].message;

    if (msg.tool_calls?.length) {
      const call = msg.tool_calls[0];
      const { item } = JSON.parse(call.function.arguments);
      const result = await appendNote(item);
      history.push({ role: 'assistant', content: result });
      return result;
    }

    const reply = msg.content ?? 'No response.';
    history.push({ role: 'assistant', content: reply });
    return reply;
  } catch (e) {
    return `Error: ${e.message}`;
  }
}

export function clearHistory() {
  history.length = 0;
  return 'Chat history cleared.';
}
