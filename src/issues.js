const OWNER = 'nikandt';
const REPO  = 'metaproject';

export async function createIssue(title, body = '') {
  if (!process.env.GITHUB_TOKEN) return 'GITHUB_TOKEN not set — cannot create issues.';

  try {
    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/issues`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, body }),
      }
    );

    if (res.status === 410) return 'Issues are disabled for this repository.';
    if (!res.ok) return `GitHub API error: ${res.status}`;

    const issue = await res.json();
    return `Issue created: #${issue.number} ${issue.title}\n${issue.html_url}`;
  } catch (e) {
    return `Error: ${e.message}`;
  }
}
