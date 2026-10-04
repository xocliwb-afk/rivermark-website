/**
 * Non-public homepage readiness state.
 *
 * These values deliberately keep unresolved assets and promotion dates visible to local
 * reviewers without turning the annotations into launch copy. Optional photographs can be added when approved assets are available.
 * The current photo-light layout does not depend on these slots.
 */
import type { DevelopmentMediaSlotConfig } from "./media";

export { developmentMediaBuildMode as homepageBuildMode } from "./media";

export const homepageMedia = {
  hero: {
    state: "development-placeholder",
    assetKey: "HERO 01",
    annotation: "Photography pending",
    aspectRatio: "4 / 3",
    composition: "landscape",
  },
  founder: {
    state: "development-placeholder",
    assetKey: "FOUNDER 02",
    annotation: "Photography pending",
    aspectRatio: "4 / 5",
    composition: "portrait",
  },
} as const satisfies Record<"hero" | "founder", DevelopmentMediaSlotConfig>;

