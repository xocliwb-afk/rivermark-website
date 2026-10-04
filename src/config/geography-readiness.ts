export const geographyReadinessStates = {
  pendingValidation: "pending-validation",
  ready: "ready",
} as const;

export type GeographyReadinessState =
  (typeof geographyReadinessStates)[keyof typeof geographyReadinessStates];

/**
 * Geographic readiness is deliberately separate from route publication, page
 * implementation, and transaction-workflow readiness.
 */
export const geographyReadiness = {
  serviceArea: {
    gates: [
      "SERVICE_AREA_OPERATING_BASE_REQUIRED_BEFORE_PUBLICATION",
      "SERVICE_AREA_BOUNDARIES_REQUIRED_BEFORE_PUBLICATION",
      "SERVICE_AREA_COMMUNITIES_REQUIRED_BEFORE_PUBLICATION",
      "SERVICE_AREA_MAP_REQUIRED_BEFORE_PUBLICATION",
      "SERVICE_AREA_TRAVEL_MODIFIERS_REQUIRED_BEFORE_PUBLICATION",
      "SERVICE_AREA_GBP_SERVICE_AREAS_REQUIRED_BEFORE_PUBLICATION",
    ],
    state: geographyReadinessStates.pendingValidation,
  },
} as const satisfies Record<
  string,
  Readonly<{ gates: readonly string[]; state: GeographyReadinessState }>
>;

export type GeographyReadinessKey = keyof typeof geographyReadiness;

export type GeographyReadinessCopy<T> = Readonly<{
  production: T;
  development: T;
}>;

export function isGeographyReady(
  capability: GeographyReadinessKey,
): boolean {
  return (
    (geographyReadiness[capability].state as GeographyReadinessState) ===
    geographyReadinessStates.ready
  );
}

export function copyForGeographyReadiness<T>(
  capability: GeographyReadinessKey,
  copy: GeographyReadinessCopy<T>,
): T {
  return isGeographyReady(capability) ? copy.production : copy.development;
}

/** Populate only after the exact territory and travel treatment are approved. */
export const approvedServiceArea: Readonly<{
  anchor: string; region: string; primaryCommunities: readonly string[];
  extendedCommunities: readonly string[]; mapUrl: string | null; travelExplanation: string | null;
}> = { anchor: "Grand Rapids", region: "West Michigan", primaryCommunities: [], extendedCommunities: [], mapUrl: null, travelExplanation: null };
