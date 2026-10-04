import type { SiteRouteKey } from "@/config/routes";

export const resourceAuthor = "Brandon Wilcox, Founder of Rivermark Home Inspections";
export const resourcesMetadata = {
  title: "Home Inspection Resources | Rivermark Home Inspections",
  description: "Practical guides to Rivermark's inspection pricing in Grand Rapids and West Michigan, preparing for inspection day, and understanding your report.",
};

export const resources = [
  {
    slug: "home-inspection-cost-grand-rapids", route: "homeInspectionCostResource",
    publishedOn: null, updatedOn: null,
    title: "How Much Does a Home Inspection Cost in Grand Rapids and West Michigan?",
    metadata: {
      title: "Home Inspection Cost Factors in Grand Rapids & West Michigan | Rivermark",
      description: "See how Rivermark counts basement space, calculate an illustrative house price, and compare inspection scope, property adjustments, and included services.",
    },
    introduction: "A useful price comparison starts with the work included. This guide explains Rivermark's prices and what can change them, with a worked square-footage example and questions to ask when comparing inspections.",
    related: ["pricing", "residentialHomeInspections", "serviceArea"],
  },
  {
    slug: "what-to-expect-home-inspection", route: "homeInspectionExpectationsResource",
    publishedOn: null, updatedOn: null,
    title: "What to Expect at a Home Inspection",
    metadata: {
      title: "What to Expect at a Home Inspection | Rivermark",
      description: "A practical guide to preparing for a home inspection, participating in the walkthrough, understanding limitations, and using the written report.",
    },
    introduction: "Good preparation gives the inspector access to the home and gives you time to understand the findings. Use this guide to coordinate the property, plan your attendance, and bring useful questions to the walkthrough.",
    related: ["buyers", "residentialHomeInspections", "pricing", "faq", "homeInspectionReportResource"],
  },
  {
    slug: "how-to-read-home-inspection-report", route: "homeInspectionReportResource",
    publishedOn: null, updatedOn: null,
    title: "How to Read a Home Inspection Report Without Treating Every Finding the Same",
    metadata: {
      title: "How to Read a Home Inspection Report | Rivermark",
      description: "Read inspection findings in context: material concerns, further evaluation, near-term work, maintenance, and the limitations that leave questions unresolved.",
    },
    introduction: "A useful report helps you understand the condition of the property and decide what needs attention. It should not make every observation look equally urgent or turn the home into a pass/fail score.",
    related: ["sampleReport", "homeInspectionExpectationsResource", "residentialHomeInspections", "buyers", "faq"],
  },
] as const satisfies readonly Readonly<{
  slug: string; route: SiteRouteKey; title: string;
  // Actual article publication/material-update dates only; never build or approval dates.
  publishedOn: string | null; updatedOn: string | null;
  metadata: { title: string; description: string }; introduction: string;
  related: readonly SiteRouteKey[];
}>[];

export type Resource = (typeof resources)[number];
