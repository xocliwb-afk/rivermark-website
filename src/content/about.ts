import type { GeographyReadinessCopy } from "@/config/geography-readiness";
import type { SiteRouteKey } from "@/config/routes";
import type { WorkflowCopy } from "@/config/workflows";

export type AboutPageLink = Readonly<{
  label: string;
  route: SiteRouteKey;
}>;

type AboutExpectation =
  | Readonly<{
      title: string;
      paragraphs: readonly string[];
    }>
  | Readonly<{
      title: string;
      workflow: "buyerTransaction";
      paragraphs: WorkflowCopy<readonly string[]>;
    }>;

export const aboutContent = {
  metadata: {
    title: "About Rivermark Home Inspections",
    description:
      "Meet Brandon Wilcox, founder and initial inspector at Rivermark, and learn how his residential background supports clear, independent home inspections.",
    openGraphTitle: "About Rivermark Home Inspections",
    openGraphDescription:
      "Clear judgment, practical residential experience, and an inspection process built around the client.",
  },
  hero: {
    eyebrow: "Independent residential inspection service",
    title: "About Rivermark Home Inspections",
    displaySubheading: "Clear Judgment. Practical Residential Experience.",
    paragraphs: [
      "Rivermark helps clients understand residential properties through methodical observation, calm explanation, useful prioritization, and independent judgment.",
      "The company is built around a simple standard: state serious conditions directly, keep routine maintenance in proportion, acknowledge real limitations, and explain what should happen next.",
    ],
    primaryAction: {
      label: "See Price & Availability",
      route: "priceAvailability",
    },
    secondaryAction: {
      label: "See What the Inspection Covers",
      route: "residentialHomeInspections",
    },
  },
  purpose: {
    eyebrow: "Why Rivermark Exists",
    title:
      "A useful inspection should create order—not a pile of disconnected comments.",
    introduction: [
      "A home can contain material concerns, ordinary wear, overdue maintenance, incomplete access, altered systems, and conditions that require another professional to determine more.",
      "Treating every observation as equally urgent is not useful. Neither is minimizing a serious condition because the transaction is stressful.",
      "Rivermark's approach is to help the client understand:",
    ],
    priorities: [
      "What materially matters",
      "What needs further professional evaluation",
      "What should be addressed soon",
      "What is routine maintenance",
      "What is lower priority",
      "What material limitations affected the inspection",
      "What questions still need to be resolved",
    ],
    closing:
      "The goal is a clear account of the visible condition, the important questions, and the limits of what the inspection could establish.",
  },
  expectations: {
    eyebrow: "From scope through follow-up",
    title: "What Customers Can Expect",
    items: [
      {
        title: "Clear scope",
        paragraphs: [
          "The service is explained before booking, including what is included, what is separately contracted, and what the inspection cannot determine.",
        ],
      },
      {
        title: "Transparent pricing",
        workflow: "buyerTransaction",
        paragraphs: {
          production: [
            "Standard pricing and adjustments are public. The property-specific transaction price is shown before a standard appointment is completed.",
          ],
          development: [
            "Standard pricing and adjustments are public. Enter the property details in Price & Availability to review the quote and available times.",
          ],
        },
      },
      {
        title: "Methodical work",
        paragraphs: [
          "The inspection uses a consistent, methodical process while allowing the sequence to adapt to the property, weather, access, occupancy, utilities, and safety.",
        ],
      },
      {
        title: "Buyer participation",
        paragraphs: [
          "Clients may attend all or part of the inspection. Reasonable questions are welcome, with uninterrupted periods protected for technical work.",
        ],
      },
      {
        title: "A prioritized walkthrough",
        paragraphs: [
          "The final review focuses on the conditions and limitations that deserve the most attention rather than reading every comment aloud.",
        ],
      },
      {
        title: "An organized report",
        paragraphs: [
          "The written report brings together relevant photographs, findings, next steps and inspection limitations after review. It takes precedence over preliminary onsite comments; later corrections or addenda are documented.",
        ],
      },
      {
        title: "Reasonable clarification",
        paragraphs: [
          "Approximately 30 calendar days of reasonable report-related email support are included for the original client.",
        ],
      },
      {
        title: "Inspection-only judgment",
        paragraphs: [
          "Rivermark does not use the inspection to sell repair work or steer customers into paid repair relationships.",
        ],
      },
    ] as const satisfies readonly AboutExpectation[],
  },
  background: {
    eyebrow: "Practical residential context",
    title: "Brandon's Residential Background",
    paragraphs: [
      "Rivermark was founded by Brandon Wilcox.",
      "His background includes residential construction, remodeling, repairs, building systems, property condition, homeowners, and tradespeople.",
      "That experience can support practical context. It can help him understand how visible components relate, explain why an observed condition matters, recognize when a specialist should take a closer look, and communicate with customers in ordinary language.",
    ],
    founderNote: {
      ownerWordingApproved: true,
      title: "A note from Brandon",
      reviewLabel: "Local candidate — owner wording review pending",
      paragraphs: [
        "I founded Rivermark as an independent home inspection company.",
        "My background includes residential construction, remodeling, repairs and building systems.",
        "That experience helps me explain visible conditions in plain language and recognize when another qualified professional should take a closer look.",
        "I don’t use inspection findings to sell or bid on repair work.",
      ],
      signature: "Brandon Wilcox, Founder",
    },
  },
  backgroundBoundary: {
    eyebrow: "Professional boundaries",
    title: "What That Background Does—and Does Not—Mean",
    introduction:
      "That experience supports practical observation and explanation. A home inspection is not:",
    exclusions: [
      "Engineering or structural certification",
      "Municipal code inspection or approval",
      "An appraisal or property-value opinion",
      "A repair estimate or construction bid",
      "Destructive investigation",
      "A warranty or guarantee",
      "Proof that every concealed, intermittent, latent, or future condition was found",
    ],
    closing:
      "When observed evidence exceeds the limits of a visual inspection, Rivermark may recommend evaluation by the appropriate qualified professional.",
  },
  independence: {
    eyebrow: "Independent by Design",
    title: "The company is separate from repair sales and transaction pressure.",
    introduction:
      "The inspection serves the client. Findings, recommendations and report permissions are kept separate from repair sales and referral pressure.",
    items: [
      "Use inspections to generate repair work",
      "Prepare construction bids from inspection findings",
      "Sell mitigation, warranties, insurance, security, or concierge products through the inspection",
      "Accept compensation for steering repair providers",
      "Soften findings to protect a transaction",
      "Let an agent or referral source control the report, priorities, or client relationship",
      "Inspect a transaction in which Brandon cannot remain independent",
    ],
    closing:
      "The client's need for accurate, proportionate information comes first.",
  },
  ownerOperated: {
    eyebrow: "Accountable standards",
    title: "A named inspector. Consistent standards.",
    paragraphs: [
      "Brandon is Rivermark's founder and initial inspector.",
      "Rivermark's service standards cover preparation, fieldwork, photographs, the walkthrough, report review and follow-up questions.",
      "Those standards also define how limitations are explained and how a factual correction or addendum is documented. You should be able to understand both the findings and the boundaries of the work.",
    ],
  },
  local: {
    eyebrow: "Local Context",
    title: "Home inspections in Grand Rapids and West Michigan.",
    paragraphs: {
      production: [
        "Start with the property address to check service in Grand Rapids and West Michigan.",
        "The location, requested services, travel, access and available schedule determine whether the assignment can be accepted.",
      ],
      development: [
        "Start with the property address to check service in Grand Rapids and West Michigan.",
        "Enter the address in Price & Availability, or request Manual Review for an outlying location. Rivermark needs to confirm coverage and any travel charges before an appointment is accepted.",
      ],
    } satisfies GeographyReadinessCopy<readonly string[]>,
    primaryAction: {
      label: "See Price & Availability",
      route: "priceAvailability",
    },
    supportingLinks: [
      {
        label: "Residential Home Inspections",
        route: "residentialHomeInspections",
      },
      { label: "View Pricing", route: "pricing" },
      { label: "View the Service Area", route: "serviceArea" },
    ],
  },
} as const;
