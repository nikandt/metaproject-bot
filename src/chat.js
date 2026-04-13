import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// In-memory history for the single allowed user
const history = [];
const MAX_HISTORY = 20;

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
      temperature: 0.8,
    });

    const reply = response.choices[0].message.content ?? 'No response.';
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
