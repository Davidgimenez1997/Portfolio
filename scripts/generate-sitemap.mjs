import { readFile, writeFile } from 'node:fs/promises';

const siteUrl = (process.env.SITE_URL ?? 'https://davidgimenezrodriguez.com').replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);
const projects = JSON.parse(await readFile('public/content/projects.json', 'utf8'));

const staticRoutes = ['', 'about', 'projects', 'experience', 'education', 'contact'];
const projectRoutes = projects.map((project) => `projects/${project.slug}`);
const routes = [...staticRoutes, ...projectRoutes];

const entries = routes
  .map((route) => {
    const loc = route ? `${siteUrl}/${route}` : `${siteUrl}/`;

    return [
      '  <url>',
      `    <loc>${escapeXml(loc)}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      '    <changefreq>monthly</changefreq>',
      route === '' ? '    <priority>1.0</priority>' : '    <priority>0.8</priority>',
      '  </url>',
    ].join('\n');
  })
  .join('\n');

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  entries,
  '</urlset>',
  '',
].join('\n');

const robots = ['User-agent: *', 'Allow: /', '', `Sitemap: ${siteUrl}/sitemap.xml`, ''].join('\n');

await writeFile('public/sitemap.xml', sitemap);
await writeFile('public/robots.txt', robots);

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
