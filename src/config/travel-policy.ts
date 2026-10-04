import zipDefaults from "./travel-zip-defaults.json";

export type TravelZone = "included" | "extended" | "by_arrangement";

// A127 selected policy. This is a local reference for commissioning and copy,
// not a geocoder, customer quote widget or proof of native Spectora enforcement.
export const travelPolicy = {
  authority: "A127",
  normalIncluded: 0,
  extendedOneVisit: 75,
  extendedTwoVisitsTotal: 125,
  qualifyingExtraIncludedRadonTrip: 50,
  nativeCommissioned: false,
} as const;

export const travelCopy = {
  included: "Normal travel included.",
  extended: `$${travelPolicy.extendedOneVisit} for one visit; $${travelPolicy.extendedTwoVisitsTotal} total for a normal two-visit service.`,
  byArrangement: "Travel quoted before booking.",
  exception: "West Olive, Macatawa and Ferrysburg are Extended. A property physically in Ferrysburg is Extended even with a Spring Lake mailing address or 49456 ZIP. Spring Lake properties outside Ferrysburg remain Included.",
  locationReview: "Travel follows the inspected property’s physical location, not the client’s mailing address. A ZIP or mailing city alone cannot resolve the Ferrysburg boundary. If the location or ZIP is unclear, Rivermark reviews the property and confirms travel before accepting the appointment.",
  sharedVisits: "Travel is charged once for the agreed visit pattern at one property, not once per service. An Extended inspection with sewer or thermal work in the same visit has $75 total travel. An inspection with radon and its normal return, or standalone radon with normal deployment and retrieval, has $125 total travel when two visits are needed—not $75 plus $125.",
  radon: "Normal radon placement and retrieval remain part of the base service scope. The travel adjustment is separate and applies once; a normal return does not also receive an extra retrieval charge. The agreed visits determine travel, without changing the required testing procedure.",
  custom: "Three or more planned dedicated visits, multiple properties or unusual travel require an agreed custom arrangement before commitment. By-arrangement work is considered individually; a request does not guarantee acceptance.",
  bookingReview: "Properties using 49456 need physical-location review to distinguish Extended Ferrysburg from Included Spring Lake before appointment acceptance.",
  confirmation: "Confirm Extended or unusual travel with Rivermark before booking. A displayed scheduling quote may not include the correct travel treatment for the property.",
} as const;

export type VerifiedMunicipalLocation = Readonly<{
  relationToFerrysburg: "inside" | "outside";
  evidence: Readonly<{
    kind: "municipal-gis" | "parcel-record" | "documented-property-review";
    reference: string;
  }>;
}>;

export type TravelClassification =
  | Readonly<{ status: "classified"; zone: TravelZone; zip: string; basis: "zip-default" | "physical-location-exception" | "verified-outside-ferrysburg" }>
  | Readonly<{ status: "review"; reason: string }>;

export function normalizePropertyZip(value: string): string | null {
  const zip = value.trim();
  return /^[0-9]{5}(?:-[0-9]{4})?$/.test(zip) ? zip.slice(0, 5) : null;
}

export function classifyTravelProperty(property: Readonly<{
  addressUse: "inspection-property" | "mailing-or-po-box";
  postalZip: string;
  municipalLocation?: VerifiedMunicipalLocation;
}>): TravelClassification {
  if (property.addressUse !== "inspection-property") return { status: "review", reason: "Use the inspected property's physical address." };
  const zip = normalizePropertyZip(property.postalZip);
  if (!zip || !Object.hasOwn(zipDefaults, zip)) return { status: "review", reason: "Invalid, unknown or unlisted property ZIP." };
  const location = property.municipalLocation;
  const proof = location?.evidence;
  const verified = proof && ["municipal-gis", "parcel-record", "documented-property-review"].includes(proof.kind) && typeof proof.reference === "string" && proof.reference.trim().length > 0;
  if (location && (!verified || !["inside", "outside"].includes(location.relationToFerrysburg))) return { status: "review", reason: "Resolve incomplete or conflicting physical-location evidence before confirming travel." };
  if (verified && location.relationToFerrysburg === "inside") return { status: "classified", zone: "extended", zip, basis: "physical-location-exception" };
  if (zip === "49456") {
    if (!verified || location.relationToFerrysburg !== "outside") return { status: "review", reason: "Resolve whether the physical property is in Ferrysburg before confirming travel." };
    return { status: "classified", zone: "included", zip, basis: "verified-outside-ferrysburg" };
  }
  return { status: "classified", zone: zipDefaults[zip as keyof typeof zipDefaults] as TravelZone, zip, basis: "zip-default" };
}

export function normalTravelTotal(assignment: Readonly<{
  classification: TravelClassification;
  plannedDedicatedVisits: number;
  propertyCount: number;
  unusualTravel: boolean;
}>): Readonly<{ status: "selected-policy-total"; amount: number }> | Readonly<{ status: "review"; reason: string }> {
  const { classification, plannedDedicatedVisits: visits, propertyCount, unusualTravel } = assignment;
  if (classification.status === "review") return classification;
  if (classification.zone === "by_arrangement" || propertyCount !== 1 || unusualTravel || !Number.isInteger(visits) || visits < 1 || visits > 2) return { status: "review", reason: "Agree the travel arrangement before commitment." };
  return { status: "selected-policy-total", amount: classification.zone === "included" ? travelPolicy.normalIncluded : visits === 1 ? travelPolicy.extendedOneVisit : travelPolicy.extendedTwoVisitsTotal };
}
