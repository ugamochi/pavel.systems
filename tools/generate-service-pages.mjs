import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync } from 'node:fs';
import { servicePages } from '../js/data/service-pages.js';
import { renderServiceDocument } from '../js/modules/service-page-renderer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const entries = Object.values(servicePages).sort((a, b) => a.slug.localeCompare(b.slug));

for (const service of entries) {
  const filePath = path.join(projectRoot, 'services', service.slug, 'index.html');
  const html = renderServiceDocument(service, {
    relativePrefix: '../../',
    baseUrl: 'https://ugamochi.github.io/ugamochi.systems/'
  });

  writeFileSync(filePath, `${html}\n`, 'utf8');
  console.log(`Generated: services/${service.slug}/index.html`);
}

console.log(`Done. Generated ${entries.length} service page(s).`);
