// Each entry: [owner, repo, path-in-repo]
const SOURCES = {
  root:           ['nikandt', 'metaproject',     'TODO.md'],
  omamaya:        ['nikandt', 'metaproject',     'projects/omamaya/TODO.md'],
  pinot:          ['nikandt', 'metaproject',     'projects/pinot/TODO.md'],
  'pinot-server': ['nikandt', 'pinot-server',    'TODO.md'],
  'pinot-client': ['nikandt', 'pinot-client',    'TODO.md'],
  portfolio:      ['nikandt', 'metaproject',     'projects/portfolio/TODO.md'],
  slnd:           ['nikandt', 'metaproject',     'projects/SLND/TODO.md'],
  kitsat:         ['nikandt', 'metaproject',     'projects/SLND/kitsat/TODO.md'],
  cansat:         ['nikandt', 'cansat-next',     'TODO.md'],
  mydoo:          ['nikandt', 'metaproject',     'projects/SLND/MyDoo/TODO.md'],
};

export async function getTodo(project) {
  const key = project?.toLowerCase() ?? 'root';
  const source = SOURCES[key];

  if (!source) {
    return `Unknown project. Available: ${Object.keys(SOURCES).join(', ')}`;
  }

  const [owner, repo, filePath] = source;
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/master/${filePath}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return `Could not fetch TODO (${res.status}): ${url}`;
    const content = await res.text();
    return content.length > 3800 ? content.slice(0, 3800) + '\n\n…(truncated)' : content;
  } catch (e) {
    return `Error fetching TODO: ${e.message}`;
  }
}
