export const serviceReadinessStates = {
  pendingValidation: "pending-validation",
  ready: "ready",
} as const;

export type ServiceReadinessState =
  (typeof serviceReadinessStates)[keyof typeof serviceReadinessStates];

/**
 * Operational service capabilities are deliberately separate from route publication,
 * approved service architecture, and informational pricing.
 */
export const serviceReadiness = {
  otherResidentialServices: {
    gates: [
      "OTHER_SERVICES_LAUNCH_SUBSET_REQUIRED_BEFORE_PUBLICATION",
      "OTHER_SERVICES_SPECTORA_MAPPING_REQUIRED_BEFORE_PUBLICATION",
      "OTHER_SERVICES_AGREEMENT_REPORT_WORKFLOW_REQUIRED_BEFORE_PUBLICATION",
    ],
    state: serviceReadinessStates.pendingValidation,
  },
} as const satisfies Record<
  string,
  Readonly<{ gates: readonly string[]; state: ServiceReadinessState }>
>;

export type ServiceReadinessKey = keyof typeof serviceReadiness;

export type ServiceReadinessCopy<T> = Readonly<{
  production: T;
  development: T;
}>;

export function areServiceCapabilitiesReady(
  capabilities: readonly ServiceReadinessKey[],
): boolean {
  return capabilities.every(
    (capability) =>
      (serviceReadiness[capability].state as ServiceReadinessState) ===
      serviceReadinessStates.ready,
  );
}

export function copyForServiceReadiness<T>(
  capabilities: readonly ServiceReadinessKey[],
  copy: ServiceReadinessCopy<T>,
): T {
  return areServiceCapabilitiesReady(capabilities)
    ? copy.production
    : copy.development;
}
