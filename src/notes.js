const OWNER  = 'nikandt';
const REPO   = 'metaproject-bot';
const PATH   = 'INBOX.md';
const BRANCH = 'master';

function ghHeaders() {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

export async function appendNote(item) {
  if (!process.env.GITHUB_TOKEN) return 'GITHUB_TOKEN not set — cannot write notes.';

  try {
    // Fetch current file (may not exist yet)
    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
      { headers: ghHeaders() }
    );

    let content = '# Inbox\n\n';
    let sha;

    if (res.ok) {
      const data = await res.json();
      sha = data.sha;
      content = Buffer.from(data.content, 'base64').toString('utf-8');
    } else if (res.status !== 404) {
      return `GitHub API error: ${res.status}`;
    }

    const date = new Date().toISOString().split('T')[0];
    content += `- [ ] ${item} (${date})\n`;

    const body = { message: `inbox: ${item}`, content: Buffer.from(content).toString('base64'), branch: BRANCH };
    if (sha) body.sha = sha;

    const put = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
      { method: 'PUT', headers: ghHeaders(), body: JSON.stringify(body) }
    );

    if (!put.ok) return `Failed to write: ${put.status}`;
    return `Added to INBOX.md: "${item}"`;
  } catch (e) {
    return `Error: ${e.message}`;
  }
}
