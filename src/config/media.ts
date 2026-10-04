export type DevelopmentMediaSlotConfig = Readonly<{
  state: "development-placeholder";
  assetKey: "HERO 01" | "FOUNDER 02" | "FIELD 03";
  annotation: "Photography pending";
  aspectRatio: "4 / 3" | "4 / 5" | "3 / 2";
  composition: "landscape" | "portrait" | "field";
}>;

export type DevelopmentMediaBuildMode = "local-development" | "launch-ready";

export const developmentMediaBuildMode: DevelopmentMediaBuildMode =
  "launch-ready";

export const residentialFieldMedia = {
  state: "development-placeholder",
  assetKey: "FIELD 03",
  annotation: "Photography pending",
  aspectRatio: "3 / 2",
  composition: "field",
} as const satisfies DevelopmentMediaSlotConfig;

