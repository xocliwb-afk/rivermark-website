import { promotion } from "@/config/publication";
import type { SiteRouteKey } from "@/config/routes";
import type {
  ServiceReadinessCopy,
  ServiceReadinessKey,
} from "@/config/service-readiness";
import type { WorkflowCopy, WorkflowKey } from "@/config/workflows";

export type OtherServicesPageLink = Readonly<{
  label: string;
  route: SiteRouteKey;
}>;

const otherServicesCapabilities = [
  "otherResidentialServices",
] as const satisfies readonly ServiceReadinessKey[];

export const otherResidentialServicesContent = {
  metadata: {
    title: "Other Residential Inspection Services | Rivermark",
    description:
      "Compare Rivermark's pre-listing, maintenance, investment, condominium, consultation, repair follow-up, multi-unit, detached-dwelling, and additional-structure services.",
    openGraphTitle:
      "Inspection Services for Other Residential Needs | Rivermark",
    openGraphDescription:
      "Full-scope inspection variants, defined consultations, item-specific follow-up work, and added residential scope.",
  },
  operationalCapabilities: otherServicesCapabilities,
  hero: {
    eyebrow:
      "For sellers, homeowners, investors, condominium buyers, and prior clients",
    title: "Inspection Services for Other Residential Needs",
    paragraphs: {
      production: [
        "Understand a property before selling, plan maintenance, evaluate a residential investment, or revisit specific findings. Choose a full inspection for broad understanding or a defined limited service for a narrower question.",
      ],
      development: [
        "A full inspection can support a sale, maintenance plan, rental-property decision, or condominium purchase. Defined consultations and follow-up visits address narrower needs.",
        "Contact Rivermark to confirm which service is available and appropriate for your property before arranging an appointment.",
      ],
    } satisfies ServiceReadinessCopy<readonly string[]>,
    distinctions: [
      {
        label: "Full-scope inspections",
        description:
          "Evaluate the applicable residential systems and produce a full report.",
      },
      {
        label: "Limited consultations",
        description:
          "Address a defined purpose within a limited time and produce a concise summary.",
      },
      {
        label: "Repair Follow-Up Visits",
        description:
          "Revisit specifically identified items and produce a separate supplemental report.",
      },
      {
        label: "Added scope",
        description:
          "Covers additional units, detached dwellings, or structures when accepted.",
      },
    ],
    primaryAction: {
      label: "See Price & Availability",
      route: "priceAvailability",
    },
    secondaryAction: { label: "View Pricing", route: "pricing" },
  },
  situations: {
    eyebrow: undefined,
    title: "Choose by Situation",
    paragraphs: [
      "Choose a full inspection for broad property understanding, a consultation for a defined question, or a follow-up visit for specifically identified items. The options below explain the differences, scope, and starting prices.",
    ],
  },
  fullScope: {
    eyebrow: "Full-Scope Residential Variants",
    title: "The same broad technical foundation, adapted to a different purpose.",
    items: [
      {
        headingId: "other-services-pre-listing-heading",
        title: "Pre-Listing Home Inspection",
        paragraphsBefore: [
          "Understand the home's visible condition before listing so you can plan which concerns need attention. A Pre-Listing Home Inspection uses the same full residential technical foundation as buyer work, with candid findings regardless of who is selling the property.",
          "The seller controls ordinary report sharing, but a prospective buyer does not automatically become Rivermark's client or receive reliance rights.",
          "Valid findings are not deleted after repairs. Later visible changes may be documented through a separate follow-up process.",
          "A seller questionnaire may provide context, but it is not a statutory disclosure form and Rivermark does not provide legal or real-estate disclosure advice.",
        ],
        list: [] as readonly string[],
        paragraphsAfter: [] as readonly string[],
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
        supplementaryPrice: undefined,
      },
      {
        headingId: "other-services-maintenance-heading",
        title: "Home Maintenance Inspection",
        paragraphsBefore: [
          "Get a clearer view of the home you own and the maintenance worth planning next. A Home Maintenance Inspection uses the full residential inspection foundation for an owner-occupied home.",
          "The homeowner's known history, repairs, seasonal concerns, planned improvements, and inaccessible areas may provide context. The service is designed to include a full report plus a maintenance-planning summary addressing:",
        ],
        list: [
          "Immediate concerns",
          "Matters needing professional evaluation",
          "Near-term maintenance",
          "Conditions to monitor",
          "Longer-term ownership planning",
        ],
        paragraphsAfter: [
          "It is not a warranty, guarantee, or complete preventive-maintenance program.",
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
        supplementaryPrice: undefined,
      },
      {
        headingId: "other-services-investment-heading",
        title: "Investment Property Inspection",
        paragraphsBefore: [
          "Understand current property conditions, recurring concerns, and maintenance priorities before a residential investment decision. This service uses the full residential inspection scope and may be accepted for qualifying one-to-four-unit properties.",
          "Every contracted unit and applicable common area is inspected rather than sampled. Duplicated systems are not assumed satisfactory because a similar system in another unit was observed.",
          "The report may organize:",
        ],
        list: [
          "Property-wide conditions",
          "Shared systems and common areas",
          "Unit-specific observations",
          "Material concerns and professional-evaluation needs",
          "Near-term maintenance priorities",
          "Patterns or recurring conditions",
        ],
        paragraphsAfter: [
          "Rivermark does not provide property valuation, rent projections, return-on-investment analysis, repair budgets, landlord-compliance conclusions, renovation scopes, negotiation advice, or investment recommendations.",
        ],
        price: {
          introductory: {
            label: "Qualifying single-family introductory starting price",
            amount: `$${promotion.residentialIntroPrice}`,
          },
          standard: {
            label: "Qualifying single-family standard starting price",
            amount: `$${promotion.residentialStandardPrice}`,
          },
        },
        supplementaryPrice: "Additional in-building units: +$100 each",
      },
      {
        headingId: "other-services-condominium-heading",
        title: "Condominium and Townhome Inspections",
        paragraphsBefore: [
          "Understand the condition of the condominium you plan to buy. A condominium-form inspection focuses on the contracted unit, the systems directly serving it, and reasonably accessible exclusive-use components.",
          "Immediately adjacent common conditions may be noted when they materially affect the unit. Rivermark does not comprehensively inspect association-owned roofs, exteriors, shared structure, mechanical rooms, other units, association finances, reserves, insurance, or governing documents.",
          "Fee-simple townhomes use house scope and house pricing. Condominium-form townhomes use condominium scope and pricing.",
        ],
        list: [] as readonly string[],
        paragraphsAfter: [] as readonly string[],
        price: {
          introductory: {
            label: "Condominium introductory starting price",
            amount: "$300",
            allowance: "Through 1,500 sq. ft.",
          },
          standard: {
            label: "Condominium standard starting price",
            amount: "$350",
            allowance: "Through 1,500 sq. ft.",
          },
        },
        supplementaryPrice: undefined,
      },
    ],
  },
  limitedConsultations: {
    eyebrow: "Limited Consultations",
    title: "A defined purpose, limited time, and concise written summary.",
    items: [
      {
        headingId: "other-services-pre-offer-heading",
        title: "Pre-Offer Walk-Through Consultation",
        price: "$275",
        paragraphsBefore: [
          "This service is designed for a customer who wants a limited visible-condition overview before deciding whether to make an offer.",
          "It includes:",
        ],
        items: [
          "Up to 90 scheduled onsite minutes",
          "A rapid general overview followed by the customer's priorities",
          "Selected visible material concerns",
          "Areas that may deserve further investigation",
          "Verbal consultation",
          "Selected photographs",
          "A concise written summary",
        ],
        paragraphsAfter: [
          "Attendance is strongly encouraged. A remote consultation may be accepted when the objective and access make it useful.",
          "This is not a full inspection. Full-inspection procedures are not automatically included, and the service should not be relied on as a substitute for a full residential inspection.",
        ],
      },
      {
        headingId: "other-services-investor-consultation-heading",
        title: "Investor Property Consultation",
        price: "$300",
        paragraphsBefore: [
          "Focus on selected visible property conditions and apparent capital-maintenance priorities. This limited consultation helps identify questions that may need a full inspection or specialist evaluation.",
          "It includes:",
        ],
        items: [
          "Up to 90 scheduled onsite minutes",
          "A rapid general overview followed by investor priorities",
          "Selected visible-condition observations",
          "Apparent capital-maintenance priorities",
          "Areas that may need a specialist",
          "Verbal consultation",
          "Selected photographs",
          "A concise investor-oriented summary",
        ],
        paragraphsAfter: [
          "Rivermark does not provide value, rent, ROI, repair budgets, bids, renovation scopes, negotiation advice, or complete investment assurance.",
        ],
      },
    ],
    boundaries: {
      title: "Consultation boundaries",
      conditionalParagraph: {
        text: "Radon, sewer, and paid thermal services are not packaged with limited consultations at launch.",
        requiredRoutes: [
          "radonTesting",
          "sewerScope",
          "thermalImaging",
        ] as const,
      },
      upgradeParagraphs: {
        production: [
          "A consultation may be upgraded to a full inspection before or at the beginning of the appointment when the schedule, access, agreement, and payment requirements permit it. The consultation fee is credited toward the full inspection in that situation.",
          "A substantially completed consultation is not retroactively relabeled as a full inspection.",
        ],
        development: [
          "An upgrade requires Rivermark's confirmation before or at the beginning of the appointment, with sufficient time, access, agreement, and payment arrangements. The consultation fee is credited toward the full inspection when the change is accepted.",
          "A substantially completed consultation is not retroactively relabeled as a full inspection.",
        ],
      } satisfies WorkflowCopy<readonly string[]>,
    },
  },
  repairFollowUp: {
    eyebrow: "Repair Follow-Up Visit",
    title: "See what has changed in specifically identified items.",
    paragraphsBefore: [
      "A Repair Follow-Up Visit is an item-specific visual, non-invasive review, normally based on Rivermark's original report.",
      "Third-party-report assignments may be accepted case by case after the item list and requested scope are reviewed.",
      "Provide the agreed item list before the appointment. The original inspection report remains unchanged; a separate supplemental report records the visible condition of each item using descriptions such as:",
    ],
    outcomes: [
      "Appears addressed based on visible conditions",
      "Partially addressed",
      "Not visibly addressed",
      "Condition changed",
      "Unable to determine",
      "Further evaluation recommended",
    ],
    paragraphsAfter: [
      "The service does not certify workmanship, permits, code compliance, concealed repairs, invoices, warranties, or future performance.",
    ],
    prices: [
      { label: "Price through 60 onsite minutes", amount: "$195" },
      { label: "Additional onsite time per 30 minutes", amount: "$75" },
    ],
    closing: "A second trip normally creates another base charge.",
  },
  additionalScope: {
    eyebrow: undefined,
    title: "Additional Units, Dwellings, and Structures",
    paragraphs: [
      "Additional in-building dwelling units are $100 each, with every contracted unit and applicable common area inspected. A detached dwelling has separate dwelling-level scope: $250 through 1,000 square feet, plus $40 per additional 500 square feet; the in-building unit charge does not also apply.",
      "One ordinary detached residential garage is included with a full inspection, and one ordinary accessible small storage shed may receive a limited observation. Additional structures have separate pricing; larger, finished, heated, plumbed, agricultural, or complex structures require review.",
      "Rivermark may decline substantial commercial, industrial, agricultural, animal, machinery, environmental, or hazardous exposure. See Pricing for the full structure adjustments.",
    ],
  },
  comparison: {
    eyebrow: undefined,
    title: "Full Inspection or Limited Service?",
    table: {
      caption: "Six questions for distinguishing full and limited services",
      firstColumnLabel: "Question",
      columns: [
        { label: "Full inspection" },
        { label: "Consultation or follow-up" },
      ],
      rows: [
        {
          label: "Need broad property understanding?",
          values: ["Yes", "No"],
        },
        {
          label: "Need normal residential systems evaluated?",
          values: ["Yes", "No"],
        },
        {
          label: "Need a full inspection report?",
          values: ["Yes", "No"],
        },
        {
          label: "Have a narrow selected question?",
          values: ["May be more than needed", "Often appropriate"],
        },
        {
          label: "Need repair certification?",
          values: ["Not provided", "Not provided"],
        },
        {
          label: "Need valuation or negotiation advice?",
          values: ["Not provided", "Not provided"],
        },
      ],
    },
    paragraphs: [
      "When broad property understanding is the goal, choose a full inspection. When the objective is narrow, Rivermark can help determine whether a consultation or follow-up visit fits.",
    ],
  },
  pricingSnapshot: {
    eyebrow: undefined,
    title: "Pricing Snapshot",
    paragraphs: [
      "The prices above describe each service's starting scope. Full-inspection area includes finished and unfinished basement space. Review the complete size tiers, additional structures, travel, cancellation, and access policies before relying on a total.",
    ],
    link: { label: "View Complete Pricing", route: "pricing" },
  },
  faqs: {
    eyebrow: undefined,
    title: "Service-Fit FAQs",
  },
  finalConversion: {
    title: "Choose the service that matches the actual objective.",
    paragraphs: {
      production: [
        "Contact Rivermark to confirm service availability and scope for nonstandard units, dwellings, structures, consultations, or follow-up assignments.",
      ],
      development: [
        "Start with Price & Availability for a standard residential quote and available times. Complete the required booking steps before treating an appointment as confirmed.",
        "Choose Help with a property or quote on the Contact page to confirm service availability and scope for nonstandard units, dwellings, structures, consultations, or follow-up work.",
      ],
    } satisfies ServiceReadinessCopy<readonly string[]>,
    workflow: "buyerTransaction" as const satisfies WorkflowKey,
    primaryAction: {
      label: "See Price & Availability",
      route: "priceAvailability",
    },
    secondaryAction: { label: "View Pricing", route: "pricing" },
    fallback: {
      text: "Not sure whether you need a full inspection, consultation, or follow-up visit?",
      action: { label: "Contact Rivermark", route: "contact" },
    },
  },
} as const;
