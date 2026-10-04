/* eslint-disable @typescript-eslint/no-require-imports -- Existing local TypeScript test convention; no network/native-account access. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { createHash } = require('node:crypto');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const originalLoad = Module._load;
Module._load = function (id, ...args) {
  if (id === 'server-only') return {};
  if (id === 'next/navigation') return { ...originalLoad.call(this, id, ...args), usePathname: () => '/pricing/' };
  if (id.startsWith('@/')) id = path.join(root, 'src', id.slice(2));
  return originalLoad.call(this, id, ...args);
};
require.extensions['.css'] = module => { module.exports = {}; };
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText, filename);
const defaults = require('../src/config/travel-zip-defaults.json');
const { travelPolicy, normalizePropertyZip, classifyTravelProperty, normalTravelTotal } = require('../src/config/travel-policy.ts');
const { pricingContent } = require('../src/content/pricing.ts');
const { promotion, promotionIsActive } = require('../src/config/publication.ts');
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const property = (postalZip, extra = {}) => ({ addressUse: 'inspection-property', postalZip, ...extra });
const evidence = (relationToFerrysburg, kind = 'documented-property-review', reference = 'fixture:verified-physical-property') => ({ relationToFerrysburg, evidence: { kind, reference } });
const assignment = (classification, plannedDedicatedVisits, extra = {}) => ({ classification, plannedDedicatedVisits, propertyCount: 1, unusualTravel: false, ...extra });
const classified = zone => ({ status: 'classified', zone, zip: 'fixture', basis: 'zip-default' });
const assertReview = result => {
  assert.equal(result.status, 'review');
  assert.equal(Object.hasOwn(result, 'zone'), false, 'Review must not silently classify travel');
  assert.equal(Object.hasOwn(result, 'amount'), false, 'Review must not silently quote zero or promise acceptance');
};

// Independent expectations: verified supplied assignment CSV SHA-256
// f7cbb89d732542bd7a302d794ae60599c37b6d57eeeeca40a0fcd7accdb831c7:
// all 394 existing categories plus ONLY owner-selected 49409 -> extended.
// Do not regenerate this expected digest from changed runtime policy data.
test('A127 selected defaults retain every original category and add only Ferrysburg 49409 Extended', () => {
  const raw = fs.readFileSync(path.join(root, 'src/config/travel-zip-defaults.json'), 'utf8');
  const rawKeys = [...raw.matchAll(/"([0-9]{5})"\s*:/g)].map(match => match[1]);
  assert.equal(rawKeys.length, 395);
  assert.equal(new Set(rawKeys).size, 395, 'Duplicate JSON ZIP keys must not be hidden by parsing');
  assert.equal(Object.keys(defaults).length, 395);
  assert.ok(Object.keys(defaults).every(zip => /^[0-9]{5}$/.test(zip)));
  assert.deepEqual(Object.values(defaults).reduce((counts, zone) => ({ ...counts, [zone]: (counts[zone] || 0) + 1 }), {}), { by_arrangement: 282, included: 54, extended: 59 });
  assert.equal(digest(Object.entries(defaults).sort(([a], [b]) => a.localeCompare(b))), 'ca2faaea78869346bf899c077650108cebdb1f3dfe36ebc1662bd0ca52b310b1', 'ZIP policy must match the independent original 394 rows plus the explicit Ferrysburg addition');
  for (const zip of ['49460', '49434', '49409']) assert.equal(defaults[zip], 'extended', `${zip} is not free travel`);
  for (const zip of ['49417', '49456', '49423', '49424']) assert.equal(defaults[zip], 'included', `${zip} keeps its Included DEFAULT, subject to physical exceptions`);
});

test('A127 validates the complete ASCII ZIP format before reducing valid ZIP+4', () => {
  for (const [input, expected] of [['49456', '49456'], ['49456-1234', '49456'], [' 49409-0000 ', '49409'], ['00123', '00123']]) assert.equal(normalizePropertyZip(input), expected);
  for (const input of ['', ' ', '4945', '494560', '494561234', '49456-', '49456-123', '49456-12345', '49456-12A4', '49456extra', '49456 1234', '49456\n49409', '４９４５６', '+49456', '49456.0']) {
    assert.equal(normalizePropertyZip(input), null, JSON.stringify(input));
    assertReview(classifyTravelProperty(property(input)));
  }
  for (const zip of ['00000', '00123', '99999', '99999-1234']) assertReview(classifyTravelProperty(property(zip)));
});

test('A127 all selected ZIP defaults classify locally except the unresolved shared Ferrysburg ZIP', () => {
  for (const [zip, zone] of Object.entries(defaults)) {
    const result = classifyTravelProperty(property(zip));
    if (zip === '49456') assertReview(result);
    else assert.deepEqual(result, { status: 'classified', zone, zip, basis: 'zip-default' });
  }
});

test('A127 verified physical Ferrysburg overrides Included ZIP defaults while verified outside 49456 stays Included', () => {
  for (const kind of ['municipal-gis', 'parcel-record', 'documented-property-review']) {
    for (const zip of ['49456', '49456-1234', '49417', '49423', '49424']) {
      assert.deepEqual(classifyTravelProperty(property(zip, { municipalLocation: evidence('inside', kind) })), {
        status: 'classified', zone: 'extended', zip: zip.slice(0, 5), basis: 'physical-location-exception',
      });
    }
    assert.deepEqual(classifyTravelProperty(property('49456-1234', { municipalLocation: evidence('outside', kind) })), {
      status: 'classified', zone: 'included', zip: '49456', basis: 'verified-outside-ferrysburg',
    });
  }
  for (const zip of ['49460', '49434', '49409']) assert.equal(classifyTravelProperty(property(zip, { municipalLocation: evidence('outside') })).zone, 'extended', 'Outside Ferrysburg does not turn another Extended ZIP into Included');
});

test('A127 negative authority fixtures cannot use a mailing city, PO box or missing evidence to grant free travel', () => {
  for (const municipalLocation of [undefined, { relationToFerrysburg: 'outside' }, { relationToFerrysburg: 'outside', evidence: {} }, evidence('outside', 'mailing-city', 'Spring Lake'), evidence('inside', 'mailing-city', 'Ferrysburg'), evidence('outside', 'postal-zcta', '49456'), evidence('outside', 'municipal-gis', ''), evidence('outside', 'parcel-record', '   '), evidence('unknown')]) {
    assertReview(classifyTravelProperty(property('49456', { municipalLocation, mailingCity: 'Spring Lake', requestedZone: 'included' })));
  }
  for (const zip of ['49456', '49417', '49460']) {
    assertReview(classifyTravelProperty(property(zip, { addressUse: 'mailing-or-po-box', municipalLocation: evidence('outside') })));
  }
  assertReview(classifyTravelProperty(property('99999', { municipalLocation: evidence('inside') })));
  assertReview(classifyTravelProperty(property('49456-invalid', { municipalLocation: evidence('outside') })));
});

test('A127 normal travel uses agreed one-property visits: Included 0, Extended 75 or 125 total', () => {
  const cases = [
    ['Included inspection', 'included', 1, 0],
    ['Included inspection and normal radon return', 'included', 2, 0],
    ['Extended inspection', 'extended', 1, 75],
    ['Extended inspection and same-visit sewer/thermal', 'extended', 1, 75],
    ['Extended inspection and normal radon return', 'extended', 2, 125],
    ['Extended standalone radon deployment/retrieval', 'extended', 2, 125],
  ];
  for (const [name, zone, visits, amount] of cases) assert.deepEqual(normalTravelTotal(assignment(classified(zone), visits)), { status: 'selected-policy-total', amount }, name);
  const ferrysburg = classifyTravelProperty(property('49456', { municipalLocation: evidence('inside') }));
  assert.deepEqual(normalTravelTotal(assignment(ferrysburg, 2)), { status: 'selected-policy-total', amount: 125 });
});

test('A127 negative service-stacking fixtures cannot override agreed visits or inject additive travel', () => {
  const extra = { services: ['full inspection', 'radon', 'sewer scope', 'thermal'], serviceTravelCharges: [75, 125, 75, 75], requestedTravelTotal: 0 };
  const extended = classifyTravelProperty(property('49460'));
  const oneVisit = normalTravelTotal(assignment(extended, 1, extra));
  const twoVisits = normalTravelTotal(assignment(extended, 2, extra));
  assert.deepEqual(oneVisit, { status: 'selected-policy-total', amount: 75 }, 'A radon service name alone must not select two visits');
  assert.deepEqual(twoVisits, { status: 'selected-policy-total', amount: 125 }, 'A shared two-visit assignment gets one total, not 75 + 125 or per-service charges');
  assert.notEqual(twoVisits.amount, 75 + 125);
  assert.notEqual(twoVisits.amount, 125 + 50, 'Normal retrieval is not a qualifying EXTRA trip');
  assertReview(normalTravelTotal(assignment(extended, undefined, extra)));
  assertReview(normalTravelTotal(assignment(classifyTravelProperty(property('49456')), 1, extra)));
});

test('A127 three-plus visits, multiple properties, unusual travel and By arrangement require agreement before commitment', () => {
  for (const zone of ['included', 'extended', 'by_arrangement']) {
    for (const visits of [0, -1, 1.5, 3, 4, NaN, Infinity]) assertReview(normalTravelTotal(assignment(classified(zone), visits)));
    for (const propertyCount of [0, 2, 3, 1.5]) assertReview(normalTravelTotal(assignment(classified(zone), 1, { propertyCount })));
    assertReview(normalTravelTotal(assignment(classified(zone), 1, { unusualTravel: true })));
  }
  for (const visits of [1, 2]) assertReview(normalTravelTotal(assignment(classified('by_arrangement'), visits)));
});

test('A127 keeps the qualifying EXTRA Included radon amount separate from normal travel and native commissioning unperformed', () => {
  assert.equal(travelPolicy.authority, 'A127');
  assert.equal(travelPolicy.qualifyingExtraIncludedRadonTrip, 50);
  assert.equal(travelPolicy.normalIncluded, 0);
  assert.equal(travelPolicy.extendedOneVisit, 75);
  assert.equal(travelPolicy.extendedTwoVisitsTotal, 125);
  assert.equal(travelPolicy.nativeCommissioned, false, 'Local policy fixtures do not certify Spectora behavior');
  for (const visits of [1, 2]) assert.equal(normalTravelTotal(assignment(classified('included'), visits)).amount, 0);
});

// Expected base-price fingerprint was computed from the verified PRE-EDIT snapshot:
// 2026-10-03_20-26-50_a127-territory-before.tar.gz SHA-256
// 49e08747f03cbeb59424d161c3e8d070812fd86b63467793aefd9b92c3a8cfe1.
// Archived pricing.ts SHA-256: fcdfb964b1b0bdb82e244286682d44d3eb28d5f83e45c99c41618078ff6f570e.
// Travel copy is deliberately outside this unchanged-base-price projection.
test('A127 preserves all base grids, packages, structure/limited-service prices and inactive promotion', () => {
  const p = pricingContent;
  const preserved = {
    house: p.housePricing.table.rows,
    condominium: p.condominiumPricing.table.rows,
    optional: p.conditionalPricing.serviceAndCombinationTable.rows,
    thermal: p.conditionalPricing.thermalTable.rows,
    adjustments: p.adjustments.groups.map(group => ({ title: group.title, rows: group.table.rows })),
    limited: p.limitedServices.items.map(({ title, price }) => ({ title, price })),
  };
  assert.equal(digest(preserved), '6f636ef683ddaf000d7e6318bd71adaa83198d0d97a355b1975210dbca1b1d16', 'All base-price table rows and package/service associations must match the independent before snapshot');
  assert.deepEqual({ enabled: promotion.enabled, startsOn: promotion.startsOn, endsOn: promotion.endsOn, residentialIntroPrice: promotion.residentialIntroPrice, residentialStandardPrice: promotion.residentialStandardPrice }, {
    enabled: false, startsOn: null, endsOn: null, residentialIntroPrice: 400, residentialStandardPrice: 450,
  });
  assert.equal(promotionIsActive(new Date('2026-10-04T12:00:00Z')), false);
});


test('A127 actual Service Area and Pricing render the selected totals, physical exception and quote-confirmation boundary', () => {
  const { createElement } = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const { ServiceAreaPage } = require('../src/components/ServiceAreaPage.tsx');
  const { PricingPage } = require('../src/components/PricingPage.tsx');
  for (const Component of [ServiceAreaPage, PricingPage]) {
    const markup = renderToStaticMarkup(createElement(Component));
    const text = markup.replace(/<svg\b[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    for (const expected of [
      'Normal travel included.',
      '$75 for one visit; $125 total for a normal two-visit service.',
      'Travel quoted before booking.',
      'West Olive, Macatawa and Ferrysburg are Extended.',
      'A property physically in Ferrysburg is Extended even with a Spring Lake mailing address or 49456 ZIP.',
      'Spring Lake properties outside Ferrysburg remain Included.',
      'Rivermark reviews the property and confirms travel before accepting the appointment.',
      'Travel is charged once for the agreed visit pattern at one property, not once per service.',
      'has $125 total travel when two visits are needed—not $75 plus $125.',
      'a normal return does not also receive an extra retrieval charge.',
      'A displayed scheduling quote may not include the correct travel treatment for the property.',
      'Already accepted quotes are honored',
    ]) assert.ok(text.includes(expected), `${Component.name}: missing selected policy or qualification: ${expected}`);
  }
});

test('A127 cost guide and both booking handoffs qualify travel before a native quote is relied on', () => {
  const article = fs.readFileSync(path.join(root, 'src/content/resources/home-inspection-cost-grand-rapids.md'), 'utf8');
  assert.ok(article.includes('Extended travel is $75 total for one ordinary visit or $125 total for a normal two-visit assignment'));
  assert.ok(article.includes('Spring Lake outside Ferrysburg remains Included'));
  assert.doesNotMatch(article, /travel charges are still being finalized/);
  const { priceAvailabilityContent } = require('../src/content/price-availability.ts');
  for (const mode of ['embed', 'hosted']) {
    const paragraphs = priceAvailabilityContent.transaction[mode].paragraphs.join(' ');
    assert.ok(paragraphs.includes('A displayed scheduling quote may not include the correct travel treatment for the property.'));
    assert.ok(paragraphs.includes('Properties using 49456 need physical-location review to distinguish Extended Ferrysburg from Included Spring Lake before appointment acceptance.'));
  }
  const { faqCatalog } = require('../src/content/faq-catalog.ts');
  assert.ok(faqCatalog['inspection-price'].default.answer.includes('Confirm Extended or unusual travel with Rivermark before booking. A displayed scheduling quote may not include the correct travel treatment for the property.'));
});
