/* eslint-disable @typescript-eslint/no-require-imports -- Existing no-network TypeScript test convention. */
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
  if (id === 'next/navigation') return { ...originalLoad.call(this, id, ...args), usePathname: () => '/about/' };
  if (id.startsWith('@/')) id = path.join(root, 'src', id.slice(2));
  return originalLoad.call(this, id, ...args);
};
require.extensions['.css'] = module => { module.exports = {}; };
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, filename);
const { createElement } = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const publication = require('../src/config/publication.ts');
const { resources } = require('../src/content/resources.ts');
const search = require('../src/config/search.ts');
const { ResourceInline, resourceLinkHref } = require('../src/components/ResourceInline.tsx');
const { ResourceArticle, houseAreaExamplePrice } = require('../src/components/ResourceArticle.tsx');
const { PageStructuredData, StructuredData } = require('../src/components/PageStructuredData.tsx');
const { AboutPage } = require('../src/components/AboutPage.tsx');
const { aboutContent } = require('../src/content/about.ts');
const { HomePage } = require('../src/components/HomePage.tsx');
const { ResidentialInspectionPage } = require('../src/components/ResidentialInspectionPage.tsx');
const { OtherResidentialServicesPage } = require('../src/components/OtherResidentialServicesPage.tsx');
const { BuyersPage } = require('../src/components/BuyersPage.tsx');
const { PricingPage } = require('../src/components/PricingPage.tsx');
const { ContactPage } = require('../src/components/ContactPage.tsx');
const { FaqPage } = require('../src/components/FaqPage.tsx');
const { contextualFaqIds, resolveContextualFaqs, resolveMasterFaqCategories } = require('../src/content/faq-selection.ts');
const { workflowReadiness, workflowReadinessStates } = require('../src/config/workflows.ts');
const { resolveRouteData } = require('next/dist/build/webpack/loaders/metadata/resolve-route-data');
const robots = require('../src/app/robots.ts').default;
const sitemap = require('../src/app/sitemap.ts').default;
const render = (Component, props) => renderToStaticMarkup(createElement(Component, props));
function schemaNodes(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(match => JSON.parse(match[1]));
}
function withPublicFixture(run) {
  const release = structuredClone(publication.siteRelease);
  const legal = { ...publication.legalPublication };
  const dates = resources.map(({ publishedOn, updatedOn }) => ({ publishedOn, updatedOn }));
  try {
    publication.siteRelease.stage = 'published';
    publication.siteRelease.conditional = Object.fromEntries(Object.keys(publication.siteRelease.conditional).map(route => [route, false]));
    publication.siteRelease.sampleReport = { approved: false, interactiveUrl: null, pdfUrl: null };
    publication.siteRelease.legalApproved = true;
    Object.assign(publication.legalPublication, { effectiveOn: '2020-01-01', reviewedOn: '2020-01-01', limitationOfLiability: 'Fixture only.', governingLaw: 'Fixture only.' });
    run();
  } finally {
    Object.assign(publication.siteRelease, release);
    Object.assign(publication.legalPublication, legal);
    resources.forEach((resource, index) => Object.assign(resource, dates[index]));
  }
}

test('editorial anchors use canonical routes and existing fragments with escaped names', () => {
  const html = render(ResourceInline, { text: 'Compare [prices & scope](/pricing/) or [manual review](/contact/#manual-review).' });
  assert.match(html, /<a href="\/pricing\/">prices &amp; scope<\/a>/);
  assert.match(html, /href="\/contact\/#manual-review"/);
  assert.equal(resourceLinkHref('/services/other-residential-services/#other-services-full-heading'), '/services/other-residential-services/#other-services-full-heading');
  assert.doesNotMatch(html, /target=|onclick=|tabindex="-1"/);
});

test('allowed editorial fragments exist once in eligible rendered destinations, including specific condominium scope', () => {
  const destinations = [
    ['/services/other-residential-services/', OtherResidentialServicesPage, ['other-services-full-heading', 'other-services-condominium-heading', 'other-services-pre-listing-heading', 'other-services-maintenance-heading', 'other-services-investment-heading', 'other-services-pre-offer-heading', 'other-services-investor-consultation-heading', 'other-services-follow-up-heading', 'other-services-scope-heading']],
    ['/services/residential-home-inspections/', ResidentialInspectionPage, ['limitations-heading']],
    ['/pricing/', PricingPage, ['manual-review-heading']],
    ['/contact/', ContactPage, ['manual-review', 'contact-form']],
  ];
  const check = () => {
    for (const [pathname, Component, fragments] of destinations) {
      const destination = render(Component);
      for (const fragment of fragments) {
        const href = `${pathname}#${fragment}`;
        assert.equal(resourceLinkHref(href), href);
        assert.equal(render(ResourceInline, { text: `[Read the scope](${href})` }), `<a href="${href}">Read the scope</a>`);
        assert.equal([...destination.matchAll(new RegExp(`\\bid="${fragment}"`, 'g'))].length, 1, `${publication.siteRelease.stage}: ${href}`);
      }
    }
    const condoHref = '/services/other-residential-services/#other-services-condominium-heading';
    assert.match(render(OtherResidentialServicesPage), /<h3\b[^>]*id="other-services-condominium-heading"[^>]*>Condominium and Townhome Inspections<\/h3>/);
    assert.ok(render(ResourceArticle, { resource: resources[0] }).includes(`href="${condoHref}"`));
    const faqItem = resolveMasterFaqCategories().flatMap(category => category.items).find(item => item.id === 'faq-condominium-townhome');
    assert.equal(faqItem.action.href, condoHref);
    const faqMarkup = render(FaqPage).match(/<details\b[^>]*id="faq-condominium-townhome"[^>]*>[\s\S]*?<\/details>/)?.[0];
    const renderedHref = faqMarkup?.match(/<a\b[^>]*href="([^"]+)"[^>]*>Compare condominium and townhome scope<\/a>/)?.[1];
    assert.ok(renderedHref, 'The rendered condominium FAQ must expose its named scope link');
    // Next Link normalizes the trailing slash in this standalone SSR harness.
    // Require the same local destination and exact fragment in the real anchor.
    const target = new URL(renderedHref, 'https://rivermarkinspections.com');
    assert.equal(target.origin, 'https://rivermarkinspections.com');
    assert.equal(target.pathname.replace(/\/$/, ''), '/services/other-residential-services');
    assert.equal(target.hash, '#other-services-condominium-heading');
    assert.equal(target.search, '');
  };
  check();
  withPublicFixture(check);
});

test('resource links reject executable, malformed, private, encoded and query-bearing destinations', () => {
  for (const destination of ['javascript:alert(1)', 'data:text/html,evil', '//evil.invalid/', 'https://user:password@example.invalid/', 'https://www.epa.gov/radon', '/pricing/?email=x', '/pricing/#report-token', '/%2f%2fevil.invalid/', '/pricing/../admin/', '/reports/customer.pdf', '/portal/', '/api/inquiries/', '/admin/', '/not-a-route/', '/pricing', '/pricing/\\evil', '/pricing/\n']) {
    assert.throws(() => resourceLinkHref(destination), Error, destination);
  }
  for (const text of ['<script>alert(1)</script>', '<a onclick="evil()">text</a>', '[x](javascript:alert(1))', '[x](/pricing/', '[ ](/pricing/)', '![image](/pricing/)']) {
    assert.throws(() => render(ResourceInline, { text }), Error, text);
  }
  const escaped = render(ResourceInline, { text: '[A "quoted" & ordinary label](/pricing/)' });
  assert.match(escaped, /&quot;quoted&quot; &amp;/);
});

