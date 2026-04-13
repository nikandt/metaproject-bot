const OWNER = 'nikandt';
const REPO  = 'metaproject';

function ghHeaders() {
  const h = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

export async function gitLog(n = 5) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=${n}`,
      { headers: ghHeaders() }
    );
    if (!res.ok) return `GitHub API error: ${res.status}`;
    const commits = await res.json();
    return commits
      .map(c => `${c.sha.slice(0, 7)} ${c.commit.message.split('\n')[0]}`)
      .join('\n');
  } catch (e) {
    return `Error: ${e.message}`;
  }
}

export async function gitStatus() {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=1`,
      { headers: ghHeaders() }
    );
    if (!res.ok) return `GitHub API error: ${res.status}`;
    const [latest] = await res.json();
    const date = new Date(latest.commit.author.date).toLocaleString('fi-FI', { timeZone: 'Europe/Helsinki' });
    return `${OWNER}/${REPO}\nLatest commit: ${latest.sha.slice(0, 7)} ${latest.commit.message.split('\n')[0]}\nBy: ${latest.commit.author.name} @ ${date}`;
  } catch (e) {
    return `Error: ${e.message}`;
  }
}
