import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync } from 'node:fs';
import { servicePages } from '../js/data/service-pages.js';
import { getServiceCanonicalUrl } from '../js/modules/service-page-renderer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const failures = [];

const requiredKeys = [
  'slug',
  'serviceNumber',
  'title',
  'metaDescription',
  'subtitle',
  'pricing',
  'proof',
  'problemTitle',
  'problems',
  'processTitle',
  'process',
  'fit',
  'outcomes',
  'deliverables',
  'integrations',
  'ownershipNote',
  'packages',
  'faqTitle',
  'faqs',
  'nextStepTitle',
  'contact',
  'theme'
];

const services = Object.values(servicePages);
if (!services.length) {
  failures.push('No service definitions found in js/data/service-pages.js');
}

for (const service of services) {
  for (const key of requiredKeys) {
    if (service[key] == null) {
      failures.push(`${service.slug}: missing required key \`${key}\``);
    }
  }

  if ((service.problems || []).length !== 3) {
    failures.push(`${service.slug}: expected 3 problems, found ${(service.problems || []).length}`);
  }

  if ((service.process || []).length !== 4) {
    failures.push(`${service.slug}: expected 4 process steps, found ${(service.process || []).length}`);
  }

  if ((service.packages || []).length !== 3) {
    failures.push(`${service.slug}: expected 3 packages, found ${(service.packages || []).length}`);
  }

  if ((service.faqs || []).length < 4) {
    failures.push(`${service.slug}: expected at least 4 FAQs, found ${(service.faqs || []).length}`);
  }

  const pagePath = path.join(projectRoot, 'services', service.slug, 'index.html');
  if (!existsSync(pagePath)) {
    failures.push(`${service.slug}: missing page file services/${service.slug}/index.html`);
    continue;
  }

  const html = readFileSync(pagePath, 'utf8');
  const canonical = getServiceCanonicalUrl(service.slug, 'https://ugamochi.github.io/ugamochi.systems/');

  expectContains(html, `<h1 class="service-headline">${escapeForContains(service.title)}</h1>`, `${service.slug}: static H1 not found in generated HTML`);
  expectContains(html, `href="${canonical}"`, `${service.slug}: canonical URL mismatch`);
  expectContains(html, '<main class="service-page" id="main"', `${service.slug}: missing service main container`);
  expectContains(html, 'class="faq service-faq', `${service.slug}: missing FAQ accordion section`);
  expectContains(html, 'Book Discovery Call', `${service.slug}: missing primary discovery-call CTA text`);

  validateAnchorTargets(html, service.slug);
  validateLocalAssetLinks(html, pagePath, service.slug);
}

validateHomePageLinks();

if (failures.length) {
  console.error('Validation failed with the following issues:\n');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Validation passed for ${services.length} service page(s).`);

function expectContains(html, fragment, message) {
  if (!html.includes(fragment)) {
    failures.push(message);
  }
}

function validateAnchorTargets(html, slug) {
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  const anchorTargets = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);

  for (const target of anchorTargets) {
    if (!ids.has(target)) {
      failures.push(`${slug}: anchor href="#${target}" has no matching id`);
    }
  }
}

function validateLocalAssetLinks(html, pagePath, slug) {
  const matches = [
    ...html.matchAll(/(?:href|src)="([^"]+)"/g)
  ].map((match) => match[1]);

  for (const ref of matches) {
    if (
      ref.startsWith('#') ||
      ref.startsWith('http://') ||
      ref.startsWith('https://') ||
      ref.startsWith('mailto:') ||
      ref.startsWith('data:')
    ) {
      continue;
    }

    const withoutQuery = ref.split('?')[0].split('#')[0];
    const absolutePath = path.resolve(path.dirname(pagePath), withoutQuery);

    if (!existsSync(absolutePath)) {
      failures.push(`${slug}: local reference not found -> ${ref}`);
    }
  }
}

function validateHomePageLinks() {
  const indexPath = path.join(projectRoot, 'index.html');
  if (!existsSync(indexPath)) {
    failures.push('Missing root index.html');
    return;
  }

  const indexHtml = readFileSync(indexPath, 'utf8');

  for (const service of services) {
    const expectedHref = `services/${service.slug}/`;
    if (!indexHtml.includes(expectedHref)) {
      failures.push(`Homepage is missing link to ${expectedHref}`);
    }
  }

  if (!indexHtml.includes('book-discovery-call/')) {
    failures.push('Homepage nav CTA does not link to book-discovery-call/');
  }
}

function escapeForContains(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
