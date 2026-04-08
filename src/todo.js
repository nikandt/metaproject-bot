import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const base = process.env.METAPROJECT_PATH ?? '.';

const PROJECT_TODO_PATHS = {
  root:            'TODO.md',
  omamaya:         'projects/omamaya/TODO.md',
  pinot:           'projects/pinot/TODO.md',
  'pinot-server':  'projects/pinot/pinot-server/TODO.md',
  'pinot-client':  'projects/pinot/pinot-client/TODO.md',
  portfolio:       'projects/portfolio/TODO.md',
  slnd:            'projects/SLND/TODO.md',
  kitsat:          'projects/SLND/kitsat/TODO.md',
  cansat:          'projects/SLND/cansat-next/TODO.md',
  mydoo:           'projects/SLND/MyDoo/TODO.md',
};

export async function getTodo(project) {
  const key = project?.toLowerCase() ?? 'root';
  const rel = PROJECT_TODO_PATHS[key];

  if (!rel) {
    const available = Object.keys(PROJECT_TODO_PATHS).join(', ');
    return `Unknown project. Available: ${available}`;
  }

  const filePath = path.join(base, rel);
  if (!existsSync(filePath)) return `TODO not found at ${rel}`;

  const content = await readFile(filePath, 'utf8');
  return content.length > 3800 ? content.slice(0, 3800) + '\n\n…(truncated)' : content;
}
