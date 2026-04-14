// Each entry: [owner, repo, branch, path-in-repo]
const SOURCES = {
  root:           ['nikandt', 'metaproject',  'master', 'TODO.md'],
  omamaya:        ['nikandt', 'metaproject',  'master', 'projects/omamaya/TODO.md'],
  pinot:          ['nikandt', 'metaproject',  'master', 'projects/pinot/TODO.md'],
  'pinot-server': ['nikandt', 'pinot-server', 'master', 'TODO.md'],
  'pinot-client': ['nikandt', 'pinot-client', 'main',   'TODO.md'],
  portfolio:      ['nikandt', 'metaproject',  'master', 'projects/portfolio/TODO.md'],
  slnd:           ['nikandt', 'metaproject',  'master', 'projects/SLND/TODO.md'],
  kitsat:         ['nikandt', 'metaproject',  'master', 'projects/SLND/kitsat/TODO.md'],
  cansat:         ['nikandt', 'cansat-next',  'main',   'TODO.md'],
  mydoo:          ['nikandt', 'metaproject',  'master', 'projects/SLND/MyDoo/TODO.md'],
  'bot-inbox':    ['nikandt', 'metaproject-bot', 'master', 'INBOX.md'],
};

export async function getTodo(project) {
  const key = project?.toLowerCase() ?? 'root';
  const source = SOURCES[key];

  if (!source) {
    return `Unknown project. Available: ${Object.keys(SOURCES).join(', ')}`;
  }

  const [owner, repo, branch, filePath] = source;
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;

  const headers = process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {};

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) return `Could not fetch TODO (${res.status}): ${url}`;
    return await res.text();
  } catch (e) {
    return `Error fetching TODO: ${e.message}`;
  }
}
