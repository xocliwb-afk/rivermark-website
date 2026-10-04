import "server-only";
import { travelCopy } from "@/config/travel-policy";
import { showIntroductoryPricing } from "@/config/publication";

import type { GeographyReadinessKey } from "@/config/geography-readiness";
import type { ServiceReadinessKey } from "@/config/service-readiness";
import type { SiteRouteKey } from "@/config/routes";
import type { WorkflowKey } from "@/config/workflows";
import { pricingContent } from "@/content/pricing";

export const faqCategoryDefinitions = [
  { id: "booking-pricing", title: "Booking and Pricing" },
  { id: "inspection-day", title: "Inspection Day" },
  { id: "reports-support", title: "Reports and Support" },
  { id: "services-property-types", title: "Services and Property Types" },
  {
    id: "scope-limitations-service-area",
    title: "Scope, Limitations, and Service Area",
  },
] as const;

export type FaqCategoryId = (typeof faqCategoryDefinitions)[number]["id"];

export type FaqContext =
  | "home"
  | "residential"
  | "pricing"
  | "buyers"
  | "agents"
  | "services"
  | "other-residential-services"
  | "service-area";

export type FaqParagraph =
  | string
  | Readonly<{
      text: string;
      requiredRoutes: readonly SiteRouteKey[];
      routeMatch?: "all" | "any";
    }>;

export type FaqReadinessRequirement =
  | Readonly<{ kind: "workflow"; key: WorkflowKey }>
  | Readonly<{
      kind: "service";
      keys: readonly ServiceReadinessKey[];
    }>
  | Readonly<{ kind: "geography"; key: GeographyReadinessKey }>;

export type FaqAnswer =
  | readonly FaqParagraph[]
  | Readonly<{
      production: readonly FaqParagraph[];
      development: readonly FaqParagraph[];
      requirements: readonly FaqReadinessRequirement[];
    }>;

export type FaqVariant = Readonly<{
  question: string;
  answer: FaqAnswer;
  requiredRoutes?: readonly SiteRouteKey[];
  routeMatch?: "all" | "any";
}>;

export type FaqCatalogEntry = Readonly<{
  default: FaqVariant;
  contexts?: Partial<Record<FaqContext, FaqVariant>>;
  master?: Readonly<{
    category: FaqCategoryId;
    order: number;
  }>;
}>;

const introductoryHousePrice =
  pricingContent.quickAnswer.house.introductory.amount;
const standardHousePrice = pricingContent.quickAnswer.house.standard.amount;
const baseHouseCoverage = pricingContent.quickAnswer.house.scope.match(
  /[0-9,]+ square feet/,
)?.[0];
const manualReviewArea = pricingContent.manualReview.items[0].match(
  /[0-9,]+ square feet/,
)?.[0];
const cancellationTerms = pricingContent.otherCharges.groups.find(
  (group) => group.title === "Cancellation or rescheduling",
);

if (!baseHouseCoverage || !manualReviewArea || !cancellationTerms) {
  throw new Error("An authoritative Pricing scope value is missing.");
}

function firstMoneyValue(source: string): string {
  const value = source.match(/\$[0-9,]+/)?.[0];

  if (!value) {
    throw new Error("An authoritative Pricing monetary value is missing.");
  }

  return value;
}

const lateCancellationMaximum = firstMoneyValue(cancellationTerms.items[1]);
const sameDayCancellationMaximum = firstMoneyValue(cancellationTerms.items[2]);
const cancellationNoticePeriod = cancellationTerms.items[0].match(
  /[0-9]+ hours?/,
)?.[0];

if (!cancellationNoticePeriod) {
  throw new Error("The authoritative cancellation-notice period is missing.");
}

