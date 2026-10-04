/* eslint-disable @typescript-eslint/no-require-imports -- Mirrors the existing local TypeScript test runner; no environment or network access. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const originalLoad = Module._load;
Module._load = function (id, ...args) {
  if (id === 'server-only') return {};
  if (id === 'next/navigation') return { ...originalLoad.call(this, id, ...args), usePathname: () => '/' };
  if (id.startsWith('@/')) id = path.join(root, 'src', id.slice(2));
  return originalLoad.call(this, id, ...args);
};
require.extensions['.css'] = module => { module.exports = {}; };
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, filename);
const publication = require('../src/config/publication.ts');
const site = require('../src/config/site.ts');
const search = require('../src/config/search.ts');
const { renderToStaticMarkup } = require('react-dom/server');
const { createElement } = require('react');
const { ConditionalServicePage } = require('../src/components/ConditionalServicePage.tsx');
const { conditionalPages } = require('../src/content/conditional-pages.ts');
const { PricePair } = require('../src/components/PricePair.tsx');
const { PricingTable } = require('../src/components/PricingTable.tsx');
const { ApprovedDocument } = require('../src/components/ApprovedDocument.tsx');
const { siteRelease, promotion, legalPublication } = publication;
const gates = Object.keys(siteRelease.conditional);
function withPublished(fn) {
  const saved = structuredClone(siteRelease);
  siteRelease.stage = 'published';
  siteRelease.conditional = Object.fromEntries(gates.map(route => [route, false]));
  siteRelease.sampleReport = { approved: false, interactiveUrl: null, pdfUrl: null };
  try { fn(); } finally { Object.assign(siteRelease, saved); }
}

test('A122 actual local services and sample are complete and visible under global noindex', () => {
  for (const route of gates) {
    assert.equal(site.isSiteRouteAvailable(route), true);
    assert.equal(site.isSiteRoutePubliclyVisible(route), true);
    const html = renderToStaticMarkup(createElement(ConditionalServicePage, { content: conditionalPages[route] }));
    assert.doesNotMatch(html, /Local prelaunch review|Local preview|not publicly released|not approved|Working draft/);
    assert.match(html, route === "sampleReport" ? /What a sample cannot promise/ : /<details[^>]*><summary/);
    assert.doesNotMatch(html, /\[INSERT|Implementation note|<button[^>]+disabled/);
  }
});

test('unreleased published routes throw 404, disappear from navigation and sitemap', () => withPublished(() => {
  for (const route of gates) {
    assert.equal(site.isSiteRouteAvailable(route), false);
    assert.throws(() => ConditionalServicePage({ content: conditionalPages[route] }), /NEXT_HTTP_ERROR_FALLBACK;404/);
  }
  const links = site.getAvailableNavigationItems([...site.servicesNavigationItems, { route: 'sampleReport', label: 'Sample' }]);
  assert.ok(links.every(link => !gates.includes(link.route)));
  assert.deepEqual(search.indexableRoutes(), []);
  assert.equal(search.searchIsEnabled(), false);
}));

test('a released service uses the same configuration for navigation and route access', () => withPublished(() => {
  siteRelease.conditional.radonTesting = true;
  assert.equal(site.isSiteRouteAvailable('radonTesting'), true);
  assert.equal(site.isSiteRouteAvailable('sewerScope'), false);
  assert.ok(site.getAvailableNavigationItems(site.servicesNavigationItems).some(x => x.route === 'radonTesting'));
}));

test('sample requires both release approval and an approved safe artifact; no private URL renders by default', () => withPublished(() => {
  siteRelease.conditional.sampleReport = true;
  assert.equal(site.isSiteRouteAvailable('sampleReport'), false);
  siteRelease.sampleReport = { approved: true, interactiveUrl: 'javascript:alert(1)', pdfUrl: null };
  assert.equal(site.isSiteRouteAvailable('sampleReport'), false);
  siteRelease.sampleReport.interactiveUrl = 'https://example.invalid/approved-public-sample';
  assert.equal(site.isSiteRouteAvailable('sampleReport'), true);
  const html = renderToStaticMarkup(createElement(ConditionalServicePage, { content: conditionalPages.sampleReport }));
  assert.match(html, /Open Interactive Sample Report/);
  assert.doesNotMatch(html, /Local review|not been attached|Coming soon/);
  for (const value of ['//evil.invalid/a', '/private/report.pdf', 'http://example.invalid', 'https://user:password@example.invalid']) assert.equal(publication.safeArtifactUrl(value), undefined);
}));

test('legal approval alone cannot publish unfinished provisions or enable indexing', () => withPublished(() => {
  siteRelease.legalApproved = true;
  assert.equal(publication.legalCanBePublished(), false);
  for (const route of ['privacy', 'websiteTerms', 'accessibility']) assert.equal(site.isSiteRouteAvailable(route), false);
  assert.equal(search.searchIsEnabled(), false);
}));

test('future approved release enables only eligible search routes and dated articles', () => withPublished(() => {
  const saved = { ...legalPublication };
  const { resources } = require('../src/content/resources.ts');
  const savedDates = resources.map(({ publishedOn, updatedOn }) => ({ publishedOn, updatedOn }));
  try {
    Object.assign(legalPublication, { effectiveOn: '2026-10-01', reviewedOn: '2026-10-01', limitationOfLiability: 'Approved clause fixture.', governingLaw: 'Approved clause fixture.' });
    siteRelease.legalApproved = true;
    assert.equal(search.searchIsEnabled(), true);
    assert.ok(search.indexableRoutes().includes('home'));
    assert.equal(search.routeCanBeIndexed('radonTesting'), false);
    assert.equal(search.routeCanBeIndexed('priceAvailability'), false);
    assert.equal(search.routeCanBeIndexed('homeInspectionCostResource'), false);
    resources[0].publishedOn = '2020-10-01';
    assert.equal(search.routeCanBeIndexed('homeInspectionCostResource'), true);
    assert.equal(search.routeCanBeIndexed('homeInspectionExpectationsResource'), false);
    assert.equal(search.routeCanBeIndexed('resources'), false);
    const terms = renderToStaticMarkup(createElement(ApprovedDocument, { name: 'website-terms' }));
    assert.doesNotMatch(terms, /Indemnity or Misuse Remedy|Working draft/);
  } finally {
    Object.assign(legalPublication, saved);
    resources.forEach((resource, index) => Object.assign(resource, savedDates[index]));
  }
}));

test('promotion fails closed for disabled, missing, invalid, reversed, or expired dates', () => {
  const now = new Date('2026-10-05T12:00:00Z');
  assert.equal(publication.promotionIsActive(now), false);
  const offer = { ...promotion, enabled: true, startsOn: '2026-10-01', endsOn: '2026-10-31' };
  assert.equal(publication.promotionIsActive(now, offer), true);
  for (const values of [{ enabled: false }, { startsOn: null }, { startsOn: '2026-02-30' }, { startsOn: '2026-11-01' }, { endsOn: '2026-10-04' }]) assert.equal(publication.promotionIsActive(now, { ...offer, ...values }), false);
});

test('published disabled promotion hides introductory cards and table columns', () => withPublished(() => {
  const pair = renderToStaticMarkup(createElement(PricePair, { standard: { label: 'Standard', amount: '$450' }, introductory: { label: 'Introductory', amount: '$400' } }));
  assert.match(pair, /\$450/); assert.doesNotMatch(pair, /\$400|Introductory/);
  const table = renderToStaticMarkup(createElement(PricingTable, { caption: 'Prices', firstColumnLabel: 'Service', columns: [{ label: 'Introductory' }, { label: 'Standard' }], rows: [{ label: 'Residential', values: ['$400', '$450'] }] }));
  assert.match(table, /\$450/); assert.doesNotMatch(table, /\$400|Introductory/);
}));

function freshMarketingMarkup() {
  // Re-evaluate content after isolated in-memory state changes, like a fresh build.
  for (const key of Object.keys(require.cache)) {
    if (key.startsWith(path.join(root, 'src/content/')) || key.startsWith(path.join(root, 'src/components/'))) delete require.cache[key];
  }
  const pages = ['HomePage', 'FaqPage', 'PricingPage', 'ResidentialInspectionPage', 'OtherResidentialServicesPage', 'BuyersPage', 'ServicesOverviewPage'];
  const html = pages.map(name => renderToStaticMarkup(createElement(require(`../src/components/${name}.tsx`)[name])));
  const { ResourceArticle } = require('../src/components/ResourceArticle.tsx');
  const { resources } = require('../src/content/resources.ts');
  for (const resource of resources) html.push(renderToStaticMarkup(createElement(ResourceArticle, { resource })));
  return html.join('\n');
}

test('disabled promotion suppresses offer prose and headings across complete local and public marketing pages', () => {
  const saved = structuredClone(siteRelease);
  try {
    for (const stage of ['prelaunch', 'published']) {
      siteRelease.stage = stage;
      const html = freshMarketingMarkup();
      assert.match(html, /\$450/);
      const visibleText = html.replace(/<[^>]+>/g, ' ');
      const leaks = visibleText.match(/.{0,70}(?:introductory|both starting prices|six calendar months|\$400).{0,70}/gi) ?? [];
      assert.deepEqual(leaks, [], `Inactive promotion escaped in ${stage}`);
    }
  } finally { Object.assign(siteRelease, saved); }
});

test('a dated active promotion fixture restores approved offer prose and amounts without changing real switches', () => {
  const saved = { ...promotion };
  try {
    Object.assign(promotion, { enabled: true, startsOn: '2020-01-01', endsOn: '2099-12-31' });
    const html = freshMarketingMarkup();
    assert.match(html, /\$400/);
    assert.match(html, /introductory/i);
    assert.match(html, /Is the introductory price permanent/);
  } finally { Object.assign(promotion, saved); }
  assert.equal(publication.promotionIsActive(), false);
  assert.equal(siteRelease.stage, 'prelaunch');
});

test('prelaunch canonical is known, indexing is off, and unsupported public claims remain unset', () => {
  assert.equal(search.canonicalFor('home'), 'https://rivermarkinspections.com/');
  assert.equal(search.searchIsEnabled(), false);
  assert.deepEqual(search.indexableRoutes(), []);
  assert.deepEqual(publication.publicContact.phone, { approved: true, display: "616-308-5359", href: "tel:+16163085359" });
  assert.ok(Object.values(publication.professionalClaims).every(x => !x.approved && x.text === null));
});


test('A122 owned sample is a real PDF, linked from rendered content, with no private artifact path', () => {
  const href = siteRelease.sampleReport.pdfUrl;
  assert.equal(href, '/reports/rivermark-residential-sample.pdf');
  const pdf = fs.readFileSync(path.join(root, 'public', href));
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
  assert.ok(pdf.length > 100000);
  assert.equal(require('node:crypto').createHash('sha256').update(pdf).digest('hex'), '70099a262510a2929d2dad9b67ae5bc51d13547979a595e762c29ec8ac8a0df8');
  const html = renderToStaticMarkup(createElement(ConditionalServicePage, { content: conditionalPages.sampleReport }));
  assert.ok(html.includes(`href="${href}"`));
  assert.match(html, /Open Sample Report PDF|19-page fictional Residential sample/);
  assert.doesNotMatch(html, /private-qa|report-token|R8A|SYNTHETIC QA/);
});

test('A122 all24 routes, finished policies and three undated resources preserve factual safety', () => {
  const routes = require('../src/config/routes.ts').siteRoutes;
  assert.equal(Object.keys(routes).length, 24);
  for (const route of Object.keys(routes)) assert.equal(site.isSiteRouteAvailable(route), true, route);
  const { resources } = require('../src/content/resources.ts');
  assert.equal(resources.length, 3);
  assert.ok(resources.every(x => x.publishedOn === null && x.updatedOn === null));
  const { LegalAvailabilityPage } = require('../src/components/LegalAvailabilityPage.tsx');
  for (const document of ['privacy', 'website-terms']) {
    const html = renderToStaticMarkup(createElement(LegalAvailabilityPage, { document, title: document }));
    assert.doesNotMatch(html, /Local working draft|prelaunch|reserved for professional review|planning assumption|before publication|attorney.approved/i);
  }
  const NewConstructionPage = require('../src/app/services/new-construction-inspections/page.tsx').default;
  assert.match(renderToStaticMarkup(createElement(NewConstructionPage)), /Not Currently Scheduling/);
  assert.equal(siteRelease.stage, 'prelaunch');
  assert.equal(search.routeCanBeIndexed('priceAvailability'), false);
  assert.deepEqual(publication.publicContact.phone, { approved: true, display: "616-308-5359", href: "tel:+16163085359" });
  for (const route of Object.keys(routes)) {
    const { PageStructuredData } = require('../src/components/PageStructuredData.tsx');
    assert.doesNotMatch(renderToStaticMarkup(createElement(PageStructuredData, { route })), /aggregateRating|reviewRating|streetAddress|hasCredential/);
  }
});


test('A122 visible standard pricing retains approved Residential, condo and ancillary amounts', () => {
  freshMarketingMarkup(); // Rebuild module-initialized copy after the isolated active-offer fixture.
  const { PricingPage } = require('../src/components/PricingPage.tsx');
  const html = renderToStaticMarkup(createElement(PricingPage));
  for (const amount of ['$450', '$490', '$350', '$175', '$250', '$275', '$300', '$100', '$225', '$195']) assert.ok(html.includes(amount), amount);
  assert.doesNotMatch(html, /\$400|\$675|Introductory/);
});
