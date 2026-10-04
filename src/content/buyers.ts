import { showIntroductoryPricing } from "@/config/publication";
import type { SiteRouteKey } from "@/config/routes";
import type { WorkflowCopy } from "@/config/workflows";

export type BuyersPageLink = Readonly<{
  label: string;
  route: SiteRouteKey;
}>;

export type BuyersContentGroup = Readonly<{
  title: string;
  paragraphs: readonly string[];
}>;

type BuyersWorkflowStep = Readonly<{
  title: string;
  paragraphs: WorkflowCopy<readonly string[]>;
}>;

export const buyersContent = {
  metadata: {
    title: "Home Inspection Guide for Buyers | Rivermark",
    description:
      "Learn when to schedule, what to prepare, how inspection day works, what the walkthrough covers, and how Rivermark reports findings for West Michigan buyers.",
    openGraphTitle: "What Buyers Can Expect | Rivermark",
    openGraphDescription:
      "A clear guide to scheduling, attendance, the prioritized walkthrough, the written report, and post-report questions.",
  },
  hero: {
    eyebrow: "A practical guide for homebuyers",
    title: "What Buyers Can Expect",
    paragraphs: [
      "A home inspection should reduce confusion—not add another layer of it.",
      "Rivermark takes time to explain important findings, answer reasonable questions and help you understand the home's maintenance needs. The walkthrough gives you context; the written report gives you a record to return to.",
      "A full buyer inspection also includes a home-specific systems and maintenance packet for taking possession, plus one short scheduled remote explanation session when requested.",
      "You may attend all or part of the inspection and ask questions. An agent can help coordinate, while you remain the client responsible for the agreement and decisions about report sharing.",
    ],
    primaryAction: {
      label: "See Price & Availability",
      route: "priceAvailability",
    },
    secondaryAction: { label: "Explore the Inspection Scope", route: "residentialHomeInspections" },
    proofLine: "Clear process · Buyer participation · Independent findings",
  },
  process: {
    eyebrow: "The inspection process",
    title: "Know the sequence before the appointment begins.",
    steps: [
      {
        title: "Enter the property and service information",
        paragraphs: {
          production: [
            "Provide the address, property type, approximate inspected area, ownership form, additional buildings, requested services, and known access or utility limitations.",
          ],
          development: [
            "Provide the address, property type, approximate inspected area, ownership form, additional buildings, requested services, and known access or utility limitations.",
          ],
        },
      },
      {
        title: "Review the price and available times",
        paragraphs: {
          production: [
            "Enter the property details to review the quote and available appointment times.",
            "Large, unusual, multi-unit, multi-building, outer-area, or otherwise complex requests may route to manual review.",
          ],
          development: [
            "Use Price & Availability to enter the property details, review the quote, and see available appointment times. Complete the required steps before treating an appointment as confirmed.",
            "Choose Help with a property or quote on Contact for a large, unusual, multi-unit, multi-building, or outlying assignment.",
          ],
        },
      },
      {
        title: "Complete the client requirements",
        paragraphs: {
          production: [
            "The buyer or other contracting client normally reviews and accepts the agreement, price, payment responsibility, and report-use terms.",
          ],
          development: [
            "The buyer or other contracting client normally reviews the agreement, price, payment responsibility, and report-use terms. Online agreement acceptance and payment are not currently available through this website.",
          ],
        },
      },
      {
        title: "Receive preparation instructions",
        paragraphs: {
          production: [
            "The confirmation explains access, utilities, occupancy, pets, attendance, additional structures, estimated duration, and any radon, sewer, or thermal preparation that applies.",
          ],
          development: [
            "Confirm access, utilities, occupancy, pets, attendance, additional structures, estimated duration, and service-specific preparation with Rivermark before the appointment.",
          ],
        },
      },
      {
        title: "Attend all or part of the inspection",
        paragraphs: {
          production: [
            "Buyers are welcome to attend. Some uninterrupted work periods are necessary so the inspector can operate systems, document conditions, and work safely.",
          ],
          development: [
            "Buyers are welcome to attend. Some uninterrupted work periods are necessary so the inspector can operate systems, document conditions, and work safely.",
          ],
        },
      },
      {
        title: "Participate in the prioritized walkthrough",
        paragraphs: {
          production: [
            "The final review focuses on apparent urgent concerns, material conditions, matters needing professional evaluation, near-term attention, important maintenance, and significant limitations.",
          ],
          development: [
            "The final review focuses on apparent urgent concerns, material conditions, matters needing professional evaluation, near-term attention, important maintenance, and significant limitations.",
          ],
        },
      },
      {
        title: "Review the written report",
        paragraphs: {
          production: [
            "Read the complete report for the findings and recommendations. It controls over preliminary onsite explanations.",
          ],
          development: [
            "Read the complete report for the findings and recommendations. It controls over preliminary onsite explanations.",
          ],
        },
      },
      {
        title: "Ask questions and prepare for taking possession",
        paragraphs: {
          production: [
            "Ask report-related questions by email for approximately 30 calendar days. For your full buyer inspection, coordinate the home-specific packet around possession and request the included short remote explanation when useful.",
          ],
          development: [
            "Ask report-related questions by email for approximately 30 calendar days. For your full buyer inspection, coordinate the home-specific packet around possession and request the included short remote explanation when useful.",
          ],
        },
      },
    ] as const satisfies readonly BuyersWorkflowStep[],
  },
  scheduling: {
    eyebrow: "When to Schedule",
    title: "Start as soon as the contract and lawful access allow.",
    paragraphs: {
      production: [
        "Inspection timing is normally controlled by the purchase agreement, the inspection or due-diligence period, and the ability to obtain lawful access to the property.",
        "Rivermark can explain the inspection process and available appointment options. Rivermark does not interpret the purchase agreement, calculate contractual deadlines, or provide legal advice.",
        "Confirm the applicable dates and transaction requirements with your real-estate agent, attorney, or other transaction professional. Then use See Price & Availability to review the current schedule.",
      ],
      development: [
        "Inspection timing is normally controlled by the purchase agreement, the inspection or due-diligence period, and the ability to obtain lawful access to the property.",
        "Rivermark can explain the inspection process and available appointment options. Rivermark does not interpret the purchase agreement, calculate contractual deadlines, or provide legal advice.",
        "Confirm the applicable dates and transaction requirements with your real-estate agent, attorney, or other transaction professional. Use Price & Availability to review the quote and available times. Complete the required steps before treating an appointment as confirmed.",
      ],
    } satisfies WorkflowCopy<readonly string[]>,
  },
  bookingInformation: {
    eyebrow: "Information Needed to Book",
    title:
      "Most standard properties can be priced with ordinary listing and transaction information.",
    introduction: "Be prepared to provide:",
    items: [
      "Property address",
      "Property type",
      "Total inspected main-building floor area, including basement area",
      "Approximate year built",
      "Number of dwelling units",
      "Condominium versus fee-simple ownership form",
      "Occupied, vacant, or under construction status",
      "Additional garages, sheds, workshops, accessory structures, or detached dwellings",
      "Requested services",
      "Client contact information",
      "Agent contact information when applicable",
      "Known access, utility, occupancy, tenant, pet, or preparation limitations",
    ],
    closing: {
      production: [
        "Select unknown when a technical detail is not reasonably available and the booking flow provides that choice. Rivermark may review the request before confirming the scope and price.",
      ],
      development: [
        "Do not guess at a technical detail. Select unknown where offered, or choose Help with a property or quote on Contact when the uncertainty affects the scope or price.",
      ],
    } satisfies WorkflowCopy<readonly string[]>,
  },
  preparation: {
    eyebrow: "Preparing for the Inspection",
    title: "Prepare the property so the inspector can reach what matters.",
    opening:
      "The person arranging the appointment is responsible for lawful access and permission to inspect the agreed property, units, and structures.",
    listIntroduction: {
      production:
        "The preparation message may ask the appropriate property-side contact to confirm:",
      development:
        "Ask the responsible property-side contact to confirm:",
    } satisfies WorkflowCopy<string>,
    items: [
      { text: "Utilities are on and systems are in normal service" },
      { text: "The electrical panel is accessible" },
      {
        text: "The furnace, boiler, water heater, and other mechanical equipment are accessible",
      },
      { text: "Attic and crawlspace openings are reachable" },
      {
        text: "Garages, detached buildings, and contracted dwelling units can be entered",
      },
      { text: "Stored belongings do not block important components" },
      { text: "Pets are secured and occupants understand the appointment" },
      {
        text: "Keys, codes, lockboxes, association access, tenant coordination, or builder access are arranged",
      },
      {
        text: "A suitable sewer cleanout is accessible when a sewer scope is ordered",
        requiredRoute: "sewerScope",
      },
      {
        text: "Radon closed-building and device-access requirements are followed when radon testing is ordered",
        requiredRoute: "radonTesting",
      },
    ] as const satisfies readonly Readonly<{
      text: string;
      requiredRoute?: SiteRouteKey;
    }>[],
    closing: {
      production:
        "Confirm these arrangements with the responsible owner, occupant or property contact. Instructions and reminders help, but they do not establish that access or preparation is complete.",
      development:
        "Confirm these arrangements with the responsible owner, occupant or property contact, including any areas that will remain inaccessible.",
    } satisfies WorkflowCopy<string>,
    resourceLink: {
      label: "More on preparing for inspection day",
      route: "homeInspectionExpectationsResource",
    },
  },
  during: {
    eyebrow: "During the Inspection",
    title: "Attend, ask questions, and allow the inspector room to work.",
    paragraphs: [
      "Buyers may attend the full inspection or join later.",
      "Reasonable questions are welcome. The inspector may defer a detailed explanation until a safe stopping point or the final walkthrough when conversation would interfere with technical work, documentation, or safety.",
      "The inspection is visual and non-invasive. The sequence may change because of weather, access, occupancy, utility status, property layout, ancillary services, or safety.",
      "Clients and guests may be kept away from roofs, ladders, electrical-panel work areas, unsafe attics or crawlspaces, sewer equipment, suspected contamination, unstable areas, or other hazards.",
      "Clients who do not attend throughout are encouraged to arrive for approximately the final 45–60 minutes. The exact timing may change, so remain reachable for an update.",
      "If you cannot attend, you receive the normal report and a reasonable scheduled remote review. A second onsite walkthrough is not automatically included.",
    ],
  },
  walkthrough: {
    eyebrow: "The Final Walkthrough",
    title:
      "Use the walkthrough to understand priorities and ask questions.",
    paragraphsBefore: [
      "Rivermark walks through the important findings with you, explains why they matter and answers your questions. You can connect the observations to the parts of the home you have seen and discuss what to plan for as an owner.",
      "The walkthrough is normally planned around 30–45 minutes and adjusted to the property and findings.",
      "It focuses on:",
    ],
    items: [
      "Apparent urgent safety or active-damage concerns",
      "Material property conditions",
      "Matters needing further professional evaluation",
      "Near-term repair or attention needs",
      "Important maintenance and monitoring items",
      "Significant inspection limitations",
      "Questions the client should resolve",
    ],
    paragraphsAfter: [
      "Urgent safety or active-damage concerns are communicated promptly; they are not held until the closing walkthrough.",
      "Onsite explanations are preliminary. The inspector may refine the terminology, priority, or recommendation after reviewing photographs, measurements, equipment information, and related observations.",
      "Use the reviewed written report for the findings and recommendations. Rivermark communicates material changes from the onsite discussion and documents later factual corrections or addenda.",
    ],
    questionsTitle: "Useful questions for the walkthrough",
    questions: [
      "What observations or photographs support this concern?",
      "What remains uncertain or needs another professional’s evaluation?",
      "Which type of qualified professional would be appropriate?",
      "What could not be inspected, and what question does that leave unresolved?",
      "Which maintenance items should I plan for when I take possession?",
    ],
  },
  report: {
    eyebrow: "The Written Report",
    title:
      "A clear record of what was observed, why it matters, and what should happen next.",
    introduction: "The report is designed to help you distinguish among:",
    items: [
      "Material concerns",
      "Apparent safety concerns",
      "Functional defects",
      "Active or significant moisture conditions",
      "Matters needing professional evaluation",
      "Important deferred maintenance",
      "Selected lower-priority ownership observations",
      "Material access, weather, utility, and scope limitations",
    ],
    paragraphs: [
      "The number of findings is not a score for the house. Read each finding in context: what was observed, why it matters, what remains uncertain and what next step is recommended.",
      "Read the full report as well as the summary. The summary helps you locate priorities; the full report includes supporting photographs, context and limitations. An area that could not be inspected has not received a satisfactory result.",
      "The report explains visible conditions within the agreed scope. It is not an engineering report, structural certification, municipal code approval, appraisal, repair estimate, construction bid, warranty, or guarantee that every concealed or intermittent condition was found.",
    ],
    resourceLink: {
      label: "How to read a home inspection report",
      route: "homeInspectionReportResource",
    },
    sampleReport: {
      label: "View Sample Report",
      route: "sampleReport",
    },
  },
  support: {
    eyebrow: "From the report to taking possession",
    title:
      "Take what you learn into homeownership.",
    introduction:
      "Your full buyer inspection includes a home-specific systems and maintenance packet, with one short scheduled remote explanation session when requested after taking possession.",
    ownership: [
      "The packet is tailored to the systems and features identified during the inspection. It gathers useful documented locations, getting-started priorities from the report, applicable maintenance guidance and references in one place. Condominium buyer packets respect the contracted unit, exclusive-use components and association responsibilities.",
      "Tell Rivermark your expected possession timing so delivery can be coordinated through the agreed client channel. Once you take possession, you can arrange the included remote session to go through the packet and reasonable ownership questions. Possession after the report-support period does not remove this benefit.",
      "The packet helps you use the inspection information; it does not replace the report, verify conditions at possession or include another site visit. Standalone tests, limited consultations, seller inspections and follow-up visits do not automatically include it.",
    ],
    emailSupportTitle: "Separate report-related email support",
    emailSupportIntroduction:
      "Approximately 30 calendar days of reasonable report-related email support are included for the original client.",
    mayHelpIntroduction: "Rivermark may help clarify:",
    mayHelp: [
      "What a finding means",
      "Why it was prioritized",
      "How related observations fit together",
      "What limitation affected the inspection",
      "What type of qualified professional may be appropriate",
      "Whether the recommendation appears prompt, near-term, or maintenance-oriented",
    ],
    doesNotIntroduction: "Rivermark does not:",
    doesNot: [
      "Tell you whether to purchase, terminate, or renegotiate",
      "Draft repair demands",
      "Recommend concessions or credits",
      "Estimate repair costs",
      "Select or manage contractors",
      "Review repeated bids or proposals",
      "Provide legal, appraisal, engineering, or investment advice",
      "Diagnose a new condition through messages",
      "Include another site visit in ordinary report support",
    ],
  },
  roles: {
    eyebrow: "Buyer, Agent, and Report Roles",
    title: "Coordination does not change who the client is.",
    agentParagraph: {
      production:
        "An agent may share the scheduling link, enter property information, begin a quote, coordinate access, or attend the inspection.",
      development:
        "An agent may share Price & Availability, coordinate access, and attend when authorized by the client. Agent-start booking is not currently available.",
    } satisfies WorkflowCopy<string>,
    clientIntroduction: {
      production: "The buyer or other contracting client normally:",
      development:
        "The buyer or other contracting client normally:",
    } satisfies WorkflowCopy<string>,
    clientItems: [
      "Accepts the inspection agreement",
      "Accepts the scope and price",
      "Accepts payment responsibility",
      "Accepts the report-use terms",
      "Controls ordinary report authorization and sharing",
    ],
    paragraphs: [
      "An agent’s help with scheduling or access does not transfer the client relationship, control of report sharing, or authority to change the scope or findings.",
      "Report sharing requires client authorization and is subject to the agreement. Confirm the intended recipients with Rivermark.",
    ],
  },
  optionalServices: {
    eyebrow: "Optional Services",
    title: "Additional questions require separately contracted services.",
    items: [
      {
        title: "Radon Testing",
        paragraphs: [
          "Radon cannot be evaluated visually during the home inspection. A separately contracted measurement uses a professional continuous monitor and a defined process to document the result, conditions, validity review, limitations, and appropriate next-step context.",
        ],
        price: showIntroductoryPricing() ? "Added to a full inspection: $150 introductory / $175 standard" : "Added to a full inspection: $175",
        link: { label: "Learn About Radon Testing", route: "radonTesting" },
        requiredRoute: "radonTesting",
      },
      {
        title: "Sewer Scope",
        paragraphs: [
          "The visual home inspection does not determine the condition of the concealed underground building sewer. A separately contracted sewer scope uses a camera to observe one primary building sewer from a suitable access point and includes recorded video, concise findings, coverage, stopping point, and limitations.",
        ],
        price: showIntroductoryPricing() ? "Added to a full inspection: $150 introductory / $175 standard" : "Added to a full inspection: $175",
        link: {
          label: "Learn About Sewer Scope Inspections",
          route: "sewerScope",
        },
        requiredRoute: "sewerScope",
      },
    ] as const satisfies readonly Readonly<{
      title: string;
      paragraphs: readonly string[];
      price: string;
      link: BuyersPageLink;
      requiredRoute: SiteRouteKey;
    }>[],
  },
  final: {
    eyebrow: "Your next step",
    productionTitle: "Start with the price and the appointments currently available.",
    developmentTitle:
      "Review the property-specific price and availability.",
    paragraphs: {
      production: [
        "Enter the property and service information to see the calculated price and Rivermark's released schedule.",
        "Standard properties can continue through online scheduling. Unusual properties are routed to manual review so the scope, price, travel, and reserved time are accurate.",
      ],
      development: [
        "Use Price & Availability to enter the property details, review the quote, and see available appointment times. Complete the required steps before treating an appointment as confirmed.",
        "Use the secure Spectora experience for standard properties. Unusual properties need individual review so the scope, price, travel, and reserved time are accurate.",
      ],
    } satisfies WorkflowCopy<readonly string[]>,
    primaryAction: {
      label: "See Price & Availability",
      route: "priceAvailability",
    },
    secondaryAction: { label: "View Pricing", route: "pricing" },
    fallback: {
      text: "Have a transaction deadline or unusual property that does not fit the standard flow?",
      action: { label: "Contact Rivermark", route: "contact" },
    },
  },
} as const;
