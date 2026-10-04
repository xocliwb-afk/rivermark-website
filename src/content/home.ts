import { promotion } from "@/config/publication";
import type { SiteRouteKey } from "@/config/routes";

export type HomepageLink = Readonly<{
  label: string;
  route: SiteRouteKey;
}>;

export type HomepagePricePair = Readonly<{
  introductory: Readonly<{
    label: string;
    amount: `$${number}`;
  }>;
  standard: Readonly<{
    label: string;
    amount: `$${number}`;
  }>;
}>;

type HomepageTextBlock = Readonly<{
  title: string;
  paragraphs: readonly string[];
}>;

type PublicationGatedItem = Readonly<{
  route: SiteRouteKey;
}>;

type HomepageContent = Readonly<{
  metadata: Readonly<{
    title: string;
    description: string;
    openGraphTitle: string;
    openGraphDescription: string;
  }>;
  hero: Readonly<{
    eyebrow: string;
    title: string;
    lead: string;
    primaryAction: HomepageLink;
    secondaryAction: HomepageLink;
    proofLine: string;
    mediaSupportLine: string;
  }>;
  audienceRoutes: readonly Readonly<
    HomepageTextBlock & {
      link: HomepageLink;
    }
  >[];
  coreInspection: Readonly<{
    title: string;
    paragraphs: readonly string[];
    benefits: readonly HomepageTextBlock[];
    understanding: Readonly<{
      title: string;
      summary: string;
      items: readonly string[];
      clarification: string;
    }>;
    price: Readonly<{
      title: string;
      pair: HomepagePricePair;
      scope: readonly string[];
      sameScopeClarification: string;
      propertyPriceClarification: string;
      availabilityClarification: string;
      supportingLinks: readonly HomepageLink[];
    }>;
  }>;
  commonAdditions: Readonly<{
    title: string;
    introduction: string;
    items: readonly Readonly<
      PublicationGatedItem &
        HomepageTextBlock & {
          contextLabel: string;
          price: HomepagePricePair;
          link: HomepageLink;
        }
    >[];
  }>;
  process: Readonly<{
    title: string;
    steps: readonly Readonly<
      HomepageTextBlock & {
        number: `${number}`;
      }
    >[];
  }>;
  trust: Readonly<{
    title: string;
    introduction: string;
    items: readonly HomepageTextBlock[];
  }>;
  sampleReport: Readonly<
    PublicationGatedItem & {
      title: string;
      paragraphs: readonly string[];
      primaryAction: HomepageLink;
      supportingLinks: readonly Readonly<
        PublicationGatedItem & HomepageLink
      >[];
    }
  >;
  founder: Readonly<{
    title: string;
    paragraphs: readonly string[];
    customerMeaning: Readonly<{
      title: string;
      items: readonly string[];
    }>;
    link: HomepageLink;
  }>;
  pathways: Readonly<{
    title: string;
    agent: Readonly<{
      title: string;
      introduction: string;
      items: readonly string[];
      paragraphs: readonly string[];
      link: HomepageLink;
    }>;
    homeowner: Readonly<{
      title: string;
      introduction: string;
      items: readonly string[];
      conditionalItems: readonly Readonly<
        PublicationGatedItem & {
          label: string;
        }
      >[];
      closing: string;
      link: HomepageLink;
    }>;
  }>;
  serviceArea: Readonly<{
    title: string;
    paragraphs: readonly string[];
    link: HomepageLink;
  }>;
  faqs: Readonly<{
    title: string;
  }>;
  finalConversion: Readonly<{
    title: string;
    paragraphs: readonly string[];
    primaryAction: HomepageLink;
    humanFallback: Readonly<{
      text: string;
      link: HomepageLink;
    }>;
  }>;
}>;