test('explicit unreleased fixture destinations never become body anchors', () => {
  const savedConditional = { ...publication.siteRelease.conditional };
  try {
  publication.siteRelease.conditional = Object.fromEntries(Object.keys(savedConditional).map(route => [route, false]));
  for (const href of ['/sample-report/', '/services/radon-testing/', '/services/sewer-scope/', '/services/thermal-imaging/', '/privacy/']) {
    assert.equal(resourceLinkHref(href), undefined);
    assert.equal(render(ResourceInline, { text: `[Scope information](${href})` }), 'Scope information');
  }
  withPublicFixture(() => {
    publication.siteRelease.conditional.radonTesting = true;
    assert.equal(resourceLinkHref('/services/radon-testing/'), '/services/radon-testing/');
    assert.equal(resourceLinkHref('/sample-report/'), undefined);
  });
  } finally { publication.siteRelease.conditional = savedConditional; }
});

test('individual article dates reject invalid/future publication and suppress untrue update dates', () => {
  const now = new Date('2026-10-01T12:00:00Z');
  const dates = (publishedOn, updatedOn = null, stage = 'published') => publication.articleDates({ publishedOn, updatedOn }, stage, now);
  for (const date of [null, '', '2026-02-30', '2026-2-03', '2026-10-02', '2026-01-01T00:00:00Z']) assert.equal(dates(date), undefined);
  assert.equal(dates('2026-09-01', '2026-09-15', 'prelaunch'), undefined);
  assert.deepEqual(dates('2026-09-01', '2026-09-15'), { datePublished: '2026-09-01', dateModified: '2026-09-15' });
  for (const update of ['2026-08-31', '2026-09-01', '2026-02-30', '2026-10-02']) assert.deepEqual(dates('2026-09-01', update), { datePublished: '2026-09-01' });
});

test('resource bylines, honest dates and related entity IDs are present in server markup', () => {
  for (const resource of resources) {
    const html = render(ResourceArticle, { resource });
    assert.match(html, /By <a href="\/about\/#about-background-heading">Brandon Wilcox/);
    assert.doesNotMatch(html, /Prelaunch edition|not yet published|<time/);
    assert.doesNotMatch(html, /datePublished|dateModified/);
    const article = schemaNodes(html).find(node => node['@type'] === 'Article');
    assert.equal(article.author.url, 'https://rivermarkinspections.com/about/');
    assert.equal(article.author['@id'], 'https://rivermarkinspections.com/about/#brandon-wilcox');
    assert.equal(article.publisher['@id'], 'https://rivermarkinspections.com/#organization');
    assert.equal(article.url, search.canonicalFor(resource.route));
  }
  withPublicFixture(() => {
    resources[0].publishedOn = '2020-09-01'; resources[0].updatedOn = '2020-09-15';
    const html = render(ResourceArticle, { resource: resources[0] });
    assert.match(html, /Published <time dateTime="2020-09-01">/);
    assert.match(html, /Updated <time dateTime="2020-09-15">/);
    assert.deepEqual(schemaNodes(html).find(node => node['@type'] === 'Article').dateModified, '2020-09-15');
  });
});

test('existing schema types gain truthful relationships without unapproved claims', () => {
  const nodes = schemaNodes(render(PageStructuredData, { route: 'about' }));
  const organization = nodes.find(node => node['@type'] === 'Organization');
  const founder = nodes.find(node => node['@type'] === 'Person');
  assert.equal(organization.founder['@id'], founder['@id']);
  assert.equal(founder.worksFor['@id'], organization['@id']);
  assert.equal(organization.email, publication.publicContact.email);
  assert.equal(organization.telephone, '+16163085359');
  assert.equal(organization.logo, 'https://rivermarkinspections.com/brand/logo-horizontal.svg');
  assert.doesNotMatch(JSON.stringify(nodes), /"(?:address|review|aggregateRating|hasCredential|sameAs)"|HomeAndConstructionBusiness|"Offer"|"Product"/);
  const escaped = render(StructuredData, { data: { '@type': 'Article', headline: '</script><script>bad</script>' } });
  assert.equal(schemaNodes(escaped).length, 1);
  assert.doesNotMatch(escaped, /<script>bad/);
});

const organizationDescription = 'Independent residential home inspection services in Grand Rapids and West Michigan, with clear explanations, practical priorities and no repair sales.';
function assertHomeIdentity(html, home) {
  const nodes = schemaNodes(html);
  assert.equal(nodes.filter(node => node['@type'] === 'Organization').length, 1);
  const websites = nodes.filter(node => node['@type'] === 'WebSite');
  assert.equal(websites.length, home ? 1 : 0, 'Home must have exactly one WebSite when its approved canonical exists');
  if (home) assert.deepEqual(websites[0], {
    '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${home}#website`,
    url: home, name: 'Rivermark Home Inspections', publisher: { '@id': `${home}#organization` },
  });
  assert.doesNotMatch(JSON.stringify(nodes), /"(?:address|geo|review|aggregateRating|award|hasCredential|priceRange|offers|potentialAction)"|"(?:LocalBusiness|ProfessionalService|SearchAction|FAQPage|Product|Service)"/);
  return nodes;
}

test('F2 Home alone emits one canonical WebSite and Home/About share the supported Organization', () => {
  const { siteRoutes } = require('../src/config/routes.ts');
  const home = search.canonicalFor('home');
  const homeNodes = assertHomeIdentity(render(PageStructuredData, { route: 'home' }), home);
  const aboutNodes = schemaNodes(render(PageStructuredData, { route: 'about' }));
  assert.equal(aboutNodes.filter(node => node['@type'] === 'Organization').length, 1);
  assert.equal(aboutNodes.filter(node => node['@type'] === 'Person').length, 1);
  const organization = homeNodes.find(node => node['@type'] === 'Organization');
  assert.deepEqual(organization, aboutNodes.find(node => node['@type'] === 'Organization'));
  assert.equal(organization.description, organizationDescription);
  assert.deepEqual(organization.areaServed, ['Grand Rapids, Michigan', 'West Michigan']);
  const person = aboutNodes.find(node => node['@type'] === 'Person');
  assert.equal(organization.founder['@id'], person['@id']);
  assert.equal(person.worksFor['@id'], organization['@id']);
  for (const route of Object.keys(siteRoutes).filter(route => route !== 'home')) {
    const nodes = schemaNodes(render(PageStructuredData, { route }));
    assert.equal(nodes.filter(node => node['@type'] === 'WebSite').length, 0, route);
    const crumbs = nodes.find(node => node['@type'] === 'BreadcrumbList').itemListElement;
    assert.equal(crumbs[0].item, home);
    assert.equal(crumbs.at(-1).item, search.canonicalFor(route));
    assert.deepEqual(crumbs.map(item => item.position), crumbs.map((_, index) => index + 1));
    if (route === 'residentialHomeInspections') assert.equal(crumbs[1].item, search.canonicalFor('services'));
    if (route === 'homeInspectionCostResource') assert.equal(crumbs[1].item, search.canonicalFor('resources'));
  }
  for (const Component of [HomePage, AboutPage]) {
    const visible = render(Component);
    assert.match(visible, /Grand Rapids/);
    assert.match(visible, /West Michigan/);
    assert.match(visible, /[Ii]ndependent/);
    assert.match(visible, /[Nn]o repair sales|separate from repair sales/);
  }
});

