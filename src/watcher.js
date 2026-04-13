import { log, error } from './logger.js';

const WATCH_REPOS = [
  { owner: 'nikandt', repo: 'metaproject',     branch: 'master' },
  { owner: 'nikandt', repo: 'metaproject-bot', branch: 'master' },
];

const POLL_INTERVAL = 2 * 60 * 1000; // 2 minutes
const lastSeen = {};

function ghHeaders() {
  const h = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function getLatestCommit(owner, repo, branch) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&per_page=1`,
    { headers: ghHeaders() }
  );
  if (!res.ok) return null;
  const [commit] = await res.json();
  return commit;
}

export async function startWatcher(bot, chatId) {
  // Seed initial SHAs without notifying
  await Promise.all(WATCH_REPOS.map(async ({ owner, repo, branch }) => {
    const commit = await getLatestCommit(owner, repo, branch);
    if (commit) {
      lastSeen[`${owner}/${repo}`] = commit.sha;
      log(`Watcher seeded: ${owner}/${repo} @ ${commit.sha.slice(0, 7)}`);
    }
  }));

  setInterval(async () => {
    for (const { owner, repo, branch } of WATCH_REPOS) {
      try {
        const commit = await getLatestCommit(owner, repo, branch);
        if (!commit) continue;
        const key = `${owner}/${repo}`;
        if (!lastSeen[key]) { lastSeen[key] = commit.sha; continue; }
        if (lastSeen[key] === commit.sha) continue;

        lastSeen[key] = commit.sha;
        const date = new Date(commit.commit.author.date).toLocaleString('fi-FI', { timeZone: 'Europe/Helsinki' });
        await bot.telegram.sendMessage(
          chatId,
          `New commit on ${key}\n${commit.sha.slice(0, 7)} ${commit.commit.message.split('\n')[0]}\nBy: ${commit.commit.author.name} @ ${date}`
        );
        log(`Notified: ${key} @ ${commit.sha.slice(0, 7)}`);
      } catch (e) {
        error(`Watcher error for ${owner}/${repo}: ${e.message}`);
      }
    }
  }, POLL_INTERVAL);

  log(`Watcher started — polling every ${POLL_INTERVAL / 1000}s`);
}
