import { showIntroductoryPricing } from "@/config/publication";
import type { SiteRouteKey } from "@/config/routes";
import type { WorkflowCopy, WorkflowKey } from "@/config/workflows";

export type ServicesPageLink = Readonly<{
  label: string;
  route: SiteRouteKey;
}>;

export const servicesOverviewContent = {
  metadata: {
    title: "Home Inspection Services in Grand Rapids | Rivermark",
    description:
      "Compare residential home inspection scope, seller and homeowner options, consultations, and follow-up work. Confirm service availability; new construction is not currently scheduling.",
    openGraphTitle: "Residential Inspection Services | Rivermark",
    openGraphDescription:
      "Start with the full residential inspection, then choose only the services that fit the property and your objective.",
  },
  hero: {
    eyebrow: "Grand Rapids & West Michigan",
    title: "Residential Inspection Services",
    paragraphs: [
      "Choose the service around the property and the decision ahead: buying a home, preparing to sell, planning maintenance, or understanding a specific concern.",
      "Start with the full Residential Home Inspection for broad property understanding. The service descriptions below explain how other inspection types, consultations, and follow-up work address different needs; confirm availability and scope with Rivermark.",
      "Unusual properties may need Manual Review. New-construction inspections are described for planning and are Not Currently Scheduling.",
    ],
    primaryAction: {
      label: "See Price & Availability",
      route: "priceAvailability",
    },
    secondaryAction: { label: "View Pricing", route: "pricing" },
  },
  coreInspection: {
    eyebrow: "Start With the Core Inspection",
    title: "Residential Home Inspection",
    paragraphs: [
      "A full residential inspection is the right starting point when you need a broad understanding of the property's visible and reasonably accessible systems and components.",
      "Rivermark evaluates the applicable residential systems, documents material conditions and important limitations, completes a prioritized walkthrough, and provides a written report designed to separate material concerns from routine maintenance.",
    ],
    price: {
      introductory: {
        label: "Introductory starting price",
        amount: "$400",
            allowance: "Through 3,000 sq. ft.",
      },
      standard: {
        label: "Standard starting price",
        amount: "$450",
            allowance: "Through 3,000 sq. ft.",
      },
    },
    supportingActions: [
      {
        label: "See What the Inspection Covers",
        route: "residentialHomeInspections",
      },
      { label: "View Complete Pricing", route: "pricing" },
    ] as const satisfies readonly ServicesPageLink[],
  },
  commonAdditions: {
    eyebrow: "Common Additions",
    title: "Add only the services that fit the property.",
    items: [
      {
        title: "Radon Testing",
        requiredRoute: "radonTesting",
        paragraphs: [
          "Measure the property's radon level using a professional continuous monitor and a defined process. Available as an add-on to a full inspection or as a standalone service.",
        ],
        prices: [
          showIntroductoryPricing() ? "Added to a full inspection: $150 introductory / $175 standard" : "Added to a full inspection: $175",
          showIntroductoryPricing() ? "Standalone: $225 introductory / $250 standard" : "Standalone: $250",
        ],
        link: { label: "Learn About Radon Testing", route: "radonTesting" },
      },
      {
        title: "Sewer Scope",
        requiredRoute: "sewerScope",
        paragraphs: [
          "Use a camera to observe one primary building sewer from one suitable, readily accessible cleanout or agreed access point. Available as an add-on or standalone service.",
        ],
        prices: [
          showIntroductoryPricing() ? "Added to a full inspection: $150 introductory / $175 standard" : "Added to a full inspection: $175",
          showIntroductoryPricing() ? "Standalone: $250 introductory / $275 standard" : "Standalone: $275",
        ],
        link: {
          label: "Learn About Sewer Scope Inspections",
          route: "sewerScope",
        },
      },
    ] as const,
  },
  situations: {
    eyebrow: "Choose by Situation",
    title: "Match the service to your situation.",
    table: {
      caption: "Customer situations and the corresponding service direction",
      firstColumnLabel: "Your situation",
      columns: [{ label: "Recommended service" }],
      rows: [
        {
          label: "Buying a house or fee-simple townhome",
          values: [{ label: "Residential Home Inspection", destination: "/services/residential-home-inspections/" }],
          route: "residentialHomeInspections",
        },
        {
          label: "Buying a condominium-form property",
          values: [{ label: "Condominium Inspection", destination: "/services/other-residential-services/#other-services-condominium-heading" }],
          route: "otherResidentialServices",
        },
        {
          label: "Preparing a property for sale",
          values: [{ label: "Pre-Listing Home Inspection", destination: "/services/other-residential-services/#other-services-pre-listing-heading" }],
          route: "otherResidentialServices",
        },
        {
          label: "Planning maintenance and ownership priorities",
          values: [{ label: "Home Maintenance Inspection", destination: "/services/other-residential-services/#other-services-maintenance-heading" }],
          route: "otherResidentialServices",
        },
        {
          label: "Evaluating a rental or one-to-four-unit property",
          values: [{ label: "Investment Property Inspection", destination: "/services/other-residential-services/#other-services-investment-heading" }],
          route: "otherResidentialServices",
        },
        {
          label: "Reviewing selected visible concerns before an offer",
          values: [{ label: "Pre-Offer Walk-Through Consultation", destination: "/services/other-residential-services/#other-services-pre-offer-heading" }],
          route: "otherResidentialServices",
        },
        {
          label: "Reviewing selected investor priorities",
          values: [{ label: "Investor Property Consultation", destination: "/services/other-residential-services/#other-services-investor-consultation-heading" }],
          route: "otherResidentialServices",
        },
        {
          label: "Revisiting specifically identified items",
          values: [{ label: "Repair Follow-Up Visit", destination: "/services/other-residential-services/#other-services-follow-up-heading" }],
          route: "otherResidentialServices",
        },
        {
          label: "Inspecting another dwelling or structure",
          values: [{ label: "Added scope or manual review", destination: "/services/other-residential-services/#other-services-scope-heading" }],
          route: "otherResidentialServices",
        },
      ] as const,
    },
    link: {
      label: "Explore Other Residential Services",
      route: "otherResidentialServices",
    },
  },
  thermalImaging: {
    requiredRoute: "thermalImaging",
    eyebrow: "Thermal Imaging",
    title: "Residential Thermal Imaging Services",
    paragraphs: [
      "A thermal camera displays surface-temperature patterns that may help identify areas deserving closer evaluation. It does not see through walls or prove the cause of a pattern by itself.",
      "Paid services may include an expanded scan added to a full inspection, a targeted standalone assessment, a whole-home screening, or a more extensive building-envelope assessment.",
    ],
    link: { label: "Learn About Thermal Imaging", route: "thermalImaging" },
  },
  newConstruction: {
    eyebrow: "Future service",
    title: "New Construction Inspections",
    status: "Not Currently Scheduling",
    stages: [
      "Pre-drywall inspection",
      "Final new-construction inspection",
      "11-month builder-warranty inspection",
    ],
    paragraphs: {
      production: [
        "Learn about the planned stages and share your interest in future availability. An interest request is nonbinding and does not reserve a date or create a booking.",
      ],
      development: [
        "Learn about the planned stages and share your interest in future availability. An interest request is nonbinding and does not reserve a date or create a booking.",
      ],
    } satisfies WorkflowCopy<readonly string[]>,
    workflow: "newConstructionInterest" as const satisfies WorkflowKey,
    link: {
      label: "View Planned New-Construction Services",
      route: "newConstructionInspections",
    },
  },
  comparison: {
    eyebrow: "Full Inspection or Limited Service?",
    title: "The scope should match the decision you are trying to make.",
    table: {
      caption: "Differences between a full inspection and a limited service",
      firstColumnLabel: "Full inspection",
      columns: [{ label: "Limited consultation or follow-up" }],
      rows: [
        {
          label: "Broad residential-system scope",
          values: ["Defined selected purpose"],
        },
        {
          label: "Full inspection process",
          values: ["Time- or item-limited process"],
        },
        {
          label: "Full written report",
          values: ["Concise summary or supplemental report"],
        },
        {
          label: "Appropriate for broad property understanding",
          values: ["Appropriate only when the objective fits"],
        },
      ],
    },
    paragraphs: [
      "A limited consultation is not a discounted full inspection. A Repair Follow-Up Visit is not a workmanship certification.",
      "When broad property understanding is the goal, choose the full Residential Home Inspection.",
    ],
  },
  specialist: {
    eyebrow: "When a Specialist Is More Appropriate",
    title: "Some assignments belong with a different qualified professional.",
    paragraphsBefore: [
      "Some questions need specialist training, testing, or analysis beyond a residential inspection. Rivermark may recommend the appropriate type of professional when the findings or requested work call for it.",
    ],
    examples: [
      "Structural engineering",
      "WDI or termite inspection",
      "Well and septic evaluation",
      "Water-quality testing",
      "Mold or environmental assessment",
      "Chimney Level II inspection",
      "Pool or spa specialty work",
      "Appraisal or property valuation",
    ],
    paragraphsAfter: [
      "Rivermark does not offer these specialist services or package them through partners. You normally arrange the work directly with the qualified professional.",
    ],
  },
  faqs: {
    title: "Service-Selection FAQs",
  },
  finalConversion: {
    title: "Start with the property and what you need to understand.",
    paragraphs: {
      production: [
        "Use the online route for standard active services. Large, unusual, multi-unit, multi-building, outer-area, or uncertain assignments may be routed to manual review.",
      ],
      development: [
        "Use Price & Availability for a standard residential quote and available times. Complete the required booking steps before treating an appointment as confirmed.",
        "For a large, unusual, multi-unit, multi-building, outlying, or uncertain assignment, choose Help with a property or quote on Contact to confirm the scope and availability.",
      ],
    } satisfies WorkflowCopy<readonly string[]>,
    primaryAction: {
      label: "See Price & Availability",
      route: "priceAvailability",
    },
    secondaryAction: { label: "View Pricing", route: "pricing" },
    fallback: {
      text: "Not sure which service fits?",
      action: { label: "Contact Rivermark", route: "contact" },
    },
  },
} as const;
