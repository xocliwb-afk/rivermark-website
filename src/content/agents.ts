import type { SiteRouteKey } from "@/config/routes";
import type { WorkflowCopy } from "@/config/workflows";

export type AgentsPageLink = Readonly<{
  label: string;
  route: SiteRouteKey;
}>;

type AgentExpectation = Readonly<{
  title: string;
  paragraphs: WorkflowCopy<readonly string[]>;
}>;

export const agentsContent = {
  metadata: {
    title: "Home Inspection Resources for West Michigan Agents | Rivermark",
    description:
      "Share pricing and preparation guidance with your buyer, coordinate inspection access, and understand walkthrough, report and client-sharing expectations.",
    openGraphTitle:
      "A Clear Inspection Process for You and Your Client | Rivermark",
    openGraphDescription:
      "Clear preparation and transaction expectations, a prioritized buyer walkthrough, clear reports, and independent findings.",
  },
  hero: {
    eyebrow: "For buyer agents and authorized transaction professionals",
    title: "A Clear Inspection Process for You and Your Client",
    paragraphs: [
      "Give your buyer a clear starting point: published pricing, a shareable price and availability page, and guidance for preparing for inspection day.",
      "Your client can attend, ask questions during the walkthrough, and use the written report to understand the findings and next steps. Rivermark explains important observations and maintenance priorities so the buyer has useful context for owning the home.",
    ],
    primaryAction: {
      label: "See Price & Availability",
      route: "priceAvailability",
    },
    secondaryAction: {
      label: "What Buyers Can Expect",
      route: "buyers",
    },
    fallbackAction: {
      label: "Contact Rivermark About an Unusual Transaction",
      route: "contact",
    },
    proofLine:
      "Transparent pricing · Clear client roles · Independent findings",
    aside: {
      title: "What your client gets",
      items: [
        "Public pricing context",
        "Relevant preparation and access guidance",
        "A prioritized buyer walkthrough",
        "An independent written report",
      ],
    },
  },
  expectations: {
    eyebrow: "What Your Client Can Expect",
    title: "A process that is straightforward to explain.",
    items: [
      {
        title: "A visible price before the appointment",
        paragraphs: {
          production: [
            "Public pricing explains the standard rules. Your client can enter the property details in Price & Availability to review the quote and available appointment times.",
          ],
          development: [
            "Public pricing explains the standard rules. Your client can enter the property details in Price & Availability to review the quote and available times. The appointment-status section below explains confirmation.",
          ],
        },
      },
      {
        title: "Preparation for the property and selected services",
        paragraphs: {
          production: [
            "The confirmation covers the selected services, access, utilities, occupancy, pets, buildings, estimated duration, attendance, agreement and payment status, and service-specific preparation.",
          ],
          development: [
            "Before an appointment, confirm the selected services, access, utilities, occupancy, pets, buildings, estimated duration, attendance, agreement and payment requirements, and applicable preparation.",
          ],
        },
      },
      {
        title: "Methodical inspection work",
        paragraphs: {
          production: [
            "Rivermark follows a consistent, methodical process while adapting the sequence to weather, access, property layout, occupancy, utilities, ancillary services, and safety.",
          ],
          development: [
            "Rivermark follows a consistent, methodical process while adapting the sequence to weather, access, property layout, occupancy, utilities, ancillary services, and safety.",
          ],
        },
      },
      {
        title: "Buyer participation",
        paragraphs: {
          production: [
            "The client may attend all or part of the inspection. Reasonable questions are welcome, with uninterrupted work periods preserved for technical tasks and safety.",
          ],
          development: [
            "The client may attend all or part of the inspection. Reasonable questions are welcome, with uninterrupted work periods preserved for technical tasks and safety.",
          ],
        },
      },
      {
        title: "A prioritized final walkthrough",
        paragraphs: {
          production: [
            "The final walkthrough focuses on priorities and important limitations. The inspection-day section below explains attendance and communication.",
          ],
          development: [
            "The final walkthrough focuses on priorities and important limitations. The inspection-day section below explains attendance and communication.",
          ],
        },
      },
      {
        title: "A clear written report",
        paragraphs: {
          production: [
            "The written report presents findings, photographs, limitations, and next steps. It controls over preliminary onsite explanations.",
          ],
          development: [
            "The written report presents findings, photographs, limitations, and next steps. It controls over preliminary onsite explanations.",
          ],
        },
      },
      {
        title: "Report clarification and ownership guidance",
        paragraphs: {
          production: [
            "The original client receives approximately 30 calendar days of reasonable report-related email support. Full buyer inspections, including applicable condominium inspections, also include a home-specific systems and maintenance packet for taking possession and one short scheduled remote explanation session when requested. That possession guidance is separate from the report-support period.",
          ],
          development: [
            "The original client receives approximately 30 calendar days of reasonable report-related email support. Full buyer inspections, including applicable condominium inspections, also include a home-specific systems and maintenance packet for taking possession and one short scheduled remote explanation session when requested. That possession guidance is separate from the report-support period.",
          ],
        },
      },
    ] as const satisfies readonly AgentExpectation[],
  },
  starting: {
    eyebrow: "Starting the Process",
    productionTitle:
      "Share the price and availability page with your client.",
    developmentTitle:
      "Share a useful starting point with your client.",
    share: {
      title: "Share with the client",
      paragraphs: {
        production: [
          "Use the public Price & Availability link so the buyer can enter the property information, review the quote, choose an available appointment, and complete the client requirements directly.",
        ],
        development: [
          "Send the public Price & Availability link so your client can enter the property details and review the quote and available times. Use the preparation checklist below to coordinate access.",
        ],
      } satisfies WorkflowCopy<readonly string[]>,
      action: {
        label: "Share Price & Availability",
        route: "priceAvailability",
      },
    },
    agentStart: {
      title: "Start the quote",
      paragraphs: {
        production: [
          "An agent may begin the quote when Spectora's configured workflow preserves separate client and agent records and provides a clean, secure buyer-completion process.",
          "The buyer should normally review the services and price, accept the agreement and report-use terms, complete the required payment step, and receive the final confirmation.",
        ],
        development: [
          "Agent-start booking is not currently available. Share Price & Availability with the client or contact Rivermark for coordination help.",
          "The buyer normally remains responsible for reviewing the services and price, accepting the agreement and report-use terms, and payment.",
        ],
      } satisfies WorkflowCopy<readonly string[]>,
      status: "Agent-start booking not available",
    },
  },
  roles: {
    eyebrow: "Agreement and Payment Roles",
    title:
      "Help with coordination while keeping the client’s decisions clear.",
    clientIntroduction: {
      production: "The contracting client normally:",
      development:
        "The contracting client normally:",
    } satisfies WorkflowCopy<string>,
    clientItems: [
      "Accepts the inspection agreement",
      "Accepts the scope and price",
      "Accepts payment responsibility",
      "Accepts the report-use terms",
      "Controls ordinary report authorization and sharing",
    ],
    paragraphs: {
      production: [
        "Agent information remains separate in the inspection record.",
        "An agent who shares the link, begins a quote, enters property information, or coordinates access does not automatically become the client or obtain sole control over the report.",
        "Any authorized exception must be documented and supported by the final agreement, insurer requirements, payment responsibility, and Spectora configuration.",
      ],
      development: [
        "An agent can share information and coordinate access. Those actions do not transfer the client relationship or control of the report.",
        "Any different arrangement needs documented authority and confirmation from Rivermark under the agreement, insurer requirements, and payment and report-use terms.",
      ],
    } satisfies WorkflowCopy<readonly string[]>,
  },
  scheduling: {
    eyebrow: "Scheduling and Availability",
    title: "Plan around the available schedule.",
    introduction: {
      production: [
        "An appointment needs time for fieldwork, travel, the client walkthrough and preparation of the report. The property and selected services also affect which appointments can be offered.",
      ],
      development: [
        "An appointment needs time for fieldwork, travel, the client walkthrough and preparation of the report. The property and selected services also affect which appointments can be offered.",
      ],
    } satisfies WorkflowCopy<readonly string[]>,
    groups: [
      {
        title: "Standard properties",
        paragraphs: {
          production: [
            "For a standard assignment, ask the client to enter the property details in Price & Availability and review the quote and available times.",
          ],
          development: [
            "For a standard assignment, ask the client to enter the property details in Price & Availability and review the quote and available times.",
          ],
        },
      },
      {
        title: "Unusual properties",
        paragraphs: {
          production: [
            "Choose Help with a property or quote on Contact for a large property, multiple units or buildings, an outlying location, restricted access, or a scope that needs individual review.",
          ],
          development: [
            "Choose Help with a property or quote on Contact for a large property, multiple units or buildings, an outlying location, restricted access, or a scope that needs individual review.",
          ],
        },
      },
      {
        title: "Unusual deadlines",
        paragraphs: {
          production: [
            "Agents may contact Rivermark about a deadline or appointment need that does not fit the released schedule.",
            "Rivermark will assess whether the work fits the available time and scope. Agent referrals do not receive preferential scheduling.",
          ],
          development: [
            "Agents may contact Rivermark about a deadline or appointment need that does not fit the available schedule.",
            "Rivermark will assess whether the work fits the available time and scope. Agent referrals do not receive preferential scheduling.",
          ],
        },
      },
      {
        title: "Appointment status",
        paragraphs: {
          production: [
            "A selected time or submitted order is not necessarily the same as a confirmed appointment. The client may still need to complete the agreement, payment, or another required step.",
            "The final Spectora status and confirmation communication control.",
          ],
          development: [
            "A quote, selected time, or submitted order is not necessarily a confirmed appointment. This website does not confirm appointments.",
            "Contact Rivermark if the appointment status or remaining requirements are unclear.",
          ],
        },
      },
    ] as const satisfies readonly AgentExpectation[],
  },
  preparation: {
    eyebrow: "Preparation and Access Checklist",
    title: "A checklist for owners and occupants.",
    introduction: "Before the appointment, confirm or coordinate:",
    items: [
      {
        text: "Lawful access to the property and every contracted unit or building",
      },
      {
        text: "Lockbox, key, code, association, builder, tenant, or property-manager arrangements",
      },
      { text: "Utilities on and systems in normal service" },
      {
        text: "Access to the electrical panel, furnace, boiler, water heater, attic, crawlspace, and other mechanical equipment",
      },
      { text: "Reasonable access around interior and exterior components" },
      { text: "Garages and additional structures unlocked" },
      { text: "Pets secured and occupants informed" },
      {
        text: "Known shutdowns, winterization, access limitations, or unsafe areas disclosed",
      },
      {
        text: "Suitable sewer-cleanout access when a sewer scope is ordered",
        requiredRoute: "sewerScope",
      },
      {
        text: "Radon closed-building conditions and equipment access when radon testing is ordered",
        requiredRoute: "radonTesting",
      },
      { text: "A reachable client and agent for timing or access questions" },
    ] as const satisfies readonly Readonly<{
      text: string;
      requiredRoute?: SiteRouteKey;
    }>[],
    paragraphs: [
      "Rivermark may send the checklist directly to an owner, occupant, tenant coordinator, property manager, or builder contact when the client or authorized agent specifically requests it and provides the contact information.",
      "That communication is logistical. It does not create a seller-side client relationship or authorize discussion of buyer findings.",
    ],
  },
  inspectionDay: {
    eyebrow: "Inspection-Day Expectations",
    title: "Help your client take part in inspection day.",
    paragraphs: [
      "The client may attend. An authorized agent is welcome to attend and participate in the final walkthrough.",
      "Rivermark needs uninterrupted periods to inspect safely, operate systems, take measurements, and document conditions. Detailed questions may be deferred to a natural stopping point or the final review.",
      "The final walkthrough is client-centered and normally planned around 30–45 minutes. It is not a separate seller-side presentation and does not attempt to recite every report observation.",
      "Rivermark does not provide a substantive presentation of buyer findings to listing-side parties without client authorization. Apparent immediate safety or property-damage concerns may be communicated to an appropriate responsible party when necessary.",
    ],
  },
  report: {
    eyebrow: "Report and Distribution",
    title: "Help your client understand the findings.",
    paragraphs: [
      "Use the reviewed written report for the findings and recommendations. Onsite comments are preliminary, and later factual corrections or addenda are documented.",
      "Report access requires the contracting client's authorization and is subject to the agreement. Confirm the intended recipients with Rivermark; scheduling involvement does not create report access or third-party reliance rights.",
    ],
    mayExplainIntroduction: "Rivermark may explain:",
    mayExplain: [
      "What was observed",
      "Why it matters",
      "How findings relate to one another",
      "What limitation affected the inspection",
      "What type of professional may be appropriate",
      "Whether prompt or near-term attention appears warranted",
    ],
    doesNotIntroduction: "Rivermark does not:",
    doesNot: [
      "Draft repair requests or demands",
      "Recommend concessions or credits",
      "Estimate repair costs",
      "Choose negotiation strategy",
      "Approve contractor proposals",
      "Alter findings to protect a transaction",
      "Provide engineering, code, appraisal, or legal conclusions",
    ],
    sampleReport: { label: "View Sample Report", route: "sampleReport" },
  },
  independence: {
    eyebrow: "Independent by Design",
    title:
      "Independent findings that serve the client.",
    introduction: "Rivermark does not:",
    items: [
      "Use inspections to generate repair work",
      "Sell mitigation, repair, warranty, insurance, security, or concierge products through the inspection",
      "Accept compensation for steering repair providers",
      "Operate a paid preferred-contractor program",
      "Market “deal-friendly” or softened reports",
      "Change findings because another party disagrees or the transaction is at risk",
      "Let a referral source control the scope, priorities, language, or report distribution",
    ],
    closing:
      "When another professional is appropriate, Rivermark may identify the type of specialist to consider or, at Brandon's discretion, provide a contact without a fee or guarantee.",
  },
  resources: {
    eyebrow: "Agent Resources",
    title: "Helpful links to share with your client.",
    items: [
      {
        title: "Public pricing",
        description:
          "Review the standard size tiers, condominium pricing, published services, additional units and structures, travel treatment, and manual-review triggers.",
        link: { label: "View Pricing", route: "pricing" },
      },
      {
        title: "Buyer guide",
        description:
          "Share preparation and attendance guidance, useful walkthrough questions, and what full buyer inspections include for taking possession.",
        link: { label: "What Buyers Can Expect", route: "buyers" },
      },
      {
        title: "Preparing for inspection day",
        description:
          "Help the client and property contact plan access, attendance and useful questions for the walkthrough.",
        link: {
          label: "Read the Inspection-Day Guide",
          route: "homeInspectionExpectationsResource",
        },
      },
      {
        title: "Inspection scope",
        description:
          "Review what the full residential inspection evaluates and the important limitations.",
        link: {
          label: "Residential Home Inspections",
          route: "residentialHomeInspections",
        },
      },
      {
        title: "Service area",
        description:
          "Check the property location and learn when travel or an outlying address needs review.",
        link: { label: "View the Service Area", route: "serviceArea" },
      },
      {
        title: "Sample report",
        description:
          "Open the sanitized sample to see how Rivermark organizes findings, photographs, priorities and limitations.",
        link: { label: "View Sample Report", route: "sampleReport" },
        requiredRoute: "sampleReport",
      },
      {
        title: "Help with a property or quote",
        description:
          "Request individual review for a large or unusual property, multiple units or buildings, restricted access, an outlying location, or a tight deadline.",
        link: { label: "Contact Rivermark", route: "contact" },
      },
    ] as const satisfies readonly Readonly<{
      title: string;
      description: string;
      link: AgentsPageLink;
      requiredRoute?: SiteRouteKey;
    }>[],
    closing:
      "Share these public pages with your client. Inspection-order and report links are separate; confirm access and sharing arrangements with Rivermark.",
  },
  final: {
    eyebrow: "Your next step",
    title: "Give your client a clear route from price to report.",
    paragraphs: {
      production: [
        "Use the public Price & Availability path for standard assignments. Contact Rivermark when the property, access, deadline, buildings, units, travel, or requested scope needs individual review.",
      ],
      development: [
        "Share the public Price & Availability link to the secure Spectora quote experience. Contact Rivermark when the property, access, deadline, buildings, units, travel, or requested scope needs individual review.",
      ],
    } satisfies WorkflowCopy<readonly string[]>,
    primaryAction: {
      label: "See Price & Availability",
      route: "priceAvailability",
    },
    fallback: {
      text: "Does the assignment need individual review?",
      action: {
        label: "Contact Rivermark About an Unusual Transaction",
        route: "contact",
      },
    },
  },
} as const;