test('F2 canonical fixtures derive IDs safely and preserve missing/invalid-origin and script-escaping protections', () => {
  const saved = publication.siteRelease.canonicalOrigin;
  try {
    publication.siteRelease.canonicalOrigin = 'https://fixture.example';
    assertHomeIdentity(render(PageStructuredData, { route: 'home' }), 'https://fixture.example/');
    publication.siteRelease.canonicalOrigin = null;
    for (const route of ['home', 'about', 'pricing']) {
      const html = render(PageStructuredData, { route });
      const nodes = schemaNodes(html);
      if (route === 'home') assertHomeIdentity(html, undefined);
      assert.ok(nodes.every(node => !['WebSite', 'BreadcrumbList'].includes(node['@type'])));
      assert.doesNotMatch(html, /"(?:@id|url|logo)":|undefined|localhost/);
    }
    for (const invalid of ['http://fixture.example', 'https://fixture.example/path', 'https://user:password@fixture.example', 'https://fixture.example/?q=x', 'not-an-origin']) {
      publication.siteRelease.canonicalOrigin = invalid;
      assert.throws(() => render(PageStructuredData, { route: 'home' }), Error, invalid);
    }
  } finally { publication.siteRelease.canonicalOrigin = saved; }
  const text = '</script><script>alert("fixture")</script>< & >';
  const html = render(StructuredData, { data: { '@type': 'Organization', description: text } });
  assert.equal(schemaNodes(html)[0].description, text);
  assert.equal([...html.matchAll(/<script\b/g)].length, 1);
  assert.doesNotMatch(html, /<script>alert/);
});

const quoteHelpSentence = 'If the quote doesn’t match the services you selected or our published pricing, contact Rivermark before completing your request.';
const quoteHelpParagraph = '<p>If the quote doesn’t match the services you selected or our published pricing, <a href="/contact/#manual-review">contact Rivermark</a> before completing your request.</p>';
function assertQuoteHelp(html, mode) {
  const expected = mode === 'disabled' ? 0 : 1;
  const text = html.replace(/<[^>]*>/g, '');
  assert.equal(text.split(quoteHelpSentence).length - 1, expected, 'Quote-help count must match the active transaction mode');
  assert.equal(html.split(quoteHelpParagraph).length - 1, expected, 'Quote-help must remain one normal paragraph with its inline property-help link');
  if (expected) {
    const section = html.match(/<section\b[^>]*aria-labelledby="price-availability-transaction-heading"[\s\S]*?<\/section>/)?.[0];
    assert.ok(section?.includes(quoteHelpParagraph), 'Quote-help belongs in the transaction section');
    const following = section.slice(section.indexOf(quoteHelpParagraph) + quoteHelpParagraph.length);
    assert.match(following, /^<a\b[^>]*href="https:\/\/widgets\.spectora\.com\/#\/fixture-review\/quote"[^>]*>Continue in Spectora<\/a>/);
  }
}
function renderQuoteMode(mode) {
  const transaction = require('../src/config/spectora-transaction.ts');
  const { PriceAvailabilityPage } = require('../src/components/PriceAvailabilityPage.tsx');
  const original = transaction.resolveSpectoraTransactionConfig;
  const url = 'https://widgets.spectora.com/#/fixture-review/quote';
  try {
    // Explicit inputs avoid reading environment variables or changing saved configuration.
    transaction.resolveSpectoraTransactionConfig = () => original({ mode, hostedUrl: url, embedUrl: url });
    return render(PriceAvailabilityPage);
  } finally { transaction.resolveSpectoraTransactionConfig = original; }
}

test('F1 actual embed/hosted/disabled modes render the approved copy, one linked help sentence and unchanged same-tab fallbacks', () => {
  const { priceAvailabilityContent } = require('../src/content/price-availability.ts');
  assert.equal(priceAvailabilityContent.metadata.title, 'See Price & Availability | Rivermark Home Inspections');
  assert.equal(priceAvailabilityContent.metadata.description, 'Enter property and service details to get a quote and see available times through Spectora. Unusual properties may need individual review.');
  const expectedHero = {
    embed: ['Enter your property and service details to get a quote and see available times through Spectora. Complete the required booking steps before treating an appointment as confirmed.'],
    hosted: ['Review a quote based on your property and service details and see available appointment times in Spectora.', 'Large, unusual, multi-unit, multi-building, or outer-area assignments may need individual review before an appointment can be confirmed.'],
    disabled: ['Online quoting and scheduling are not open yet. You can review the published pricing rules while Rivermark prepares for launch.', 'Appointments will become available after the booking process is ready. Unusual properties may require manual review.'],
  };
  for (const mode of ['embed', 'hosted', 'disabled']) {
    const html = renderQuoteMode(mode);
    assertQuoteHelp(html, mode);
    assert.match(html, new RegExp(`data-rm-transaction-state="${mode}"`));
    const hero = html.match(/<section\b[^>]*aria-labelledby="price-availability-heading"[\s\S]*?<\/section>/)?.[0];
    for (const paragraph of expectedHero[mode]) assert.ok(hero.includes(render('p', { children: paragraph })), `${mode}: ${paragraph}`);
    assert.match(hero, /<h1\b[^>]*>See Price &amp; Availability<\/h1>/);
    const externalActions = [...html.matchAll(/<a\b[^>]*href="https:\/\/widgets\.spectora\.com\/#\/fixture-review\/quote"[^>]*>Continue in Spectora<\/a>/g)];
    assert.equal(externalActions.length, mode === 'embed' ? 2 : mode === 'hosted' ? 1 : 0);
    for (const [anchor] of externalActions) assert.doesNotMatch(anchor, /target=|tabindex="-1"/);
    assert.equal([...html.matchAll(/<iframe\b/g)].length, mode === 'embed' ? 1 : 0);
    if (mode === 'disabled') assert.match(html, /No inspection or order is created here/);
  }
});

test('F1 quote-help uses the existing adaptive Contact entry without adding a form or repeating the notice elsewhere', () => {
  const { manualReviewHref, contactTopicFromFragment, propertyHelpTopic, inquiryGroupsFor } = require('../src/config/inquiries.ts');
  assert.equal(manualReviewHref, '/contact/#manual-review');
  assert.equal(contactTopicFromFragment(new URL(manualReviewHref, 'https://fixture.example').hash), propertyHelpTopic);
  assert.equal(propertyHelpTopic, 'Help with a property or quote');
  assert.ok(inquiryGroupsFor('contact', propertyHelpTopic).flatMap(group => group.fields).some(field => field.name === 'propertyAddress'));
  const contact = render(ContactPage);
  assert.equal([...contact.matchAll(/id="manual-review"/g)].length, 1);
  assert.equal([...contact.matchAll(/<form\b/g)].length, 1);
  for (const Component of [HomePage, PricingPage, ResidentialInspectionPage, BuyersPage, FaqPage, ContactPage, AboutPage, require('../src/components/AgentsPage.tsx').AgentsPage, require('../src/components/ServiceAreaPage.tsx').ServiceAreaPage]) {
    assert.ok(!render(Component).replace(/<[^>]*>/g, '').includes(quoteHelpSentence), Component.name);
  }
});