export const faqCatalog = {
  "inspection-price": {
    master: { category: "booking-pricing", order: 1 },
    default: {
      question: "How much does a home inspection cost?",
      answer: [
        showIntroductoryPricing()
          ? `A full residential inspection begins at ${introductoryHousePrice} during the introductory period and ${standardHousePrice} at the standard rate through ${baseHouseCoverage} of total inspected main-building floor area.`
          : `A full residential inspection begins at ${standardHousePrice} at the standard rate through ${baseHouseCoverage} of total inspected main-building floor area.`,
        "Larger homes, condominiums, additional units or structures, and optional services use the published adjustments. Enter the property details in Price & Availability to see the property-specific quote.",
        travelCopy.confirmation,
      ],
    },
    contexts: {
      home: {
        question: "How much does a home inspection cost?",
        answer: {
          requirements: [{ kind: "workflow", key: "buyerTransaction" }],
          production: [
            showIntroductoryPricing()
          ? `Residential inspections begin at ${introductoryHousePrice} during the introductory period and ${standardHousePrice} at the standard rate through ${baseHouseCoverage} of total inspected main-building area.`
          : `Residential inspections begin at ${standardHousePrice} at the standard rate through ${baseHouseCoverage} of total inspected main-building floor area.`,
            "Larger homes, condominiums, and additional units or structures use the published adjustments. Enter the property details to see the applicable price.",
          ],
          development: [
            showIntroductoryPricing()
          ? `Residential inspections begin at ${introductoryHousePrice} during the introductory period and ${standardHousePrice} at the standard rate through ${baseHouseCoverage} of total inspected main-building area.`
          : `Residential inspections begin at ${standardHousePrice} at the standard rate through ${baseHouseCoverage} of total inspected main-building floor area.`,
            "Larger homes, condominiums, and additional units or structures use the published adjustments. Enter the property details in Price & Availability to see the property-specific quote.",
          ],
        },
      },
    },
  },
  "main-building-square-footage": {
    master: { category: "booking-pricing", order: 2 },
    default: {
      question: "What square footage should I enter?",
      answer: [
        "Use the total reasonably available floor area of the primary building, including finished and unfinished basement areas.",
        "Do not include garages, porches, decks, sheds, detached accessory structures, or detached dwellings. Those are handled separately.",
      ],
    },
    contexts: {
      home: {
        question: "What square footage should I enter?",
        answer: {
          requirements: [{ kind: "workflow", key: "buyerTransaction" }],
          production: [
            "Use the total reasonably available floor area of the primary building, including finished and unfinished basement areas.",
            "Do not include garages, porches, decks, sheds, detached accessory structures, or detached dwellings in that total. Those are handled separately.",
            "Select unknown when a technical property detail is not reasonably available. Rivermark may review the request before confirming the scope and price.",
          ],
          development: [
            "Use the total reasonably available floor area of the primary building, including finished and unfinished basement areas.",
            "Do not include garages, porches, decks, sheds, detached accessory structures, or detached dwellings in that total. Those are handled separately.",
            "If a property detail is uncertain, do not guess. Choose Help with a property or quote on Contact when that uncertainty affects the scope or price.",
          ],
        },
      },
      pricing: {
        question: "What square footage should I enter?",
        answer: [
          "Enter the total reasonably available floor area of the primary building, including finished and unfinished basement space.",
          "Do not include garages, porches, decks, sheds, detached accessory structures, or detached dwellings in that number.",
        ],
      },
    },
  },
  "unknown-property-detail": {
    master: { category: "booking-pricing", order: 3 },
    default: {
      question: "What if I do not know a property detail?",
      answer: [
        "Give the best information reasonably available. Choose unknown where offered; otherwise ask Rivermark about a detail you cannot confirm.",
        "Rivermark may then review the request before confirming the scope and price rather than requiring you to guess at a technical detail. Choose Help with a property or quote on Contact when the uncertainty affects the scope or price; unknown property details are welcome.",
      ],
    },
    contexts: {
      pricing: {
        question:
          "What happens if I do not know the square footage or ownership form?",
        answer: [
          "Provide the best information reasonably available. If square footage or ownership form is uncertain, ask Rivermark for help with the property before relying on a quote.",
          "Rivermark may review the request before confirming the scope and price rather than making you guess at a technical detail.",
        ],
      },
    },
  },
  "manual-review": {
    master: { category: "booking-pricing", order: 4 },
    default: {
      question: "When does a property need individual review?",
      answer: [
        "A person reviews the property details when the assignment needs a different scope, more time, or special access or travel planning. That review determines the appropriate scope, price, and appointment fit.",
        `Common triggers include more than ${manualReviewArea}, multiple units or buildings, detached dwellings, outer territory, significant access restrictions, mixed use, unusual services, or extensive document review. Choose Help with a property or quote in the Contact form and share what you know.`,
      ],
    },
    contexts: {
      home: {
        question: "What happens when the property is unusual?",
        answer: {
          requirements: [{ kind: "workflow", key: "buyerTransaction" }],
          production: [
            "You can still submit the property information.",
            "Assignments involving large properties, multiple dwelling units, detached dwellings, complex additional structures, unusual access, document-heavy work, or nonstandard service requests may be routed to manual review.",
            "That review allows Rivermark to reserve the right amount of time and provide an accurate scope and price rather than forcing the property into the wrong appointment.",
          ],
          development: [
            "Choose Help with a property or quote in the Contact form to describe an unusual property or assignment.",
            "Large properties, multiple units or buildings, unusual access, and nonstandard requests may need individual review.",
            "Review establishes the appropriate scope, price, and time needed before an appointment can be accepted.",
          ],
        },
      },
      residential: {
        question: `What happens when the home is larger than ${manualReviewArea}?`,
        answer: [
          `Properties above ${manualReviewArea} require individual review to determine the appropriate scope, price, and time for the inspection, walkthrough, and report.`,
          "A review request does not guarantee that a particular appointment will be accepted.",
        ],
      },
      agents: {
        question: "How are unusual properties handled?",
        answer: {
          requirements: [{ kind: "workflow", key: "buyerTransaction" }],
          production: [
            "The normal Price & Availability route collects the property information.",
            "Large, multi-unit, multi-building, outer-area, access-restricted, mixed-use, or otherwise complex assignments may route to manual review so Rivermark can set the correct scope, price, and schedule.",
          ],
          development: [
            "Choose Help with a property or quote in the Contact form for a large, multi-unit, multi-building, outlying, access-restricted, mixed-use, or otherwise complex assignment.",
            "Rivermark reviews the details to determine the appropriate scope, price, and appointment fit. A request does not reserve an appointment.",
          ],
        },
      },
      "other-residential-services": {
        question: "When is manual review required?",
        answer: [
          "Manual review may apply to large properties, multiple units, several structures, detached dwellings, outer territory, access restrictions, unusual use, document-heavy work, or a scope that does not fit the standard service definition.",
        ],
      },
    },
  },
  "agent-start": {
    master: { category: "booking-pricing", order: 5 },
    default: {
      question: "Can an agent start the booking for a buyer?",
      answer: {
        requirements: [{ kind: "workflow", key: "agentStart" }],
        production: [
          "Yes, when the configured Spectora workflow supports a clean buyer-completion process.",
          "The buyer or other contracting client should normally review the services and price, accept the agreement and report-use terms, complete the required payment step, and receive the final confirmation.",
        ],
        development: [
          "Agent-start booking is not currently available. Share Price & Availability with the client or contact Rivermark for coordination help.",
          "The buyer or other contracting client normally remains responsible for reviewing the services and price, accepting the agreement and report-use terms, and payment.",
        ],
      },
    },
    contexts: {
      agents: {
        question: "Can I start the booking for my client?",
        answer: {
          requirements: [{ kind: "workflow", key: "agentStart" }],
          production: [
            "Yes, when the configured Spectora workflow supports a clean buyer-completion process.",
            "The buyer should normally review the services and price, accept the agreement and report-use terms, complete the required payment step, and receive the final confirmation.",
          ],
          development: [
            "Agent-start booking is not currently available. Share Price & Availability with the client or contact Rivermark for coordination help.",
            "The buyer normally remains responsible for reviewing the services and price, accepting the agreement and report-use terms, and payment.",
          ],
        },
      },
    },
  },
  "appointment-confirmation": {
    master: { category: "booking-pricing", order: 6 },
    default: {
      question: "When is an appointment actually confirmed?",
      answer: {
        requirements: [{ kind: "workflow", key: "buyerTransaction" }],
        production: [
          "A quote, selected time, or submitted order may still require agreement acceptance, payment, client completion, or Rivermark review.",
          "The appointment is confirmed when the authoritative Spectora order shows the required steps are complete and the confirmation communication has been issued.",
        ],
        development: [
          "A quote, selected time, or submitted order is not necessarily a confirmed appointment. Agreement acceptance, payment, client completion, or Rivermark review may still be required.",
          "This website does not confirm appointments. Contact Rivermark if the appointment status or remaining steps are unclear.",
        ],
      },
    },
  },
  "payment-due": {
    master: { category: "booking-pricing", order: 7 },
    default: {
      question: "When is payment due?",
      answer: {
        requirements: [
          { kind: "workflow", key: "agreementPaymentRoles" },
        ],
        production: [
          "Rivermark secures the agreement and payment method during booking. Payment is due no later than the start of fieldwork.",
          "Multi-visit standalone services are paid before the first visit. No routine deposit is planned at launch.",
        ],
        development: [
          "Payment is due no later than the start of fieldwork. Multi-visit standalone services are paid before the first visit; no routine deposit is planned.",
          "Online agreement acceptance and payment are not currently available through this website. Contact Rivermark about the requirements for your assignment.",
        ],
      },
    },
  },
  "cancellation-rescheduling": {
    master: { category: "booking-pricing", order: 8 },
    default: {
      question: "What is the cancellation or rescheduling policy?",
      answer: [
        `With at least ${cancellationNoticePeriod}' notice, there is no charge. With less than ${cancellationNoticePeriod}, Rivermark may charge up to ${lateCancellationMaximum}.`,
        `A same-day cancellation, no-show, denied access, or cancellation after travel begins may be charged up to ${sameDayCancellationMaximum}. Reasonable grace remains discretionary, and work already completed remains earned.`,
      ],
    },
  },
  "inspection-attendance": {
    master: { category: "inspection-day", order: 9 },
    default: {
      question: "Can I attend the inspection?",
      answer: [
        "Yes. Clients may attend all or part of the inspection.",
        "Reasonable questions are welcome, but the inspector needs uninterrupted periods for technical work, documentation, and safety.",
      ],
    },
    contexts: {
      home: {
        question: "Can I attend the inspection?",
        answer: [
          "Yes. Clients may attend all or part of the inspection.",
          "Your inspector will need uninterrupted periods to work methodically and document the property. Clients who do not attend throughout are encouraged to join for approximately the final 45–60 minutes for the prioritized walkthrough.",
        ],
      },
      residential: {
        question: "Can I attend?",
        answer: [
          "Yes. Clients may attend all or part of the inspection.",
          "Your inspector will need uninterrupted periods to work methodically and safely. Clients who do not attend throughout are encouraged to join for approximately the final 45–60 minutes.",
        ],
      },
      buyers: {
        question: "Can I attend the entire inspection?",
        answer: [
          "Yes. Buyers may attend all or part of the inspection.",
          "The inspector needs uninterrupted periods for technical work and safety. Questions may be answered as the inspection progresses or held for the prioritized walkthrough.",
        ],
      },
      agents: {
        question: "Can the buyer attend?",
        answer: [
          "Yes. The buyer may attend all or part of the inspection.",
          "Clients who do not attend throughout are encouraged to join for approximately the final 45–60 minutes.",
        ],
      },
    },
  },
  "inspection-duration": {
    master: { category: "inspection-day", order: 10 },
    default: {
      question: "How long does the inspection take?",
      answer: {
        requirements: [{ kind: "workflow", key: "buyerTransaction" }],
        production: [
          "Timing depends on the property's size, configuration, condition, number of units, additional structures, access, and ordered services.",
          "The confirmation provides a property-specific estimate. It is not a guaranteed departure time.",
        ],
        development: [
          "Timing depends on the property's size, configuration, condition, number of units, additional structures, access, and ordered services.",
          "Confirm a property-specific time estimate with Rivermark. It is not a guaranteed departure time.",
        ],
      },
    },
    contexts: {
      home: {
        question: "How long should I plan for?",
        answer: {
          requirements: [{ kind: "workflow", key: "buyerTransaction" }],
          production: [
            "Appointment time depends on the property's size, configuration, number of units, additional buildings, access, and ordered services.",
            "Your confirmation will include a property-specific estimate. That estimate is not a guaranteed departure time because significant conditions, access problems, weather, or inaccurate property information may change the schedule.",
          ],
          development: [
            "Appointment time depends on the property's size, configuration, number of units, additional buildings, access, and ordered services.",
            "Confirm a property-specific time estimate with Rivermark. It is not a guaranteed departure time.",
          ],
        },
      },
      residential: {
        question: "How long does the inspection take?",
        answer: {
          requirements: [{ kind: "workflow", key: "buyerTransaction" }],
          production: [
            "Timing depends on the home's size, configuration, number of units, additional structures, access, condition, and ordered services.",
            "Your confirmation will include a property-specific estimate. It is not a guaranteed departure time because the inspection may take longer when the conditions or access warrant it.",
          ],
          development: [
            "Timing depends on the home's size, configuration, number of units, additional structures, access, condition, and ordered services.",
            "Confirm a property-specific time estimate with Rivermark. It is not a guaranteed departure time.",
          ],
        },
      },
      buyers: {
        question: "How long will the inspection take?",
        answer: {
          requirements: [{ kind: "workflow", key: "buyerTransaction" }],
          production: [
            "The time depends on the property's size, configuration, condition, access, number of units, additional buildings, and ordered services.",
            "Your confirmation will provide a property-specific estimate. It is not a guaranteed departure time.",
          ],
          development: [
            "The time depends on the property's size, configuration, condition, access, number of units, additional buildings, and ordered services.",
            "Confirm a property-specific time estimate with Rivermark. It is not a guaranteed departure time.",
          ],
        },
      },
    },
  },
  "walkthrough-arrival": {
    master: { category: "inspection-day", order: 11 },
    default: {
      question: "When should I arrive for the final walkthrough?",
      answer: [
        "Clients who do not attend throughout are encouraged to plan for approximately the final 45–60 minutes.",
        "The fieldwork may run longer or shorter than estimated, so remain reachable for an updated arrival message.",
      ],
    },
    contexts: {
      buyers: {
        question: "When should I arrive for the walkthrough?",
        answer: [
          "Clients who are not attending throughout are encouraged to plan for approximately the final 45–60 minutes.",
          "Because the fieldwork may run longer or shorter than estimated, stay reachable for an updated arrival message.",
        ],
      },
    },
  },
  "roof-walking": {
    master: { category: "inspection-day", order: 12 },
    default: {
      question: "Does Rivermark walk every roof?",
      answer: [
        "Roof access depends on the conditions at the property.",
        "Rivermark may walk a roof when the material, slope, height, access, weather, surface condition, fall risk, and potential for property damage make it reasonable. Otherwise, the roof is observed from the best useful available vantage points and the limitation is documented.",
      ],
    },
    contexts: {
      residential: {
        question: "Does Rivermark walk every roof?",
        answer: [
          "Roof access depends on the conditions at the property.",
          "Rivermark may walk a roof when the material, slope, height, access, weather, surface condition, fall risk, and potential for property damage make walking reasonable. Otherwise, the roof is evaluated from the best useful available vantage points and the limitation is documented.",
        ],
      },
    },
  },
  "inaccessible-area": {
    master: { category: "inspection-day", order: 13 },
    default: {
      question: "What happens when an area is inaccessible?",
      answer: [
        "Rivermark documents the material limitation and uses another useful vantage point when possible.",
        "An inaccessible area is not assumed satisfactory. Further access or evaluation may be recommended when the limitation matters.",
      ],
    },
    contexts: {
      residential: {
        question: "What happens when an area is inaccessible?",
        answer: [
          "Rivermark documents material access limitations and evaluates the area from another useful vantage point when possible.",
          "The report does not assume that an inaccessible component is satisfactory. When the limitation matters, Rivermark may recommend obtaining access or arranging further evaluation.",
        ],
      },
      buyers: {
        question: "What happens when an area is inaccessible?",
        answer: [
          "The limitation is documented, and the area is observed from another useful vantage point when possible.",
          "Rivermark does not assume that an inaccessible area is satisfactory. Further access or evaluation may be recommended when the limitation matters.",
        ],
      },
    },
  },
  "weather-limitations": {
    master: { category: "inspection-day", order: 14 },
    default: {
      question: "What happens when weather limits the inspection?",
      answer: [
        "Snow, ice, rain, wind, frozen ground, standing water, extreme temperatures, and unsafe surfaces may limit roofs, grading, drainage, exterior components, cooling systems, decks, and other areas.",
        "The limitation is documented. At launch, Rivermark intends to include one qualifying limited complimentary return when a materially important component was unavailable solely because of legitimate weather or seasonal conditions. The return addresses that component and produces a brief supplement; it is not a second full inspection. Utilities, access, and preparation failures do not qualify.",
      ],
    },
  },
  "report-timing": {
    master: { category: "reports-support", order: 15 },
    default: {
      question: "When will I receive the report?",
      answer: [
        "Rivermark prioritizes prompt delivery after reviewing the photographs, notes, measurements, and findings for a useful, accurate report.",
        "Timing depends on the property, selected services, complexity, appointment timing, and review needed. Confirm timing for your assignment with Rivermark.",
      ],
    },
  },
  "same-day-report": {
    master: { category: "reports-support", order: 16 },
    default: {
      question: "Does Rivermark guarantee a same-day report?",
      answer: [
        "No. Same-day or next-morning delivery is not guaranteed.",
        "Report timing depends on the assignment and the review needed to provide a useful, accurate report.",
      ],
    },
    contexts: {
      agents: {
        question: "Does Rivermark promise same-day reports?",
        answer: [
          "No. Same-day or next-morning delivery is not guaranteed.",
          "Report timing depends on the assignment and the review needed to provide a useful, accurate report.",
        ],
      },
    },
  },
  "written-report-controls": {
    master: { category: "reports-support", order: 17 },
    default: {
      question: "Which controls—the onsite explanation or the written report?",
      answer: [
        "Use the delivered written report as the inspection record. Any later correction or addendum is documented separately and dated.",
        "Onsite explanations remain preliminary until the inspector reviews the photographs, notes, measurements, equipment information, and related observations. A material change from an onsite explanation should be communicated.",
      ],
    },
  },
  "report-authorization": {
    master: { category: "reports-support", order: 18 },
    default: {
      question: "Who can receive the report?",
      answer: {
        requirements: [{ kind: "workflow", key: "reportPermissions" }],
        production: [
          "The contracting client controls ordinary report authorization and sharing, subject to the executed agreement and final Spectora settings.",
          "An agent who schedules or coordinates the inspection does not automatically become the client or gain sole report access or reliance rights.",
        ],
        development: [
          "Report sharing requires the contracting client's authorization and is subject to the agreement. Contact Rivermark to confirm the intended recipients.",
          "Coordinating an appointment does not make an agent the client or grant sole report access or reliance rights. Do not assume a portal-sharing arrangement is available before it is confirmed.",
        ],
      },
    },
    contexts: {
      buyers: {
        question: "Who can see the report?",
        answer: [
          "The client named in the inspection agreement controls ordinary report authorization and sharing, subject to that agreement. Contact Rivermark to confirm the intended recipients.",
          "An agent's involvement in scheduling does not automatically create report ownership or third-party reliance rights.",
        ],
      },
      agents: {
        question: "Who receives the report?",
        answer: {
          requirements: [{ kind: "workflow", key: "reportPermissions" }],
          production: [
            "The contracting client controls ordinary report authorization and sharing, subject to the agreement and Spectora settings.",
            "An agent does not automatically gain sole access or reliance rights by scheduling the appointment.",
          ],
          development: [
            "Report sharing requires the contracting client's authorization and is subject to the agreement. Contact Rivermark to confirm the intended recipients.",
            "Coordinating an appointment does not grant sole report access or reliance rights. Do not assume a portal-sharing arrangement is available before it is confirmed.",
          ],
        },
      },
    },
  },
  "post-report-support": {
    master: { category: "reports-support", order: 19 },
    default: {
      question: "What support is included after the report?",
      answer: [
        "Approximately 30 calendar days of reasonable report-related email support are included for the original client.",
        "Rivermark may clarify a finding, priority, limitation, or appropriate specialist type. The support does not include unlimited consultation, contractor management, repeated bid review, new-condition diagnosis, or another site visit.",
        "A full buyer inspection, including an applicable condominium buyer inspection, also includes a home-specific systems and maintenance packet and one short scheduled remote explanation session when requested after taking possession. This is separate from the report-related email support period, so later possession does not remove the benefit. Standalone tests, limited consultations, seller inspections and follow-up visits do not automatically include it.",
      ],
    },
  },
  "repair-estimates-negotiation": {
    master: { category: "reports-support", order: 20 },
    default: {
      question: "Does Rivermark provide repair estimates or negotiation advice?",
      answer: [
        "No. Rivermark does not prepare repair estimates, construction bids, repair demands, concession recommendations, or negotiation strategy.",
        "The report may identify the type of qualified professional to consider and whether prompt or near-term attention appears warranted.",
      ],
    },
    contexts: {
      home: {
        question: "Does Rivermark provide repairs or repair estimates?",
        answer: [
          "No.",
          "Rivermark does not use inspections to sell repair work, prepare construction bids, or provide contractor pricing.",
          "The report may identify the appropriate type of professional to consider for further evaluation or work, but contractor selection and repair decisions remain with the client.",
        ],
      },
      buyers: {
        question: "Can Rivermark estimate repairs?",
        answer: [
          "No. Rivermark does not prepare repair estimates, construction bids, or contractor pricing from the inspection findings.",
          "The report may identify the type of qualified professional to consider.",
        ],
      },
      agents: {
        question: "Does Rivermark provide repair estimates?",
        answer: [
          "No. Rivermark does not prepare repair estimates, contractor bids, or construction pricing from inspection findings.",
          "The report may identify the appropriate type of professional to consider.",
        ],
      },
      services: {
        question: "Does Rivermark provide repair estimates?",
        answer: [
          "No. Rivermark does not prepare construction bids, repair estimates, or contractor pricing from inspection findings.",
          "The report may identify the appropriate type of professional to consider.",
        ],
      },
    },
  },
  "radon-sewer-boundary": {
    master: { category: "services-property-types", order: 21 },
    default: {
      question:
        "Are radon testing and a sewer scope included in the home inspection?",
      requiredRoutes: ["radonTesting", "sewerScope"],
      routeMatch: "all",
      answer: [
        "No. They are separately contracted services because they answer questions the visual home inspection cannot answer.",
        "Radon testing measures conditions at the property under a defined procedure. A sewer scope uses a camera to observe the accessible portion of one primary building sewer.",
      ],
    },
    contexts: {
      buyers: {
        question: "Should I order radon testing or a sewer scope?",
        requiredRoutes: ["radonTesting", "sewerScope"],
        routeMatch: "all",
        answer: [
          "They answer questions the visual inspection cannot answer.",
          "Whether either service fits depends on the property, access, your objectives, and the transaction. Rivermark explains the scope without treating every add-on as mandatory.",
        ],
      },
      services: {
        question: "Can radon testing or a sewer scope be ordered separately?",
        requiredRoutes: ["radonTesting", "sewerScope"],
        routeMatch: "all",
        answer: [
          "Yes, when the service is active and the property, access, timing, and service requirements fit.",
          "Standalone pricing is higher because it creates a separate appointment and operating workflow.",
        ],
      },
      "other-residential-services": {
        question: "Can radon or sewer be added to a consultation?",
        requiredRoutes: ["radonTesting", "sewerScope"],
        routeMatch: "all",
        answer: [
          "Not as a packaged add-on. They remain separately booked and contracted services.",
        ],
      },
    },
  },
  "thermal-imaging-boundary": {
    master: { category: "services-property-types", order: 22 },
    default: {
      question: "Is thermal imaging included?",
      requiredRoutes: ["thermalImaging"],
      answer: [
        "Targeted camera use may be included at the inspector's discretion when it provides useful context during a full inspection.",
        "A systematic whole-home scan or separate thermal deliverable is not included unless a paid thermal service is active and separately contracted.",
      ],
    },
  },
  "condominium-townhome": {
    master: { category: "services-property-types", order: 23 },
    default: {
      question: "How are condominiums and townhomes handled?",
      answer: [
        "Condominium-form properties use condominium scope and pricing focused on the contracted unit, systems directly serving it, and accessible exclusive-use components.",
        "Fee-simple townhomes use house scope and house pricing. The ownership form matters more than the building's exterior appearance.",
      ],
    },
    contexts: {
      residential: {
        question: "How are condominiums and townhomes handled?",
        answer: [
          "Condominium-form properties use condominium scope and pricing. The inspection focuses on the contracted unit, systems directly serving it, and accessible exclusive-use components.",
          "Fee-simple townhomes normally use house scope and house pricing.",
          "The ownership form matters more than whether the property looks like a townhouse from the outside.",
        ],
      },
      services: {
        question: "Does Rivermark inspect condominiums?",
        answer: [
          "Yes. Condominium-form properties use condominium scope and pricing focused on the contracted unit, systems directly serving it, and accessible exclusive-use components.",
          "Fee-simple townhomes use house scope and house pricing.",
        ],
      },
      "other-residential-services": {
        question: "What is included in a condominium inspection?",
        answer: [
          "The inspection focuses on the contracted unit, systems directly serving it, and accessible exclusive-use components.",
          "Association-owned common systems, finances, reserves, insurance, and governing documents are not comprehensively evaluated.",
        ],
      },
    },
  },
  "multi-unit-property": {
    master: { category: "services-property-types", order: 24 },
    default: {
      question:
        "Does Rivermark inspect duplexes, triplexes, and four-unit properties?",
      answer: {
        requirements: [
          { kind: "service", keys: ["otherResidentialServices"] },
        ],
        production: [
          "Yes, when the property remains within Rivermark's qualifying residential scope.",
          "Every contracted unit and applicable common area is inspected rather than sampled. More than four units or material mixed use requires separate review.",
        ],
        development: [
          "Qualifying duplexes, triplexes, and four-unit properties may fit the residential inspection scope. Contact Rivermark to confirm service availability and the assignment.",
          "Every contracted unit and applicable common area will be inspected rather than sampled. More than four units or material mixed use requires separate review.",
        ],
      },
    },
    contexts: {
      services: {
        question: "Does Rivermark inspect duplexes and other multi-unit properties?",
        answer: [
          "Rivermark may inspect qualifying one-to-four-unit residential properties.",
          "Every contracted unit and applicable common area is inspected rather than using representative sampling. Additional-unit pricing applies.",
        ],
      },
      "other-residential-services": {
        question:
          "Does Rivermark inspect duplexes, triplexes, and four-unit properties?",
        answer: {
          requirements: [
            { kind: "service", keys: ["otherResidentialServices"] },
          ],
          production: [
            "Yes, when the property remains within Rivermark's qualifying residential scope.",
            "Every contracted unit and applicable common area is inspected. More than four units or material mixed use requires separate review.",
          ],
          development: [
            "Qualifying duplexes, triplexes, and four-unit properties may fit the residential inspection scope. Contact Rivermark to confirm service availability and the assignment.",
            "Every contracted unit and applicable common area is inspected. More than four units or material mixed use requires separate review.",
          ],
        },
      },
    },
  },
  "full-inspection-consultation": {
    master: { category: "services-property-types", order: 25 },
    default: {
      question:
        "What is the difference between a full inspection and a consultation?",
      answer: [
        "A full inspection uses broad residential-system scope and produces a full report.",
        "A consultation is limited by time and purpose, addresses selected visible concerns, and produces a concise summary. It is not a discounted full inspection.",
      ],
    },
    contexts: {
      services: {
        question:
          "What is the difference between a full inspection and a consultation?",
        answer: [
          "A full inspection uses broad residential-system scope and produces a full report.",
          "A consultation is limited by time and purpose, covers selected visible concerns, and produces a concise summary. It is not a cheaper version of the full inspection.",
        ],
      },
    },
  },
  "new-construction-availability": {
    master: { category: "services-property-types", order: 26 },
    default: {
      question: "Are new-construction inspections available?",
      answer: {
        requirements: [
          { kind: "workflow", key: "newConstructionInterest" },
        ],
        production: [
          "Not currently. Pre-drywall, final new-construction, and 11-month builder-warranty inspections are Not Currently Scheduling.",
          "The information page explains the planned stages and includes a no-obligation interest form that does not create a booking or promise an activation date.",
        ],
        development: [
          "Not currently. Pre-drywall, final new-construction, and 11-month builder-warranty inspections are Not Currently Scheduling.",
          "Use the New Construction interest form to share your interest. This does not create a booking or reserve a date.",
        ],
      },
    },
    contexts: {
      services: {
        question: "Does Rivermark inspect new construction?",
        answer: {
          requirements: [
            { kind: "workflow", key: "newConstructionInterest" },
          ],
          production: [
            "Not yet. Pre-drywall, final new-construction, and 11-month builder-warranty inspections are Not Currently Scheduling.",
            "You may review the planned approach and submit a no-obligation interest form.",
          ],
          development: [
            "Not yet. Pre-drywall, final new-construction, and 11-month builder-warranty inspections are Not Currently Scheduling.",
            "Use the New Construction interest form to share your interest. This does not create a booking or reserve a date.",
          ],
        },
      },
    },
  },
  "professional-scope-boundary": {
    master: { category: "scope-limitations-service-area", order: 27 },
    default: {
      question:
        "Is the inspection a code inspection, engineering evaluation, appraisal, or warranty?",
      answer: [
        "No. A Rivermark home inspection is not engineering or structural certification, municipal code approval, an appraisal, a repair estimate, or a warranty.",
        "It is a visual, non-invasive evaluation of visible and reasonably accessible residential systems and components under the conditions present on the inspection date.",
      ],
    },
    contexts: {
      residential: {
        question: "Does Rivermark inspect for code compliance?",
        answer: [
          "The inspection is not a municipal code inspection, complete compliance audit, permit review, or approval.",
          "Rivermark may explain that an observed condition appears improper, unsafe, deteriorated, or inconsistent with accepted residential practice. A specific code reference may occasionally be useful when the applicable facts and jurisdiction can be verified, but code certification is not part of the service.",
        ],
      },
      buyers: {
        question: "What is the difference between an inspection and an appraisal?",
        answer: [
          "A home inspection evaluates visible and reasonably accessible property conditions within the agreed scope.",
          "An appraisal develops an opinion of value for a different purpose. Rivermark does not provide appraisals or property-value opinions.",
        ],
      },
    },
  },
  "hidden-defects": {
    master: { category: "scope-limitations-service-area", order: 28 },
    default: {
      question: "Does the inspection guarantee that every hidden defect will be found?",
      answer: [
        "No. A home inspection cannot prove that every concealed, intermittent, latent, or future condition was found.",
        "Rivermark documents visible evidence, material limitations, and the need for further evaluation when the inspection cannot determine more.",
      ],
    },
  },
  "specialist-referral": {
    master: { category: "scope-limitations-service-area", order: 29 },
    default: {
      question: "What happens when another specialist is needed?",
      answer: [
        "Rivermark may identify the appropriate type of specialist, such as a structural engineer, plumber, electrician, chimney professional, WDI inspector, environmental professional, well or septic specialist, or appraiser.",
        "Rivermark does not guarantee provider work, require a specific provider, collect a referral fee, or use inspection findings to generate repair work.",
      ],
    },
  },
  "service-area-travel": {
    master: { category: "scope-limitations-service-area", order: 30 },
    default: {
      question: "Where does Rivermark work, and how do travel charges apply?",
      answer: {
        requirements: [
          { kind: "workflow", key: "buyerTransaction" },
          { kind: "geography", key: "serviceArea" },
        ],
        production: [
          "Rivermark serves Grand Rapids and surrounding West Michigan. Start with the property address to confirm coverage.",
          travelCopy.included, travelCopy.extended, travelCopy.byArrangement,
          travelCopy.exception, travelCopy.confirmation,
        ],
        development: [
          "Rivermark serves Grand Rapids and surrounding West Michigan. Start with the address and requested services to confirm coverage and travel.",
          travelCopy.included, travelCopy.extended, travelCopy.byArrangement,
          travelCopy.exception, travelCopy.confirmation,
        ],
      },
    },
  },
  "residential-inspection-inclusions": {
    default: {
      question: "What is included in a residential home inspection?",
      answer: [
        "The inspection covers the applicable visible and reasonably accessible residential systems and components under the conditions present on inspection day.",
        "That normally includes the site and exterior, roofing, visible structure, electrical, heating and cooling, plumbing, water heating, interior components, installed kitchen appliances, insulation, ventilation, garage components, alarms, pumps, and related residential systems.",
        "The exact scope depends on the property, access, utilities, safety, weather, and the final agreement.",
      ],
    },
  },
  "introductory-price-duration": {
    default: {
      question: "Is the introductory price permanent?",
      answer: [
        "No. The introductory schedule begins on the public-launch date and is planned to end six calendar months later unless Rivermark ends it earlier for future bookings.",
        "The standard price remains visible so the promotion is clear. Quotes accepted while the promotion applies remain honored when the property information and scope are materially accurate.",
      ],
    },
  },
  "automatic-age-surcharge": {
    default: {
      question: "Do older homes cost more automatically?",
      answer: [
        "No. Rivermark does not use an automatic age surcharge at launch.",
        "A property may still require manual review when its actual size, number of units, structures, access, systems, or other conditions materially change the assignment.",
      ],
    },
  },
  "online-quote-pricing-page": {
    default: {
      question: "Does the online quote replace the pricing page?",
      answer: [
        "No. This page explains the public price rules.",
        "Use Price & Availability for the property-specific Spectora quote. The official order and accepted agreement control the final price and scope.",
      ],
    },
  },
  "accepted-price-revision": {
    default: {
      question: "Can the price change at the property?",
      answer: [
        "Not because of a minor listing or assessor discrepancy.",
        "A material difference—such as substantially more square footage, another dwelling unit, additional structures, a different ownership form, or added services—may require a revised scope and price before the additional work proceeds.",
      ],
    },
  },
  "buyer-unable-to-attend": {
    default: {
      question: "What if I cannot attend?",
      answer: [
        "The inspection can proceed when lawful access and the other appointment requirements are in place.",
        "You receive the normal written report and a reasonable scheduled remote review. A second onsite walkthrough is not automatically included.",
      ],
    },
  },
  "agent-attendance": {
    default: {
      question: "Can my agent attend?",
      answer: [
        "Yes. An authorized agent may attend and participate in the walkthrough.",
        "The client remains central to the agreement, report, and inspection relationship.",
      ],
    },
  },
  "purchase-decision": {
    default: {
      question: "Does the inspector tell me whether to buy the house?",
      answer: [
        "No. Rivermark explains observed conditions, relative significance, limitations, and appropriate next steps.",
        "The purchase decision belongs to the buyer with advice from the buyer's own transaction, legal, financial, and other professionals.",
      ],
    },
  },
  "agreement-signer": {
    default: {
      question: "Who signs the agreement?",
      answer: {
        requirements: [
          { kind: "workflow", key: "agreementPaymentRoles" },
        ],
        production: [
          "The buyer or other contracting client normally signs the agreement.",
          "An agent exception is used only when authority, documentation, payment responsibility, report-use terms, insurer requirements, and the configured workflow support it.",
        ],
        development: [
          "The buyer or other contracting client normally signs the agreement. Online agreement acceptance is not currently available through this website.",
          "An agent cannot sign for a client merely because the agent coordinated the appointment. Any exception requires documented authority and confirmation from Rivermark.",
        ],
      },
    },
  },
  "payment-responsibility": {
    default: {
      question: "Who pays?",
      answer: {
        requirements: [
          { kind: "workflow", key: "agreementPaymentRoles" },
        ],
        production: [
          "The contracting client normally accepts payment responsibility.",
          "Another arrangement may be documented when it is lawful, clear, and supported by the final workflow, but an agent is not automatically responsible merely because the agent initiated scheduling.",
        ],
        development: [
          "The contracting client normally accepts payment responsibility.",
          "Any different arrangement must be documented and confirmed with Rivermark. Coordinating the appointment does not automatically make the agent responsible for payment.",
        ],
      },
    },
  },
  "agent-walkthrough-attendance": {
    default: {
      question: "Can I attend the walkthrough?",
      answer: [
        "Yes, when authorized by the client.",
        "The walkthrough is client-centered, prioritized, and normally planned around 30–45 minutes.",
      ],
    },
  },
  "repair-request-boundary": {
    default: {
      question: "Does Rivermark prepare repair requests?",
      answer: [
        "No. Rivermark explains technical findings and relative significance but does not draft repair demands, recommend concessions, or participate in negotiation strategy.",
      ],
    },
  },
  "listing-agent-findings": {
    default: {
      question: "Can the listing agent receive findings?",
      answer: [
        "Only with client authorization or when an apparent immediate safety or property-damage condition needs to be communicated to an appropriate responsible party.",
        "Rivermark does not provide an automatic separate buyer-findings presentation to the listing side.",
      ],
    },
  },
  "share-price-availability": {
    default: {
      question: "How can I share pricing and availability?",
      answer: [
        "Use the public Share Price & Availability action or copy the ordinary /price-availability/ link.",
        "The link contains no private customer or property information.",
      ],
    },
  },
  "homebuyer-service-selection": {
    default: {
      question: "Which service should a homebuyer choose?",
      answer: [
        "Choose the full Residential Home Inspection when you need broad evaluation of the property's visible and reasonably accessible residential systems and components.",
        {
          text: "Radon and sewer may be added separately when appropriate.",
          requiredRoutes: ["radonTesting", "sewerScope"],
          routeMatch: "all",
        },
      ],
    },
  },
  "detached-structures": {
    default: {
      question: "Are detached garages or guest houses included?",
      answer: [
        "One ordinary detached residential garage is included with a full inspection. One ordinary small accessible storage shed may receive a limited observation.",
        "A detached guest house or accessory dwelling receives separate dwelling-level scope and pricing. Additional or complex structures may require an adjustment or manual review.",
      ],
    },
    contexts: {
      "other-residential-services": {
        question: "Are detached garages and guest houses included?",
        answer: [
          "One ordinary detached residential garage is included with the full inspection.",
          "A detached guest house or accessory dwelling receives separate dwelling-level scope and pricing. Additional or complex structures may require review.",
        ],
      },
    },
  },
  "uncertain-service-fit": {
    default: {
      question: "What if I am not sure which service fits?",
      answer: {
        requirements: [{ kind: "workflow", key: "buyerTransaction" }],
        production: [
          "Submit the property through See Price & Availability or contact Rivermark with a concise description of the objective.",
          "Rivermark will not force a limited service into a situation that requires a full inspection or specialist evaluation.",
        ],
        development: [
          "Price & Availability connects directly to the secure Spectora quote experience. The Contact form handles both general questions and property help; choose Help with a property or quote for a nonstandard assignment.",
          "Rivermark will not force a limited service into a situation that requires a full inspection or specialist evaluation.",
        ],
      },
    },
  },
  "prelisting-vs-buyer": {
    default: {
      question: "Is a pre-listing inspection different from a buyer inspection?",
      answer: [
        "The technical foundation is the same broad residential inspection process.",
        "The client, purpose, questionnaire, sharing concerns, and follow-up needs differ. The seller's report is not softened.",
      ],
    },
  },
  "seller-report-candor": {
    default: {
      question: "Does Rivermark soften a seller's report?",
      answer: [
        "No. Valid findings are reported candidly and are not removed because the seller dislikes them or later completes work.",
        "Visible changes may be documented separately.",
      ],
    },
  },
  "maintenance-inspection": {
    default: {
      question: "What does a maintenance inspection provide?",
      answer: [
        "It provides a full residential inspection and a maintenance-planning emphasis for the current owner.",
        "The summary is designed to organize immediate concerns, professional needs, near-term maintenance, monitoring, and longer-term ownership planning.",
      ],
    },
  },
  "preoffer-consultation-scope": {
    default: {
      question: "Is a pre-offer consultation a full inspection?",
      answer: [
        "No. It is a time-limited visible-condition overview with a concise written summary.",
        "It does not automatically include the full residential inspection procedures or full report.",
      ],
    },
  },
  "consultation-upgrade": {
    default: {
      question: "Can a consultation be upgraded?",
      answer: {
        requirements: [{ kind: "workflow", key: "buyerTransaction" }],
        production: [
          "Yes, before or at the beginning of the appointment when the schedule, access, agreement, and payment requirements support the change.",
          "A completed consultation is a separate service and is not automatically credited toward a later full inspection.",
        ],
        development: [
          "An upgrade requires Rivermark's confirmation before or at the beginning of the appointment and sufficient time, access, agreement, and payment arrangements. The consultation fee is credited toward the full inspection when that change is accepted.",
          "A substantially completed consultation remains a separate service and is not retroactively relabeled as a full inspection.",
        ],
      },
    },
  },
  "repair-follow-up-boundary": {
    default: {
      question: "What does a Repair Follow-Up Visit establish?",
      answer: [
        "It documents the visible current condition of the specifically identified items.",
        "It does not certify hidden work, workmanship, permits, code compliance, invoices, warranties, or future performance.",
      ],
    },
  },
  "west-michigan-coverage": {
    default: {
      question: "Does Rivermark serve all of West Michigan?",
      answer: [
        "Rivermark serves a practical area across West Michigan, not the entire state. Confirm the property address, service, travel, number of visits, and schedule before relying on availability.",
      ],
    },
  },
  "grand-rapids-anchor": {
    default: {
      question: "Is Grand Rapids the only service area?",
      answer: [
        "Rivermark also serves surrounding West Michigan. Share the property address to confirm coverage; exact boundaries require confirmation.",
      ],
    },
  },
  "service-area-zone": {
    default: {
      question: "How do I know which zone applies?",
      answer: [
        travelCopy.locationReview, travelCopy.exception,
      ],
    },
  },
  "travel-charge-display": {
    default: {
      question: "Are travel charges included in the displayed price?",
      answer: [
        travelCopy.included, travelCopy.extended, travelCopy.byArrangement, travelCopy.confirmation,
      ],
    },
  },
  "multi-visit-travel": {
    default: {
      question: "Why can multi-visit work receive different travel treatment?",
      answer: [
        travelCopy.sharedVisits, travelCopy.radon, travelCopy.custom,
      ],
    },
  },
  "outer-area-acceptance": {
    default: {
      question: "Can Rivermark accept an outer-area property?",
      answer: [
        "Outlying properties are considered individually. Choose Help with a property or quote on Contact and share the address, requested services, access details and timing when known so Rivermark can assess the scope, travel, price and appointment fit.",
      ],
    },
  },
  "outer-area-reservation": {
    default: {
      question: "Does an outer-area request reserve an appointment?",
      answer: [
        "No. A manual-review request is not a confirmed appointment or acceptance of the assignment.",
      ],
    },
  },
} as const satisfies Record<string, FaqCatalogEntry>;

export type FaqId = keyof typeof faqCatalog;
