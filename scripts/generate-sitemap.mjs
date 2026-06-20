import { execFile } from 'node:child_process';
import { stat, readFile, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const siteUrl = (process.env.SITE_URL ?? 'https://davidgimenezrodriguez.com').replace(/\/$/, '');
const projects = JSON.parse(await readFile('public/content/projects.json', 'utf8'));
const execFileAsync = promisify(execFile);
const languages = ['es', 'en'];

const sharedSeoFiles = [
  'public/i18n/es.json',
  'public/i18n/en.json',
  'src/app/core/seo/seo.service.ts',
  'src/app/app.routes.ts',
];

const routeSources = {
  '': [
    'public/content/profile.json',
    'public/content/skills.json',
    'public/content/projects.json',
    'public/content/experience.json',
    'public/content/education.json',
    'src/app/features/home/home.component.html',
    'src/app/features/home/home.component.ts',
    'src/app/features/home/home.component.scss',
  ],
  about: [
    'public/content/profile.json',
    'public/content/skills.json',
    'src/app/features/about/about.component.html',
    'src/app/features/about/about.component.ts',
    'src/app/features/about/about.component.scss',
  ],
  projects: [
    'public/content/projects.json',
    'src/app/features/projects/projects-list.component.html',
    'src/app/features/projects/projects-list.component.ts',
    'src/app/features/projects/projects-list.component.scss',
  ],
  experience: [
    'public/content/experience.json',
    'src/app/features/experience/experience.component.html',
    'src/app/features/experience/experience.component.ts',
    'src/app/features/experience/experience.component.scss',
  ],
  education: [
    'public/content/education.json',
    'src/app/features/education/education.component.html',
    'src/app/features/education/education.component.ts',
    'src/app/features/education/education.component.scss',
  ],
  contact: [
    'public/content/profile.json',
    'src/app/features/contact/contact.component.html',
    'src/app/features/contact/contact.component.ts',
    'src/app/features/contact/contact.component.scss',
  ],
};

const projectRouteSources = [
  'public/content/projects.json',
  'src/app/features/projects/project-detail/project-detail.component.html',
  'src/app/features/projects/project-detail/project-detail.component.ts',
  'src/app/features/projects/project-detail/project-detail.component.scss',
];

const assetRoutes = [
  {
    path: 'cv/david-gimenez-rodriguez-senior-frontend-engineer-cv.pdf',
    sources: [
      'public/content/profile.json',
      'public/cv/david-gimenez-rodriguez-senior-frontend-engineer-cv.pdf',
    ],
    changefreq: 'yearly',
    priority: '0.4',
  },
];

const staticRoutes = Object.keys(routeSources);
const routes = [
  ...languages.flatMap((lang) =>
    staticRoutes.map((route) => ({
      path: route ? `${lang}/${route}` : lang,
      sources: [...sharedSeoFiles, ...routeSources[route]],
      changefreq: 'monthly',
      priority: route === '' ? '1.0' : '0.8',
    })),
  ),
  ...languages.flatMap((lang) =>
    projects.map((project) => ({
      path: `${lang}/projects/${project.slug}`,
      sources: [...sharedSeoFiles, ...projectRouteSources],
      changefreq: 'monthly',
      priority: '0.8',
    })),
  ),
  ...assetRoutes,
];

const entries = await Promise.all(
  routes.map(async ({ path, sources, changefreq, priority }) => {
    const loc = path ? `${siteUrl}/${path}` : `${siteUrl}/`;
    const lastmod = await getLatestLastModified(sources);

    return [
      '  <url>',
      `    <loc>${escapeXml(loc)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n');
  }),
);

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  entries.join('\n'),
  '</urlset>',
  '',
].join('\n');

const robots = ['User-agent: *', 'Allow: /', '', `Sitemap: ${siteUrl}/sitemap.xml`, ''].join('\n');

await writeFile('public/sitemap.xml', sitemap);
await writeFile('public/robots.txt', robots);

async function getLatestLastModified(paths) {
  const dates = await Promise.all(paths.map((path) => getLastModified(path)));
  return dates.sort().at(-1) ?? new Date().toISOString().slice(0, 10);
}

async function getLastModified(path) {
  const gitDate = await getGitLastModified(path);
  if (gitDate) return gitDate;

  const fileStat = await stat(path);
  return fileStat.mtime.toISOString().slice(0, 10);
}

async function getGitLastModified(path) {
  try {
    const { stdout } = await execFileAsync('git', ['log', '-1', '--format=%cs', '--', path]);
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