export const homepageContent = {
  metadata: {
    title: "Home Inspector Grand Rapids MI | Rivermark Home Inspections",
    description:
      "Home inspections for Grand Rapids and West Michigan. Explore inspection scope, published pricing, walkthroughs and reports explained in plain language.",
    openGraphTitle:
      "Home Inspections for Grand Rapids & West Michigan | Rivermark",
    openGraphDescription:
      "Understand what materially matters, what needs further evaluation, and what can be handled over time.",
  },
  hero: {
    eyebrow: "Residential Home Inspections",
    title: "Home Inspections for Grand Rapids & West Michigan",
    lead:
      "Rivermark combines practical residential experience with calm, direct explanations so you can understand what materially matters, what needs further evaluation, and what can be handled over time.",
    primaryAction: {
      label: "See Price & Availability",
      route: "priceAvailability",
    },
    secondaryAction: {
      label: "What Your Inspection Includes",
      route: "residentialHomeInspections",
    },
    proofLine:
      "Published pricing · No age surcharge · No repair sales",
    mediaSupportLine:
      "Practical experience across residential construction, remodeling, repairs, and building systems.",
  },
  audienceRoutes: [
    {
      title: "Buying a Home",
      paragraphs: [
        "Get a methodical inspection, a prioritized walkthrough, and a written report that separates material concerns from routine maintenance.",
      ],
      link: {
        label: "What Buyers Can Expect",
        route: "buyers",
      },
    },
    {
      title: "Helping a Client",
      paragraphs: [
        "Give your client a useful starting point: published pricing, preparation guidance, and clear walkthrough and report expectations.",
      ],
      link: {
        label: "Resources for Real-Estate Professionals",
        route: "agents",
      },
    },
    {
      title: "Already Own a Home",
      paragraphs: [
        "Plan maintenance, prepare to sell, evaluate a residential investment property, or get focused help with a defined concern.",
      ],
      link: {
        label: "Explore Other Residential Services",
        route: "otherResidentialServices",
      },
    },
  ],
  coreInspection: {
    title:
      "An inspection should leave you with priorities—not a pile of disconnected comments.",
    paragraphs: [
      "Rivermark evaluates the visible, reasonably accessible condition of residential systems and components, documents material findings and important limitations, and explains the results in plain language.",
      "You receive an explanation of what was observed, why it matters, and where uncertainty or limited access calls for another look. An organized written report with relevant photographs gives you a record to return to, with approximately 30 days of reasonable report-related email support for the original client.",
    ],
    benefits: [
      {
        title: "Practical residential context",
        paragraphs: [
          "Visible conditions are explained in relation to the rest of the house, so you understand why an observed condition matters—not just that it exists.",
        ],
      },
      {
        title: "Priorities you can use",
        paragraphs: [
          "Calm doesn't mean vague. Serious conditions are stated plainly, routine maintenance stays in proportion, and recommendations explain what type of professional may be needed and why.",
        ],
      },
      {
        title: "Time to understand the home",
        paragraphs: [
          "When you attend, Rivermark takes time to walk through the important findings, explain why they matter and answer your questions. You leave with a clearer understanding of what needs attention and what to plan for as a homeowner.",
        ],
      },
      {
        title: "Guidance for taking possession",
        paragraphs: [
          "A full buyer inspection includes a home-specific systems and maintenance packet, plus one short scheduled remote explanation session when requested after taking possession. The guide draws on the systems and features identified during your inspection, with practical ownership priorities.",
        ],
      },
    ],
    understanding: {
      title: "Understand the home—not just the inspection report.",
      summary:
        "In plain terms: what deserves attention now, what needs another professional, and what can be planned over time.",
      items: [
        "Material concerns",
        "Matters needing further professional evaluation",
        "Near-term attention",
        "Routine maintenance",
        "Lower-priority observations",
        "Material limitations that affected the inspection",
      ],
      clarification:
        "Findings are explained in context so you can understand what deserves attention and what needs more information.",
    },
    price: {
      title: "Residential Home Inspection",
      pair: {
        introductory: {
          label: "Introductory starting price",
          amount: `$${promotion.residentialIntroPrice}`,
        },
        standard: {
          label: "Standard starting price",
          amount: `$${promotion.residentialStandardPrice}`,
        },
      },
      scope: [
        "Through 3,000 square feet of total inspected main-building floor area.",
        "Finished and unfinished basement areas count toward the total.",
        "One ordinary detached residential garage is included.",
      ],
      sameScopeClarification: promotion.treatment,
      propertyPriceClarification:
        "Enter the property details in Price & Availability to review its quote and available appointment times.",
      availabilityClarification:
        "Your exact property price and currently available appointments are shown through the online quote and scheduling process.",
      supportingLinks: [
        {
          label: "View Complete Pricing",
          route: "pricing",
        },
      ],
    },
  },
  commonAdditions: {
    title: "Add the services that answer different questions.",
    introduction:
      "A residential home inspection evaluates visible and reasonably accessible conditions. Radon measurement and sewer-camera work answer separate questions that the standard inspection cannot answer by observation alone.",
    items: [
      {
        route: "radonTesting",
        title: "Radon Testing",
        paragraphs: [
          "Measure the property's radon level using a professional continuous monitor and a defined measurement process. The written report documents the result, measurement conditions, validity review, limitations, and appropriate next-step context.",
        ],
        contextLabel: "Added to a full inspection",
        price: {
          introductory: {
            label: "Introductory price",
            amount: "$150",
          },
          standard: {
            label: "Standard price",
            amount: "$175",
          },
        },
        link: {
          label: "Learn About Radon Testing",
          route: "radonTesting",
        },
      },
      {
        route: "sewerScope",
        title: "Sewer Scope",
        paragraphs: [
          "Use a camera to observe one primary building sewer from a suitable, readily accessible cleanout or agreed access point. The service includes the recorded video, concise written findings, observed coverage, stopping point, and material limitations.",
        ],
        contextLabel: "Added to a full inspection",
        price: {
          introductory: {
            label: "Introductory price",
            amount: "$150",
          },
          standard: {
            label: "Standard price",
            amount: "$175",
          },
        },
        link: {
          label: "Learn About Sewer Scope Inspections",
          route: "sewerScope",
        },
      },
    ],
  },
  process: {
    title: "Know what to expect from the first price check through the report.",
    steps: [
      {
        number: "1",
        title: "Review the property-specific quote",
        paragraphs: [
          "Start with the property and service details in Price & Availability to review the quote.",
          "Review available times and follow the required booking steps. Unusual properties may need individual review before an appointment can be confirmed.",
        ],
      },
      {
        number: "2",
        title: "Know what needs to be ready",
        paragraphs: [
          "Before the visit, confirm access, utilities, occupancy, pets, attendance, and preparation for the services you selected.",
          "Ask about the estimated appointment duration when planning your day. The property, access and findings can change the time needed.",
        ],
      },
      {
        number: "3",
        title: "Complete the inspection and walkthrough",
        paragraphs: [
          "Your inspector works methodically through the property while documenting relevant conditions and limitations.",
          "You may attend all or part of the inspection. Some uninterrupted work periods are necessary, but reasonable questions are welcome. The closing walkthrough explains important findings and maintenance in context. Urgent concerns are communicated promptly rather than held until that review.",
        ],
      },
      {
        number: "4",
        title: "Review the written report",
        paragraphs: [
          "The report organizes material concerns, professional-evaluation needs, near-term attention, maintenance, lower-priority observations, and material limitations.",
          "Onsite explanations are preliminary. Use the written report for the findings and recommendations after the photographs, notes and measurements have been reviewed; any later corrections or addenda are documented.",
          "Reasonable report-related email support is included for approximately 30 calendar days for the original client.",
        ],
      },
    ],
  },
  trust: {
    title: "Clear scope. Independent judgment. No repair sales.",
    introduction:
      "Rivermark earns trust by being specific about what the inspection does, how findings are communicated, and where the service has real limits.",
    items: [
      {
        title: "Scope you can understand",
        paragraphs: [
          "The inspection is visual and non-invasive. Rivermark evaluates reasonably accessible residential systems and components under the conditions present on the inspection date and documents material access, weather, utility, and scope limitations.",
        ],
      },
      {
        title: "Findings kept in proportion",
        paragraphs: [
          "Material concerns are communicated directly. Routine maintenance and lower-priority observations are organized so they do not compete with more important issues.",
        ],
      },
      {
        title: "Independent by design",
        paragraphs: [
          "Rivermark does not use inspections to sell repair work, prepare construction bids, or steer customers toward paid repair relationships.",
          "When further evaluation is appropriate, Rivermark may identify the type of professional to consider. The customer remains free to select that professional.",
        ],
      },
      {
        title: "Honest professional boundaries",
        paragraphs: [
          "A home inspection is not engineering or structural certification, municipal code approval, an appraisal, a repair estimate, destructive investigation, a warranty, or a guarantee that every concealed, intermittent, latent, or future condition was found.",
        ],
      },
    ],
  },
  sampleReport: {
    route: "sampleReport",
    title: "See how Rivermark organizes the information.",
    paragraphs: [
      "Open a Rivermark sample report to see how observations, photographs, priorities, limitations, and practical next steps are presented.",
      "The sample demonstrates Rivermark's reporting format and communication style. It does not promise that every property will produce the same number of findings, report length, photographs, accessible systems, or conditions.",
    ],
    primaryAction: {
      label: "View Sample Report",
      route: "sampleReport",
    },
    supportingLinks: [
      {
        route: "homeInspectionReportResource",
        label: "How to Read a Home Inspection Report",
      },
    ],
  },
  founder: {
    title: "Practical residential experience, used for the right purpose.",
    paragraphs: [
      "Rivermark was founded by Brandon Wilcox, whose background includes residential construction, remodeling, repairs, property condition, and building systems.",
      "The inspection remains visual and non-invasive, with its scope and limitations explained clearly.",
    ],
    customerMeaning: {
      title: "What that background means for the customer",
      items: [
        "Context for how visible residential components relate.",
        "Clearer explanations of why an observed condition matters.",
        "Recognition of when another professional should take a closer look.",
      ],
    },
    link: {
      label: "About Rivermark",
      route: "about",
    },
  },
  pathways: {
    title:
      "Built for the people relying on the inspection—and the professionals helping them.",
    agent: {
      title: "For Real-Estate Professionals",
      introduction:
        "Give your client a clear starting point for the inspection:",
      items: [
        "Public pricing",
        "A dedicated Price & Availability page",
        "Property-specific quotes and available times",
        "Clear preparation and access instructions",
        "Defined client and agent roles",
        "Organized walkthrough and report expectations",
        "A direct route for unusual properties",
      ],
      paragraphs: [
        "An agent can share the starting link and help coordinate access. The inspection client normally accepts the agreement, price, payment responsibility, and report-use terms.",
        "Rivermark does not tailor findings to protect a transaction, provide negotiation strategy, or promise preferential appointment access.",
      ],
      link: {
        label: "Agent Resources",
        route: "agents",
      },
    },
    homeowner: {
      title: "For Homeowners, Sellers, and Investors",
      introduction:
        "Rivermark's inspection work is useful beyond the purchase transaction. Services may include:",
      items: [
        "Home Maintenance Inspections",
        "Pre-Listing Home Inspections",
        "Investment Property Inspections",
        "Condominium Inspections",
        "Pre-Offer Walk-Through Consultations",
        "Investor Property Consultations",
        "Repair Follow-Up Visits",
      ],
      conditionalItems: [
        {
          label: "Radon Testing",
          route: "radonTesting",
        },
        {
          label: "Sewer Scope Inspections",
          route: "sewerScope",
        },
        {
          label: "Paid Thermal Services",
          route: "thermalImaging",
        },
      ],
      closing:
        "Limited consultations and Repair Follow-Up Visits have defined purposes and are not discounted substitutes for a full residential inspection.",
      link: {
        label: "Explore Other Residential Services",
        route: "otherResidentialServices",
      },
    },
  },
  serviceArea: {
    title: "Serving Grand Rapids and surrounding West Michigan.",
    paragraphs: [
      "Start with the property address to check whether the location and requested services fit the available schedule.",
      "For an outlying location or unusual access needs, contact Rivermark for help with the property so the scope, travel and appointment requirements can be checked.",
    ],
    link: {
      label: "View the Service Area",
      route: "serviceArea",
    },
  },
  faqs: {
    title: "Questions before you schedule",
  },
  finalConversion: {
    title: "See your price and available times.",
    paragraphs: [
      "Enter the property details in the secure Spectora quote experience on Price & Availability.",
      "Review the quote and available times. A person checks unusual property, access, building or travel details when they need individual review.",
    ],
    primaryAction: {
      label: "See Price & Availability",
      route: "priceAvailability",
    },
    humanFallback: {
      text: "Have an unusual property or a question before scheduling?",
      link: {
        label: "Contact Rivermark",
        route: "contact",
      },
    },
  },
} as const satisfies HomepageContent;
