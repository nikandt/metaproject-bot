import simpleGit from 'simple-git';
import { existsSync } from 'fs';

const repoPath = process.env.METAPROJECT_PATH;

function getGit() {
  if (!repoPath) return null;
  // Normalize: strip surrounding quotes that some .env parsers leave in
  const p = repoPath.replace(/^['"]|['"]$/g, '');
  if (!existsSync(p)) return null;
  return simpleGit(p);
}

export async function gitLog(n = 5) {
  const git = getGit();
  if (!git) return `METAPROJECT_PATH not set or not found (got: ${repoPath ?? 'undefined'})`;
  try {
    const log = await git.log(['--oneline', `-${n}`]);
    if (!log.all.length) return 'No commits found.';
    return log.all.map(c => `${c.hash.slice(0, 7)} ${c.message}`).join('\n');
  } catch (e) {
    return `Error: ${e.message}`;
  }
}

export async function gitStatus() {
  const git = getGit();
  if (!git) return `METAPROJECT_PATH not set or not found (got: ${repoPath ?? 'undefined'})`;
  try {
    const status = await git.status();
    const lines = [];
    if (status.current) lines.push(`Branch: ${status.current}`);
    if (status.modified.length) lines.push(`Modified: ${status.modified.join(', ')}`);
    if (status.not_added.length) lines.push(`Untracked: ${status.not_added.join(', ')}`);
    if (status.staged.length) lines.push(`Staged: ${status.staged.join(', ')}`);
    if (lines.length === 1) lines.push('Working tree clean');
    return lines.join('\n');
  } catch (e) {
    return `Error: ${e.message}`;
  }
}