test('F1 existing embed timeout, failure and retry retain their client-state behavior without vendor requests', () => {
  const React = require('react');
  const { SpectoraEmbed } = require('../src/components/SpectoraEmbed.tsx');
  const savedHooks = { useState: React.useState, useRef: React.useRef, useEffect: React.useEffect };
  const savedWindow = global.window;
  let values = ['loading', 0];
  let cursor = 0;
  let expire;
  let effect;
  const listeners = new Map();
  const frame = { addEventListener: (name, handler) => listeners.set(name, handler), removeEventListener: name => listeners.delete(name) };
  const props = { src: 'https://widgets.spectora.com/#/fixture-review/quote', title: 'Fixture quote', loadingStatus: 'Loading fixture', failureStatus: 'Fixture failed' };
  const children = node => [node, ...[node?.props?.children].flat(Infinity).filter(child => child && typeof child === 'object').flatMap(children)];
  try {
    React.useState = () => {
      const index = cursor++;
      return [values[index], next => { values[index] = typeof next === 'function' ? next(values[index]) : next; }];
    };
    React.useRef = () => ({ current: frame });
    React.useEffect = callback => { effect = callback; };
    global.window = { setTimeout: (callback, delay) => { assert.equal(delay, 12000); expire = callback; return 1; }, clearTimeout: () => {} };
    const draw = () => { cursor = 0; return SpectoraEmbed(props); };
    let tree = draw();
    const cleanup = effect();
    const initialFrame = children(tree).find(node => node.type === 'iframe');
    assert.ok(initialFrame);
    initialFrame.props.onLoad();
    expire();
    assert.equal(values[0], 'loaded', 'A completed iframe must not fail on the old loading timeout');
    listeners.get('error')();
    tree = draw();
    assert.equal(tree.props['data-rm-spectora-embed-state'], 'failed');
    assert.equal(children(tree).filter(node => node.type === 'iframe').length, 0);
    const retry = children(tree).find(node => node.type === 'button');
    assert.equal(retry.props.children, 'Retry loading the quote');
    assert.equal(retry.props.type, 'button');
    retry.props.onClick();
    tree = draw();
    assert.equal(tree.props['data-rm-spectora-embed-state'], 'loading');
    assert.equal(values[1], 1);
    assert.notEqual(children(tree).find(node => node.type === 'iframe').key, initialFrame.key);
    expire();
    assert.equal(values[0], 'failed', 'A new load that times out must expose the retry state');
    cleanup();
    assert.equal(listeners.size, 0);
  } finally {
    Object.assign(React, savedHooks);
    if (savedWindow === undefined) delete global.window; else global.window = savedWindow;
  }
});

test('F1 changed headings and future branches render while dormant Home wording remains unused', () => {
  const { homepageContent } = require('../src/content/home.ts');
  const { AgentsPage } = require('../src/components/AgentsPage.tsx');
  const { ServiceAreaPage } = require('../src/components/ServiceAreaPage.tsx');
  const { geographyReadiness, geographyReadinessStates } = require('../src/config/geography-readiness.ts');
  const savedWorkflow = workflowReadiness.buyerTransaction.state;
  const savedGeography = geographyReadiness.serviceArea.state;
  const dormant = 'The online process shows a quote based on the details entered and available appointment options. Unusual properties may require individual review.';
  assert.ok(JSON.stringify(homepageContent).includes(dormant));
  const fixedHeadings = [
    [HomePage, 'h2', 'Get a quote and see available times.'],
    [ResidentialInspectionPage, 'h3', 'Get a Property-Specific Quote and See Available Times'],
    [PricingPage, 'h2', 'Review a property-specific quote and appointment options.'],
    [FaqPage, 'h2', 'Still deciding? Start with a property-specific quote.'],
  ];
  try {
    for (const ready of [false, true]) {
      workflowReadiness.buyerTransaction.state = ready ? workflowReadinessStates.ready : workflowReadinessStates.pendingValidation;
      geographyReadiness.serviceArea.state = ready ? geographyReadinessStates.ready : geographyReadinessStates.pendingValidation;
      for (const [Component, level, title] of fixedHeadings) {
        const headings = [...render(Component).matchAll(new RegExp(`<${level}\\b[^>]*>(.*?)<\\/${level}>`, 'gs'))].map(match => match[1]);
        assert.ok(headings.includes(title), `${Component.name}: ${title}`);
      }
      const home = render(HomePage);
      assert.ok(!home.includes(dormant));
      const buyers = render(BuyersPage);
      assert.ok(buyers.includes(ready ? 'Start with a quote and the appointments currently available.' : 'Review a property-specific quote and available times.'));
      if (ready) {
        const agents = render(AgentsPage);
        assert.ok(agents.includes('review the quote, choose an available appointment'));
        assert.ok(agents.includes('For a standard assignment, ask the client to enter the property details in Price &amp; Availability and review the quote and available times.'));
        assert.ok(render(ServiceAreaPage).includes('review a property-specific quote'));
        assert.ok(buyers.includes(render('p', { children: "Enter the property and service information to review a quote and Rivermark's released schedule." })));
        const priceFaq = home.match(/<details\b[^>]*id="[^"]*inspection-price[^"]*"[\s\S]*?<\/details>/)?.[0];
        assert.ok(priceFaq, 'Home must retain its actual inspection-price FAQ');
        assert.ok(priceFaq.includes('Larger homes, condominiums, and additional units or structures use the published adjustments. Enter the property details to review the quote.'), 'The future Home price FAQ must use its approved sentence independently of other Home copy');
      }
    }
  } finally {
    workflowReadiness.buyerTransaction.state = savedWorkflow;
    geographyReadiness.serviceArea.state = savedGeography;
  }
  assert.ok(render(ResourceArticle, { resource: resources[0] }).includes('The official order and accepted agreement establish your price and scope.'));
});

test('F1/F2 focused guards reject scratch duplicate notice and malformed/duplicated schema without modifying source', () => {
  assert.throws(() => assertQuoteHelp(renderQuoteMode('embed') + quoteHelpParagraph, 'embed'), /Quote-help count/);
  assert.throws(() => schemaNodes('<script type="application/ld+json">{"@type":"WebSite",}</script>'), SyntaxError);
  const home = render(PageStructuredData, { route: 'home' });
  const website = home.match(/<script type="application\/ld\+json">[^<]*"@type":"WebSite"[^<]*<\/script>/)[0];
  assert.throws(() => assertHomeIdentity(home + website, search.canonicalFor('home')), /exactly one WebSite/);
});

