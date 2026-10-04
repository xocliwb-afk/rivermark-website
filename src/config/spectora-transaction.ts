import "server-only";

export const spectoraTransactionModes = {
  disabled: "disabled",
  hosted: "hosted",
  embed: "embed",
} as const;

export type SpectoraTransactionMode =
  (typeof spectoraTransactionModes)[keyof typeof spectoraTransactionModes];

export const spectoraTransactionReadinessStates = {
  pendingValidation: "pending-validation",
  ready: "ready",
} as const;

export type SpectoraTransactionReadinessState =
  (typeof spectoraTransactionReadinessStates)[keyof typeof spectoraTransactionReadinessStates];

export const spectoraTransactionEnvironmentVariables = {
  mode: "SPECTORA_TRANSACTION_MODE",
  hostedUrl: "SPECTORA_GET_QUOTE_URL",
  embedUrl: "SPECTORA_GET_QUOTE_EMBED_URL",
} as const;

/**
 * These gates remain pending until TASK-009B verifies Rivermark's account and
 * the complete Spectora transaction. A configured presentation mode is not a
 * declaration that the production workflow is ready.
 */
export const spectoraTransactionReadiness = {
  gates: [
    "SPECTORA_ACCOUNT_CONFIGURATION_REQUIRED_BEFORE_PUBLICATION",
    "SPECTORA_GET_A_QUOTE_CONFIGURATION_REQUIRED_BEFORE_PUBLICATION",
    "SPECTORA_SERVICES_FEES_REGRESSION_REQUIRED_BEFORE_PUBLICATION",
    "SPECTORA_PROPERTY_DATA_VALIDATION_REQUIRED_BEFORE_PUBLICATION",
    "SPECTORA_AVAILABILITY_VALIDATION_REQUIRED_BEFORE_PUBLICATION",
    "SPECTORA_CONFIRMATION_STATE_VALIDATION_REQUIRED_BEFORE_PUBLICATION",
    "SPECTORA_AGENT_CLIENT_HANDOFF_VALIDATION_REQUIRED_BEFORE_PUBLICATION",
    "SPECTORA_AGREEMENT_VALIDATION_REQUIRED_BEFORE_PUBLICATION",
    "SPECTORA_PAYMENT_VALIDATION_REQUIRED_BEFORE_PUBLICATION",
    "SPECTORA_PORTAL_PERMISSION_VALIDATION_REQUIRED_BEFORE_PUBLICATION",
    "SPECTORA_GOOGLE_CALENDAR_VALIDATION_REQUIRED_BEFORE_PUBLICATION",
    "SPECTORA_CROSS_SELLING_REVIEW_REQUIRED_BEFORE_PUBLICATION",
    "SPECTORA_HOSTED_HANDOFF_QA_REQUIRED_BEFORE_PUBLICATION",
    "SPECTORA_EMBED_QA_REQUIRED_BEFORE_PUBLICATION",
    "SPECTORA_MANUAL_REVIEW_ROUTING_REQUIRED_BEFORE_PUBLICATION",
    "PRICE_AVAILABILITY_ROBOTS_FINALIZATION_REQUIRED_BEFORE_PUBLICATION",
  ],
  state: spectoraTransactionReadinessStates.pendingValidation,
} as const satisfies Readonly<{
  gates: readonly string[];
  state: SpectoraTransactionReadinessState;
}>;

const verifiedSpectoraWidgetHostname = "widgets.spectora.com";
const verifiedGetAQuoteFragment = /^\/[A-Za-z0-9][A-Za-z0-9_-]*\/quote$/;

/** Public iframe src and View Widget URL read from Rivermark's authenticated
 * Get a Quote settings on 2026-09-30. This is a public widget address, not an
 * authentication token. Owner-authorized local default: real embedded widget.
 */
const rivermarkWidgetUrl =
  "https://widgets.spectora.com/#/my-inspection-company-38dac2d78a/quote";

type SpectoraTransactionEnvironment = Readonly<{
  mode?: string;
  hostedUrl?: string;
  embedUrl?: string;
}>;

type DisabledReason =
  | "default-disabled"
  | "invalid-mode"
  | "hosted-url-required"
  | "embed-configuration-required";

export type SpectoraTransactionConfig =
  | Readonly<{
      mode: typeof spectoraTransactionModes.disabled;
      reason: DisabledReason;
    }>
  | Readonly<{
      mode: typeof spectoraTransactionModes.hosted;
      hostedUrl: string;
    }>
  | Readonly<{
      mode: typeof spectoraTransactionModes.embed;
      embed: Readonly<{
        kind: "iframe";
        src: string;
      }>;
      hostedUrl: string;
    }>;

function verifiedWidgetUrl(value: string | undefined): string | undefined {
  const candidate = value?.trim();

  if (!candidate) {
    return undefined;
  }

  try {
    const parsed = new URL(candidate);

    if (
      parsed.protocol !== "https:" ||
      parsed.hostname !== verifiedSpectoraWidgetHostname ||
      parsed.port !== "" ||
      parsed.username !== "" ||
      parsed.password !== "" ||
      parsed.pathname !== "/" ||
      parsed.search !== "" ||
      !verifiedGetAQuoteFragment.test(parsed.hash.slice(1))
    ) {
      return undefined;
    }

    return parsed.href;
  } catch {
    return undefined;
  }
}

function environmentFromProcess(): SpectoraTransactionEnvironment {
  return {
    mode: process.env.SPECTORA_TRANSACTION_MODE ?? spectoraTransactionModes.embed,
    hostedUrl: process.env.SPECTORA_GET_QUOTE_URL ?? rivermarkWidgetUrl,
    embedUrl: process.env.SPECTORA_GET_QUOTE_EMBED_URL ?? rivermarkWidgetUrl,
  };
}

/**
 * Resolve deployment configuration without ever deriving an account ID or
 * modifying a Spectora URL. The observed Get a Quote contract is an iframe
 * served from widgets.spectora.com with an account-scoped `#/<slug>/quote`
 * fragment. The verified public account URL is the default; environment
 * configuration can override it without a code change. This module never
 * derives an account slug. The transaction route renders at request time.
 */
export function resolveSpectoraTransactionConfig(
  environment: SpectoraTransactionEnvironment = environmentFromProcess(),
): SpectoraTransactionConfig {
  const requestedMode = environment.mode?.trim();

  if (!requestedMode || requestedMode === spectoraTransactionModes.disabled) {
    return {
      mode: spectoraTransactionModes.disabled,
      reason: "default-disabled",
    };
  }

  const hostedUrl = verifiedWidgetUrl(environment.hostedUrl);

  if (requestedMode === spectoraTransactionModes.hosted) {
    return hostedUrl
      ? { mode: spectoraTransactionModes.hosted, hostedUrl }
      : {
          mode: spectoraTransactionModes.disabled,
          reason: "hosted-url-required",
        };
  }

  if (requestedMode === spectoraTransactionModes.embed) {
    const embedUrl = verifiedWidgetUrl(environment.embedUrl);

    return embedUrl && hostedUrl && embedUrl === hostedUrl
      ? {
          mode: spectoraTransactionModes.embed,
          embed: { kind: "iframe", src: embedUrl },
          hostedUrl,
        }
      : {
          mode: spectoraTransactionModes.disabled,
          reason: "embed-configuration-required",
        };
  }

  return {
    mode: spectoraTransactionModes.disabled,
    reason: "invalid-mode",
  };
}