test('founder wording approval controls note, fallback and pending label in both publication stages', () => {
  const note = aboutContent.background.founderNote;
  assert.equal(note.ownerWordingApproved, true);
  const savedApproval = note.ownerWordingApproved;
  const noteMarkup = render('p', { children: note.paragraphs.join(' ') });
  const check = () => {
    for (const approved of [false, true]) {
      note.ownerWordingApproved = approved;
      const markup = render(AboutPage);
      const noteExpected = approved || publication.siteRelease.stage === 'prelaunch';
      assert.equal(markup.includes(render('h3', { children: note.title })), noteExpected);
      assert.equal(markup.includes(noteMarkup), noteExpected, `${publication.siteRelease.stage}: approval=${approved}`);
      assert.equal(markup.includes(render('p', { children: note.signature })), noteExpected);
      assert.equal(markup.includes(note.reviewLabel), !approved && publication.siteRelease.stage === 'prelaunch');
      for (const paragraph of aboutContent.background.paragraphs) assert.equal(markup.includes(render('p', { children: paragraph })), !noteExpected);
    }
  };
  try { check(); withPublicFixture(check); }
  finally { note.ownerWordingApproved = savedApproval; }
});

test('real cost-guide rendering follows promotion ON/OFF while its 3300-square-foot example stays on the approved grid', () => {
  assert.equal(2400 + 900, 3300);
  assert.equal(houseAreaExamplePrice(false), '$490');
  assert.equal(houseAreaExamplePrice(true), '$440');
  const saved = { ...publication.promotion };
  const check = () => {
    for (const enabled of [false, true]) {
      Object.assign(publication.promotion, { enabled, startsOn: '2020-01-01', endsOn: '2099-12-31' });
      const html = render(ResourceArticle, { resource: resources[0] });
      assert.match(html, /2,400 sq\. ft\. above grade \+ 900 sq\. ft\. of basement = 3,300/);
      assert.match(html, /before other applicable adjustments\. This is an illustration, not a quote/);
      if (enabled) {
        assert.match(html, /current introductory house grid, the base price is \$440/);
        assert.match(html, /approved introductory residential starting price is \$400/);
        assert.doesNotMatch(html, /current standard house grid, the base price is \$490/);
      } else {
        assert.match(html, /current standard house grid, the base price is \$490/);
        assert.match(html, /Standard pricing applies\./);
        assert.doesNotMatch(html, /\$440|\$400|introductory|2020-01-01|2099-12-31/i);
      }
    }
  };
  try { check(); withPublicFixture(check); }
  finally { Object.assign(publication.promotion, saved); }
});

test('duration answers and actual pages follow buyer-workflow acceptance even in a published fixture', () => {
  const pendingEstimate = 'Confirm a property-specific time estimate with Rivermark. It is not a guaranteed departure time.';
  const expected = {
    default: [
      "Timing depends on the property's size, configuration, condition, number of units, additional structures, access, and ordered services.",
      'The confirmation provides a property-specific estimate. It is not a guaranteed departure time.',
    ],
    home: [
      "Appointment time depends on the property's size, configuration, number of units, additional buildings, access, and ordered services.",
      'Your confirmation will include a property-specific estimate. That estimate is not a guaranteed departure time because significant conditions, access problems, weather, or inaccurate property information may change the schedule.',
    ],
    residential: [
      "Timing depends on the home's size, configuration, number of units, additional structures, access, condition, and ordered services.",
      'Your confirmation will include a property-specific estimate. It is not a guaranteed departure time because the inspection may take longer when the conditions or access warrant it.',
    ],
    buyers: [
      "The time depends on the property's size, configuration, condition, access, number of units, additional buildings, and ordered services.",
      'Your confirmation will provide a property-specific estimate. It is not a guaranteed departure time.',
    ],
  };
  const pages = [[HomePage, 'home'], [ResidentialInspectionPage, 'residential'], [BuyersPage, 'buyers'], [FaqPage, 'default']];
  const workflow = workflowReadiness.buyerTransaction;
  const saved = workflow.state;
  const check = () => {
    for (const ready of [false, true]) {
      workflow.state = ready ? workflowReadinessStates.ready : workflowReadinessStates.pendingValidation;
      for (const context of Object.keys(contextualFaqIds)) {
        const item = resolveContextualFaqs(context, ['inspection-duration'])[0];
        const [first, confirmation] = expected[context] ?? expected.default;
        assert.deepEqual(item.answer, [first, ready ? confirmation : pendingEstimate], `${publication.siteRelease.stage}: ${context}, ready=${ready}`);
      }
      const master = resolveMasterFaqCategories().flatMap(category => category.items).find(item => item.id === 'faq-inspection-duration');
      assert.deepEqual(master.answer, [expected.default[0], ready ? expected.default[1] : pendingEstimate]);
      for (const [Component, context] of pages) {
        const html = render(Component);
        const detail = html.match(/<details\b[^>]*id="faq-inspection-duration"[^>]*>[\s\S]*?<\/details>/)?.[0];
        assert.ok(detail, `${Component.name} must render its duration answer`);
        assert.ok(detail.includes(render('p', { children: expected[context][0] })));
        assert.ok(detail.includes(render('p', { children: ready ? expected[context][1] : pendingEstimate })));
        if (ready) assert.ok(!detail.includes(pendingEstimate));
        else assert.doesNotMatch(detail, /confirmation (?:will|provides)/i);
      }
    }
  };
  try { check(); withPublicFixture(check); }
  finally { workflow.state = saved; }
});

// Interpret generated groups independently: most-specific matching user-agent,
// then longest matching path, Allow wins a tie. '$' means an exact path endpoint.
function mayCrawl(config, agent, pathname) {
  const groups = Array.isArray(config.rules) ? config.rules : [config.rules];
  const matched = groups.map(group => ({ group, specificity: Math.max(-1, ...[group.userAgent].flat().filter(Boolean).map(token => token === '*' ? 0 : agent.toLowerCase().includes(token.toLowerCase()) ? token.length : -1)) }));
  const max = Math.max(...matched.map(x => x.specificity));
  const paths = matched.filter(x => x.specificity === max).flatMap(({ group }) => ['allow', 'disallow'].flatMap(kind => [group[kind]].flat().filter(Boolean).map(rule => ({ kind, rule }))));
  const applicable = paths.filter(({ rule }) => rule.endsWith('$') ? pathname === rule.slice(0, -1) : pathname.startsWith(rule));
  applicable.sort((a, b) => b.rule.length - a.rule.length || (a.kind === 'allow' ? -1 : 1));
  return !applicable.length || applicable[0].kind === 'allow';
}

test('real prelaunch rules deny all bots with no named-agent bypass and no sitemap', () => {
  const generated = robots();
  assert.deepEqual(generated, { rules: { userAgent: '*', disallow: '/' } });
  for (const bot of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'GPTBot']) for (const path of ['/', '/pricing/', '/price-availability/', '/services/radon-testing/', '/api/inquiries/']) assert.equal(mayCrawl(generated, bot, path), false);
  assert.deepEqual(sitemap(), []);
});

test('future fixture keeps search/training separate and private/gated exclusions effective', () => withPublicFixture(() => {
  let generated = robots();
  for (const bot of ['Googlebot', 'Bingbot', 'OAI-SearchBot']) {
    for (const path of ['/', '/pricing/', '/price-availability/']) assert.equal(mayCrawl(generated, bot, path), true, `${bot} ${path}`);
    for (const path of ['/api/inquiries/', '/admin/private/', '/portal/client/', '/customer/private/', '/reports/customer.pdf', '/services/radon-testing/', '/services/sewer-scope/', '/services/thermal-imaging/', '/sample-report/']) assert.equal(mayCrawl(generated, bot, path), false, `${bot} ${path}`);
  }
  for (const path of ['/', '/pricing/', '/price-availability/', '/reports/customer.pdf']) assert.equal(mayCrawl(generated, 'GPTBot', path), false);
  assert.deepEqual(search.pageMetadata('priceAvailability', { title: 'Fixture', description: 'Fixture' }).robots, { index: false, follow: true });
  assert.equal(sitemap().some(entry => entry.url.includes('/price-availability/')), false);
  publication.siteRelease.conditional.radonTesting = true;
  generated = robots();
  assert.equal(mayCrawl(generated, 'OAI-SearchBot', '/services/radon-testing/'), true);
  assert.equal(mayCrawl(generated, 'GPTBot', '/services/radon-testing/'), false);
}));

test('installed Next robots serialization preserves effective agent groups and route exclusions', () => {
  const parseText = text => ({ rules: text.trim().split(/\n\s*\n/).flatMap(block => {
    const group = { userAgent: [], allow: [], disallow: [] };
    for (const line of block.split('\n')) {
      const match = /^(User-Agent|Allow|Disallow):\s*(.*)$/i.exec(line);
      if (!match) continue;
      const key = { 'user-agent': 'userAgent', allow: 'allow', disallow: 'disallow' }[match[1].toLowerCase()];
      group[key].push(match[2]);
    }
    return group.userAgent.length ? [group] : [];
  }) });
  assert.equal(resolveRouteData(robots(), 'robots'), 'User-Agent: *\nDisallow: /\n\n');
  withPublicFixture(() => {
    const text = resolveRouteData(robots(), 'robots');
    const parsed = parseText(text);
    assert.deepEqual(parsed.rules.map(group => group.userAgent), [['*', 'OAI-SearchBot'], ['GPTBot']]);
    assert.match(text, /Sitemap: https:\/\/rivermarkinspections\.com\/sitemap\.xml/);
    for (const bot of ['Googlebot', 'Bingbot', 'OAI-SearchBot']) {
      for (const pathname of ['/', '/pricing/', '/price-availability/']) assert.equal(mayCrawl(parsed, bot, pathname), true, `${bot} ${pathname}`);
      for (const pathname of ['/api/inquiries/', '/portal/client/', '/reports/customer.pdf', '/sample-report/', '/services/radon-testing/']) assert.equal(mayCrawl(parsed, bot, pathname), false, `${bot} ${pathname}`);
    }
    for (const pathname of ['/', '/pricing/', '/price-availability/']) assert.equal(mayCrawl(parsed, 'GPTBot', pathname), false);
    publication.siteRelease.conditional.radonTesting = true;
    const released = parseText(resolveRouteData(robots(), 'robots'));
    assert.equal(mayCrawl(released, 'OAI-SearchBot', '/services/radon-testing/'), true);
    assert.equal(mayCrawl(released, 'GPTBot', '/services/radon-testing/'), false);
  });
});

test('only an explicitly released public sample PDF can override the report-path exclusion', () => withPublicFixture(() => {
  publication.siteRelease.conditional.sampleReport = true;
  publication.siteRelease.sampleReport = { approved: true, interactiveUrl: null, pdfUrl: '/reports/approved-sample.pdf' };
  const generated = robots();
  assert.equal(mayCrawl(generated, 'OAI-SearchBot', '/reports/approved-sample.pdf'), true);
  assert.equal(mayCrawl(generated, 'OAI-SearchBot', '/reports/approved-sample.pdf?token=private'), false);
  assert.equal(mayCrawl(generated, 'OAI-SearchBot', '/reports/customer.pdf'), false);
  assert.equal(mayCrawl(generated, 'GPTBot', '/reports/approved-sample.pdf'), false);
}));

test('dated article indexing is individual and the resource hub waits for all three dates', () => withPublicFixture(() => {
  resources[0].publishedOn = '2020-09-01';
  assert.equal(search.routeCanBeIndexed(resources[0].route), true);
  assert.equal(search.routeCanBeIndexed(resources[1].route), false);
  assert.equal(search.routeCanBeIndexed('resources'), false);
  for (const resource of resources) resource.publishedOn = '2020-09-01';
  assert.equal(search.routeCanBeIndexed('resources'), true);
  assert.equal(sitemap().filter(entry => entry.url.includes('/resources/')).length, 4);
}));

test('article previews share genuine author/dates while ordinary pages keep website type', () => {
  let metadata = search.pageMetadata(resources[0].route, resources[0].metadata);
  assert.equal(metadata.openGraph.type, 'article');
  assert.deepEqual(metadata.openGraph.authors, ['https://rivermarkinspections.com/about/']);
  assert.equal(metadata.openGraph.publishedTime, undefined);
  assert.equal(metadata.openGraph.modifiedTime, undefined);
  assert.equal(search.pageMetadata('pricing', { title: 'Pricing', description: 'Pricing' }).openGraph.type, 'website');
  withPublicFixture(() => {
    resources[0].publishedOn = '2020-09-01'; resources[0].updatedOn = '2020-09-15';
    metadata = search.pageMetadata(resources[0].route, resources[0].metadata);
    assert.equal(metadata.openGraph.publishedTime, '2020-09-01');
    assert.equal(metadata.openGraph.modifiedTime, '2020-09-15');
  });
});

test('fixtures restore the actual prelaunch publication values and date blanks', () => {
  assert.equal(publication.siteRelease.stage, 'prelaunch');
  assert.equal(publication.siteRelease.legalApproved, false);
  assert.ok(Object.values(publication.siteRelease.conditional).every(value => value === true));
  assert.equal(publication.siteRelease.sampleReport.approved, true);
  assert.ok(resources.every(resource => resource.publishedOn === null && resource.updatedOn === null));
  assert.equal(publication.promotion.enabled, false);
  assert.equal(publication.promotion.startsOn, null);
  assert.equal(publication.promotion.endsOn, null);
  assert.equal(aboutContent.background.founderNote.ownerWordingApproved, true);
  assert.equal(workflowReadiness.buyerTransaction.state, workflowReadinessStates.pendingValidation);
  assert.deepEqual(sitemap(), []);
});


test('A123 recommendation table links each situation to its specific rendered service destination', () => {
  const { ServicesOverviewPage } = require('../src/components/ServicesOverviewPage.tsx');
  const { servicesOverviewContent } = require('../src/content/services-overview.ts');
  const html = render(ServicesOverviewPage);
  const destinations = new Set();
  for (const row of servicesOverviewContent.situations.table.rows) {
    const value = row.values[0];
    assert.equal(typeof value, 'object');
    assert.equal(resourceLinkHref(value.destination), value.destination);
    assert.ok([value.destination, value.destination.replace(/\/(?=#|$)/, "")].some(href => html.includes(`href="${href}"`)), value.label);
    destinations.add(value.destination);
    const [route, fragment] = value.destination.split('#');
    if (fragment) {
      assert.equal(route, '/services/other-residential-services/');
      assert.ok(render(OtherResidentialServicesPage).includes(`id="${fragment}"`));
    }
  }
  assert.equal(destinations.size, 9);
  assert.throws(() => resourceLinkHref('/services/other-residential-services/#unapproved-anchor'));
});

test('A123 public phone and Home navigation use centralized approved values and existing schema', () => {
  const { SiteHeader } = require('../src/components/SiteHeader.tsx');
  const { SiteFooter } = require('../src/components/SiteFooter.tsx');
  const { primaryNavigationItems } = require('../src/config/site.ts');
  for (const Component of [SiteHeader, SiteFooter, ContactPage]) {
    const html = render(Component);
    assert.match(html, /href="tel:\+16163085359"[^>]*>Call 616-308-5359/);
    assert.doesNotMatch(html, /href="sms:/);
  }
  assert.equal(primaryNavigationItems.some(item => item.route === 'home'), false);
  assert.match(render(SiteHeader), /href="\/"[^>]*>Home<\/a>/);
  assert.match(render(SiteFooter), /href="\/"[^>]*><span>Home<\/span>/);
});

test('A123 Home hero secondary explains inclusion while primary booking, founder and buyer boundaries remain', () => {
  const { homepageContent } = require('../src/content/home.ts');
  const html = render(HomePage);
  assert.match(html, /href="\/services\/residential-home-inspections\/?"[^>]*>What Your Inspection Includes/);
  assert.match(html, /See Price &amp; Availability/);
  assert.match(html, /An inspection should leave you with priorities—not a pile of disconnected comments/);
  assert.match(html, /Clear scope. Independent judgment. No repair sales/);
  assert.match(html, /Understand the home—not just the inspection report/);
  assert.match(render(ResidentialInspectionPage), /home-specific systems and maintenance packet/);
  assert.match(render(BuyersPage), /remote explanation/);
  assert.equal(aboutContent.background.founderNote.ownerWordingApproved, true);
  assert.ok(homepageContent);
});


test('A123 detailed review keeps contextual service links and one natural Contact action', () => {
  const { ServicesOverviewPage } = require('../src/components/ServicesOverviewPage.tsx');
  const { ConditionalServicePage } = require('../src/components/ConditionalServicePage.tsx');
  const { conditionalPages } = require('../src/content/conditional-pages.ts');
  const html = render(ServicesOverviewPage);
  const core = html.split('aria-labelledby="services-core-heading"')[1].split('</section>')[0];
  assert.doesNotMatch(core, /See Price &amp; Availability/);
  assert.match(core, /See What the Inspection Covers/);
  assert.match(core, /View Complete Pricing/);
  assert.match(core, /\$450/);
  assert.match(html, /See Price &amp; Availability/);
  for (const content of [conditionalPages.radonTesting, conditionalPages.sewerScope, conditionalPages.thermalImaging]) {
    const rendered = render(ConditionalServicePage, { content });
    assert.match(rendered, /href="\/contact\/?#manual-review"[^>]*>Get Help With This Property/);
    assert.doesNotMatch(rendered, /Request Manual Review/);
  }
  assert.doesNotMatch(render(FaqPage), /Request Manual Review/);
  const contact = render(ContactPage);
  assert.equal([...contact.matchAll(/href="\/price-availability\/?"[^>]*>See Price &amp; Availability/g)].length, 1);
  assert.equal([...contact.matchAll(/<form\b/g)].length, 1);
});

// SVGs are rendered by the installed React server renderer. CSS responsive
// visibility, label sizes and keyboard/zoom behavior are checked in headed QA.
function mapSvgs(html) {
  return [...html.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map(match => match[0]);
}
function assertSafeMapSvg(svg) {
  const permittedTags = new Set(['svg', 'title', 'desc', 'defs', 'g', 'path', 'circle', 'line', 'rect', 'pattern', 'clipPath', 'text', 'tspan']);
  for (const [, tag] of svg.matchAll(/<([A-Za-z][\w:-]*)\b/g)) assert.ok(permittedTags.has(tag), `Unexpected SVG element: ${tag}`);
  assert.ok(!/\son[a-z]+\s*=|\b(?:href|xlink:href)="(?!#)|@import|@font-face/i.test(svg), 'Map must not contain events or remote/executable resources');
  assert.ok(!/\btabindex="(?!-1")/i.test(svg), 'Informational map points must not become keyboard targets');
  const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'IDs must be unique within each artwork');
  const references = [];
  for (const [, value] of svg.matchAll(/url\(([^)]+)\)/g)) {
    assert.ok(/^#[A-Za-z0-9_-]+$/.test(value), `SVG paint/clip reference must be local: ${value}`);
    references.push(value.slice(1));
  }
  for (const [, tokens] of svg.matchAll(/\baria-(?:labelledby|describedby)="([^"]+)"/g)) references.push(...tokens.split(/\s+/));
  for (const [, target] of svg.matchAll(/\b(?:href|xlink:href)="#([^"]+)"/g)) references.push(target);
  for (const ref of references) assert.ok(ids.includes(ref), `SVG reference must resolve locally: ${ref}`);
  assert.ok(/\brole="img"/.test(svg), 'Each responsive artwork must expose an image role when displayed');
  assert.equal([...svg.matchAll(/<title\b/g)].length, 1, 'Each artwork needs one accessible title');
  assert.equal([...svg.matchAll(/<desc\b/g)].length, 1, 'Each artwork needs one accessible description');
  require('./helpers/map-guards.cjs').assertSvgSemantics(svg);
}

test('A124 map variants render supplied aspect ratios with safe SVG and local accessible references', () => {
  const { ServiceAreaMap } = require('../src/components/ServiceAreaMap.tsx');
  const expected = { hero: ['0 0 560 459', '0 0 350 295'], full: ['0 0 1000 997', '0 0 390 422'] };
  for (const variant of ['hero', 'full']) {
    const html = render(ServiceAreaMap, { variant, idPrefix: `test-${variant}` });
    const svgs = mapSvgs(html);
    assert.equal(svgs.length, 2, `${variant} must include wide and compact artwork for CSS selection`);
    assert.deepEqual(svgs.map(svg => svg.match(/\bviewBox="([^"]+)"/)?.[1]).sort(), expected[variant].sort());
    for (const svg of svgs) {
      assertSafeMapSvg(svg);
      for (const place of ['Grand Rapids', 'Holland', 'Grand Haven', 'Spring Lake']) assert.ok(svg.includes(place), `${variant} must retain ${place}`);
    }
    assert.ok(!/\$\s*\d|Design preview|NOT APPROVED|carried_forward_draft|owner_change|research-notes-PRIVATE/i.test(html), 'Map presentation must omit fees and internal planning notes');
  }
});

test('A124 prefixed SVG IDs and references remain unique across repeated-prefix map instances', () => {
  const { ServiceAreaMap } = require('../src/components/ServiceAreaMap.tsx');
  const html = render('div', { children: [
    createElement(ServiceAreaMap, { key: 'first', variant: 'hero', idPrefix: 'test-first-hero' }),
    createElement(ServiceAreaMap, { key: 'second', variant: 'hero', idPrefix: 'test-first-hero' }),
    createElement(ServiceAreaMap, { key: 'full', variant: 'full', idPrefix: 'test-full-area' }),
  ] });
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.ok(ids.length > 6, 'All responsive maps must have accessible and geometry IDs');
  assert.equal(new Set(ids).size, ids.length, 'Map instances must not duplicate SVG IDs');
  for (const id of ids) assert.ok(['test-first-hero', 'test-full-area'].some(prefix => id.startsWith(prefix)), `ID must use its map-instance prefix: ${id}`);
  for (const svg of mapSvgs(html)) assertSafeMapSvg(svg);
});

test('A124 actual Home hero retains buyer copy and two actions alongside its compact-map caption and link', () => {
  const home = render(HomePage);
  const hero = home.match(/<section\b[^>]*aria-labelledby="homepage-heading"[\s\S]*?<\/section>/)?.[0];
  assert.ok(hero, 'Actual Home hero must render');
  assert.ok(hero.includes('Home Inspections for Grand Rapids &amp; West Michigan'));
  assert.ok(hero.includes('Rivermark combines practical residential experience with calm, direct explanations'));
  assert.equal(mapSvgs(hero).length, 2, 'Compact map belongs inside the actual hero');
  const htmlText = hero.replace(/<svg\b[\s\S]*?<\/svg>/g, '');
  assert.ok(htmlText.includes('Travel included in Grand Rapids, Holland, Grand Haven and Spring Lake.'));
  assert.ok(/href="\/service-area\/?"[^>]*>View service area<\/a>/.test(htmlText));
  assert.ok(/href="\/price-availability\/?"[^>]*>See Price &amp; Availability<\/a>/.test(htmlText));
  assert.ok(/href="\/services\/residential-home-inspections\/?"[^>]*>What Your Inspection Includes<\/a>/.test(htmlText));
  assert.ok(!htmlText.includes('View Pricing'), 'Superseded hero action must not return');
  assert.ok(hero.indexOf('What Your Inspection Includes') < hero.indexOf('<svg'), 'Map follows the intact hero copy and actions in DOM order');
  assert.ok(home.includes('Understand the home—not just the inspection report.'));
  assert.ok(home.includes('home-specific systems and maintenance packet'));
});

test('A127 actual Service Area preserves the fuller map and property help while rendering selected travel policy', () => {
  const { ServiceAreaPage } = require('../src/components/ServiceAreaPage.tsx');
  const html = render(ServiceAreaPage);
  const svgs = mapSvgs(html);
  assert.deepEqual(svgs.map(svg => svg.match(/\bviewBox="([^"]+)"/)?.[1]).sort(), ['0 0 1000 997', '0 0 390 422'].sort());
  const htmlText = html.replace(/<svg\b[\s\S]*?<\/svg>/g, '');
  for (const place of ['Grand Rapids', 'Holland', 'Grand Haven', 'Spring Lake']) assert.ok(htmlText.includes(place), `HTML coverage explanation must name ${place}`);
  for (const text of ['Approximate coverage; the property address determines travel.', 'Included', 'Normal travel included.', 'Extended', '$75 for one visit; $125 total for a normal two-visit service.', 'By arrangement', 'Travel quoted before booking.', 'Availability depends on the property and the schedule.']) assert.ok(htmlText.includes(text), `Missing readable service-area text: ${text}`);
  assert.ok(/href="\/contact\/?#manual-review"/.test(htmlText), 'Existing property-help entry must remain');
  assert.ok(/href="tel:\+16163085359"/.test(htmlText), 'Approved phone must remain visible on Service Area');
  assert.ok(!/research-notes-PRIVATE|owner_change|carried_forward_draft|49409/.test(htmlText), 'No private research/provenance or operational ZIP table belongs in customer copy');
  assert.ok(htmlText.includes('West Olive, Macatawa and Ferrysburg are Extended.'));
  assert.ok(htmlText.includes('Spring Lake properties outside Ferrysburg remain Included.'));
  assert.ok(htmlText.includes('A displayed scheduling quote may not include the correct travel treatment for the property.'));
  assert.ok(htmlText.includes('not $75 plus $125'));
  assert.ok(!htmlText.includes('no universal Extended-zone amount is published'));
  assert.ok(htmlText.includes('Questions about location and travel.'), 'Useful existing service-area FAQs must remain');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'Integrated page must not create duplicate anchor or SVG IDs');
});

test('A127 map display publishes selected fee copy while keeping operational ZIP rules and research separate', () => {
  const { serviceAreaMapDisplay } = require('../src/config/service-area-map.ts');
  const { geographyReadiness, geographyReadinessStates, approvedServiceArea } = require('../src/config/geography-readiness.ts');
  assert.deepEqual(Object.keys(serviceAreaMapDisplay).sort(), ['accessibility', 'availability', 'fullCaption', 'heroCaption', 'heroLink', 'zones']);
  assert.equal(serviceAreaMapDisplay.heroCaption, 'Travel included in Grand Rapids, Holland, Grand Haven and Spring Lake.');
  assert.equal(serviceAreaMapDisplay.fullCaption, 'Approximate coverage; the property address determines travel.');
  assert.deepEqual(serviceAreaMapDisplay.heroLink, { label: 'View service area', href: '/service-area/' });
  assert.deepEqual(serviceAreaMapDisplay.zones.map(zone => zone.name), ['Included', 'Extended', 'By arrangement']);
  for (const zone of serviceAreaMapDisplay.zones) {
    assert.deepEqual(Object.keys(zone).sort(), ['communities', 'description', 'id', 'name']);
    assert.ok(zone.communities.length > 0);
    assert.ok(zone.communities.every(place => typeof place === 'string' && !/\d/.test(place)), 'Community examples must not become a ZIP-rule table');
  }
  for (const place of ['Grand Rapids', 'Holland', 'Grand Haven', 'Spring Lake']) assert.ok(serviceAreaMapDisplay.zones[0].communities.includes(place));
  assert.equal(serviceAreaMapDisplay.zones[1].description, '$75 for one visit; $125 total for a normal two-visit service.');
  assert.deepEqual(serviceAreaMapDisplay.zones[1].communities, ['West Olive', 'Macatawa', 'Ferrysburg', 'Muskegon', 'Allegan', 'Ionia']);
  assert.ok(!/research-notes-PRIVATE|reference_only|one_way|road_miles|operating_origin|carried_forward_draft|owner_change|Downloads/.test(JSON.stringify(serviceAreaMapDisplay)), 'Runtime display data must omit private research and assignment provenance');
  assert.equal(geographyReadiness.serviceArea.state, geographyReadinessStates.pendingValidation, 'Selected policy and illustration do not establish native transaction commissioning');
  assert.deepEqual(approvedServiceArea.primaryCommunities, [], 'Existing readiness configuration is not repurposed as a quoting rule');
  assert.deepEqual(approvedServiceArea.extendedCommunities, []);
  assert.equal(approvedServiceArea.mapUrl, null);
  assert.equal(approvedServiceArea.travelExplanation, null);
  assert.equal(workflowReadiness.buyerTransaction.state, workflowReadinessStates.pendingValidation);
});
