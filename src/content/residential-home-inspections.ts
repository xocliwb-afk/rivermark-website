import { promotion } from "@/config/publication";
import type { SiteRouteKey } from "@/config/routes";

export type ResidentialPageLink = Readonly<{
  label: string;
  route: SiteRouteKey;
}>;

type ContentGroup = Readonly<{
  title: string;
  paragraphs: readonly string[];
}>;

export const residentialHomeInspectionContent = {
  metadata: {
    title: "Home Inspections in Grand Rapids & West Michigan | Rivermark",
    description:
      "Residential home inspections for Grand Rapids and West Michigan with clear scope, prioritized walkthroughs, transparent pricing, and independent reporting.",
    openGraphTitle: "Residential Home Inspections | Rivermark",
    openGraphDescription:
      "Understand material conditions, important limitations, and what deserves attention before everything else.",
  },
  hero: {
    eyebrow: "Grand Rapids & West Michigan",
    title: "Residential Home Inspections",
    paragraphs: [
      "Understand the home's condition and leave with a clearer order of priorities: material concerns, questions for the right professional, near-term attention, and maintenance to plan over time.",
      "A Rivermark residential home inspection evaluates the home's visible and reasonably accessible systems and components. It is visual and non-invasive, reflects conditions on the inspection date, and documents important limitations.",
    ],
    price: {
      introductory: {
        label: "Introductory starting price",
        amount: `$${promotion.residentialIntroPrice}`,
      },
      standard: {
        label: "Standard starting price",
        amount: `$${promotion.residentialStandardPrice}`,
      },
      scope:
        "Through 3,000 square feet of total inspected main-building floor area.",
    },
    primaryAction: {
      label: "See Price & Availability",
      route: "priceAvailability",
    },
    secondaryAction: { label: "View Pricing", route: "pricing" },
    proofLine:
      "Clear scope · Prioritized walkthrough · Independent inspection-only service",
  },
  audience: {
    title:
      "One full residential inspection, adapted to the property and the client's purpose.",
    introduction: [
      "The primary service is built for residential buyers who need a clearer understanding of the property before completing the transaction.",
      "Sellers, current homeowners, and residential investors can use the same full inspection foundation for different decisions. The agreed scope, report, and access requirements reflect the property and purpose.",
    ],
    groups: [
      {
        title: "Homebuyers",
        paragraphs: [
          "Evaluate the home's visible condition, talk through important findings, and leave with a clearer order of priorities. A full buyer inspection includes the written report, a home-specific systems and maintenance packet for taking possession, and one short scheduled remote explanation session when requested.",
        ],
      },
      {
        title: "Condominium Buyers",
        paragraphs: [
          "Inspect the contracted unit, the systems directly serving it, and reasonably accessible exclusive-use components. Association-owned roofs, exteriors, structure, shared systems, finances, reserves, and other common elements are not automatically included.",
        ],
      },
      {
        title: "Townhome Buyers",
        paragraphs: [
          "Fee-simple townhomes normally receive the house-level inspection scope. Condominium-form townhomes use the applicable condominium limitations.",
        ],
      },
      {
        title: "Buyers of One-to-Four-Unit Properties",
        paragraphs: [
          "Rivermark may inspect qualifying duplexes, triplexes, and four-unit residential properties. Every contracted unit and applicable common area is inspected rather than relying on a sample.",
        ],
      },
      {
        title: "Sellers, Homeowners, and Residential Investors",
        paragraphs: [
          "Pre-listing, maintenance, and investment inspections use the full residential inspection foundation but are adapted to different customer objectives and reporting needs.",
        ],
      },
    ] as const satisfies readonly ContentGroup[],
    link: {
      label: "Explore Other Residential Services",
      route: "otherResidentialServices",
    },
  },
  scope: {
    title:
      "A broad residential evaluation, organized by system.",
    introduction: [
      "The exact systems present, accessible, and operable vary from one property to another. Rivermark evaluates the applicable visible and reasonably accessible areas using the conditions present on inspection day.",
    ],
    groups: [
      {
        title: "Site, Drainage, and Exterior",
        paragraphs: [
          "Visible grading, drainage, walkways, driveways, exterior cladding, trim, penetrations, doors, windows, decks, porches, steps, guards, handrails, and materially relevant retaining conditions.",
        ],
      },
      {
        title: "Roofing and Attic",
        paragraphs: [
          "Visible roof coverings, drainage components, penetrations, flashing conditions, and reasonably accessible attic framing, sheathing, insulation, ventilation, and moisture indicators.",
        ],
      },
      {
        title: "Structure and Foundation",
        paragraphs: [
          "Visible foundations, basements, crawlspaces, framing, beams, columns, floors, roof framing, altered supports, movement indicators, deterioration, and moisture-related damage.",
        ],
      },
      {
        title: "Electrical",
        paragraphs: [
          "Visible service and distribution components, wiring observations, grounding and bonding conditions, accessible switches, lighting, receptacles, and installed protection devices when they can be evaluated safely.",
        ],
      },
      {
        title: "Heating, Cooling, and Ventilation",
        paragraphs: [
          "Installed heating and cooling equipment, visible distribution systems, normal operating controls, venting, condensate components, representative temperature information, and related ventilation conditions.",
        ],
      },
      {
        title: "Plumbing and Water Heating",
        paragraphs: [
          "Visible supply and drainage components, fixtures, toilets, water-heating equipment, functional flow and drainage observations, active leakage, representative water pressure, and hot-water temperature when suitable access is available.",
        ],
      },
      {
        title: "Interior and Installed Components",
        paragraphs: [
          "Accessible walls, ceilings, floors, stairs, guards, handrails, doors, windows, cabinets, counters, and installed kitchen appliances operated through normal controls when conditions permit.",
        ],
      },
      {
        title: "Insulation, Moisture, Garage, and Related Systems",
        paragraphs: [
          "Visible insulation and ventilation, moisture indicators, garage components, overhead doors, smoke and carbon-monoxide alarms, sump systems, sewage ejectors, and other applicable residential components.",
        ],
      },
    ] as const satisfies readonly ContentGroup[],
    clarification:
      "This grouped description explains the general scope. It is not a promise that every component will be present, accessible, operable, or free of concealed or intermittent conditions.",
  },
  approach: {
    title: "Methodical where conditions allow. Candid when they do not.",
    introduction: [
      "A useful inspection requires both a consistent process and enough judgment to adapt to the actual property.",
    ],
    groups: [
      {
        title: "Normal Operation Where Appropriate",
        paragraphs: [
          "Accessible systems and installed equipment are evaluated through ordinary controls when conditions make operation reasonable and safe.",
          "Rivermark does not restore shut-down utilities, energize disconnected systems, force components, dismantle equipment, or create a property-damage risk merely to complete a checklist.",
        ],
      },
      {
        title: "Roofs, Attics, and Crawlspaces",
        paragraphs: [
          "A roof may be walked when its material, slope, height, access, weather, surface condition, and damage risk make walking reasonable.",
          "Attics and crawlspaces may be entered when they are reasonably accessible, safe, and unlikely to be damaged.",
          "When direct access is not reasonable, Rivermark uses the best useful available vantage points and documents the limitation.",
        ],
      },
      {
        title: "Limitations Are Documented",
        paragraphs: [
          "Stored belongings, locked areas, unsafe conditions, weather, snow, utilities, occupancy, access restrictions, property condition, and other circumstances can limit an inspection.",
          "The report explains material limitations so you understand which areas or conditions could not be evaluated.",
        ],
      },
      {
        title: "Tools Support the Inspection",
        paragraphs: [
          "A thermal camera, moisture meter, electrical testers, temperature instruments, and other tools may be used when they provide useful context. Targeted thermal-camera use is included at the inspector's discretion; it does not include a systematic whole-home scan or a separate thermal deliverable.",
          "Those tools support the visual inspection. They do not see through walls, establish every concealed condition, or replace evaluation by the appropriate specialist.",
        ],
      },
      {
        title: "Photographs With a Purpose",
        paragraphs: [
          "The report uses relevant photographs to document material findings, significant limitations, system context, equipment information, and useful representative conditions.",
          "Each photograph should help explain a condition, its location, or the limits of the inspection.",
        ],
      },
      {
        title: "Findings Kept in Proportion",
        paragraphs: [
          "Material concerns are stated directly. Matters needing professional evaluation are identified. Maintenance and lower-priority conditions are organized so they do not compete with more important findings.",
        ],
      },
    ] as const satisfies readonly ContentGroup[],
  },
  limitations: {
    title: "A home inspection has real boundaries.",
    introduction: "A Rivermark inspection is not:",
    items: [
      "Engineering or structural certification",
      "Municipal code inspection or approval",
      "An appraisal or property-value opinion",
      "A repair estimate, construction bid, or renovation plan",
      "Destructive or invasive investigation",
      "Environmental or laboratory testing unless separately contracted",
      "A warranty or guarantee",
      "Proof that every concealed, intermittent, latent, or future condition was found",
    ],
    paragraphs: [
      "The inspection reports visible and reasonably accessible conditions under the circumstances present on the inspection date.",
      "When observed evidence exceeds what a visual home inspection can determine, Rivermark may recommend evaluation by the appropriate qualified professional.",
    ],
  },
  attendance: {
    guideLink: { label: "Plan your inspection as a buyer", route: "buyers" },
    title: "Attend the inspection in the way that works best for you.",
    paragraphs: [
      "Clients may attend all or part of the inspection.",
      "Reasonable questions are welcome, but your inspector needs uninterrupted periods to work safely, operate systems, take measurements, document conditions, and complete the inspection methodically.",
      "Clients who do not attend throughout are encouraged to arrive for approximately the final 45–60 minutes.",
      "If you cannot attend, you receive the normal report and a reasonable scheduled remote review. A second onsite walkthrough is not automatically included.",
    ],
    walkthrough: {
      title: "The Prioritized Walkthrough",
      introduction:
        "The final walkthrough is normally planned around 30–45 minutes, depending on the property and the findings.",
      items: [
        "Apparent urgent safety or active-damage concerns",
        "Material property conditions",
        "Matters needing further professional evaluation",
        "Near-term repair or attention needs",
        "Important maintenance and monitoring items",
        "Significant inspection limitations",
        "Questions the client should resolve",
      ],
      paragraphs: [
        "Rivermark walks through important findings, explains why they matter and answers reasonable questions. You can discuss maintenance priorities and what deserves a closer look from the appropriate professional. Urgent concerns are communicated promptly, without waiting for the closing walkthrough.",
        "Onsite explanations remain preliminary while the inspector reviews the photographs, notes, measurements, and related observations. Use the delivered written report as the inspection record. Any later correction or addendum is documented separately and dated.",
      ],
    },
  },
  report: {
    guideLink: { label: "How to read your home inspection report", route: "homeInspectionReportResource" },
    title: "A report designed to help you understand what happens next.",
    paragraphs: [
      "The written report organizes material observations, relevant photographs, professional-evaluation needs, near-term attention, maintenance considerations, lower-priority observations, and material limitations.",
    ],
    listIntroduction: "Recommendations are written to help you understand:",
    items: [
      "Why the condition matters",
      "Whether prompt attention appears warranted",
      "What type of professional may be appropriate",
      "What could not be determined during the inspection",
      "What should be monitored or maintained over time",
    ],
    support: [
      "Repair pricing, contractor bids, negotiation strategy, concession recommendations, and the decision whether to purchase remain outside the service.",
      "Approximately 30 calendar days of reasonable report-related email support are included for the original client.",
      "That email support does not include contractor management, repeated bid review, repair-demand drafting, renovation planning, diagnosis of new conditions through messages, or another site visit.",
      "Ask about a finding, recommendation, limitation, priority, or the type of professional to consider.",
    ],
    ownership: {
      title: "Included guidance for taking possession",
      paragraphs: [
        "With a full buyer inspection, you also receive a home-specific systems and maintenance packet drawn from the reviewed inspection information. It brings together identified systems and features, documented controls and shutoffs, and practical maintenance and ownership priorities.",
        "One short scheduled remote explanation session is included when requested after taking possession. Confirm your expected possession timing with Rivermark so packet delivery and the requested session can be coordinated. This benefit also applies to condominium buyer inspections within the contracted unit and applicable exclusive-use scope; it does not assume responsibility for association common elements.",
        "The packet and session are separate from approximately 30 days of report-related email support; later possession does not remove the included session. They are an educational companion to the report, not a new inspection, another site visit or open-ended support. Standalone tests, limited consultations, seller inspections and follow-up visits do not automatically include this buyer benefit.",
      ],
    },
  },
  pricing: {
    title: "Straightforward starting prices without an automatic age surcharge.",
    price: {
      introductory: { label: "Introductory price", amount: `$${promotion.residentialIntroPrice}` },
      standard: { label: "Standard price", amount: `$${promotion.residentialStandardPrice}` },
    },
    paragraphs: [
      "The starting price covers up to 3,000 square feet of total inspected main-building floor area.",
      "Finished and unfinished basement areas count toward the total. Garages, porches, decks, sheds, detached structures, and detached dwellings are treated separately.",
      "One ordinary detached residential garage is included. One ordinary, reasonably accessible small storage shed may receive a limited visual observation.",
      "Additional main-building area is priced in 500-square-foot increments through 6,000 square feet. Properties above 6,000 square feet and materially unusual assignments require manual review.",
      "Rivermark does not apply an automatic home-age surcharge at launch.",
      "Minor differences between listing, assessor, and actual property information do not create surprise onsite charges. An accepted quote based on materially accurate information is honored unless the customer changes the scope or the property information is materially different.",
    ],
    clarification:
      "The inspection scope follows the property and contracted service.",
    supportingAction: { label: "View Complete Pricing", route: "pricing" },
  },
  optionalServices: {
    title: "Separate services for questions a visual inspection cannot answer.",
    items: [
      {
        route: "radonTesting",
        title: "Radon Testing",
        paragraphs: [
          "A home inspection cannot determine the property's radon level by sight.",
          "Professional radon measurement uses a continuous monitor and a defined measurement process. The separate written report documents the result, measurement conditions, validity review, limitations, and appropriate next-step context.",
        ],
        price: {
          introductory: { label: "Introductory price", amount: "$150" },
          standard: { label: "Standard price", amount: "$175" },
        },
        link: { label: "Learn About Radon Testing", route: "radonTesting" },
      },
      {
        route: "sewerScope",
        title: "Sewer Scope",
        paragraphs: [
          "The ordinary home inspection does not determine the condition of the concealed underground building sewer.",
          "A sewer scope uses a camera to observe one primary building sewer from a suitable, readily accessible cleanout or agreed access point. The service includes recorded video, concise findings, observed coverage, stopping point, and material limitations.",
        ],
        price: {
          introductory: { label: "Introductory price", amount: "$150" },
          standard: { label: "Standard price", amount: "$175" },
        },
        link: {
          label: "Learn About Sewer Scope Inspections",
          route: "sewerScope",
        },
      },
    ],
  },
  propertyTypes: {
    title: "Different property configurations need different treatment.",
    groups: [
      {
        title: "Condominiums",
        paragraphs: [
          "Condominium pricing and scope are based primarily on the contracted unit, systems directly serving it, and accessible exclusive-use components.",
          "Association-owned common elements are not comprehensively inspected unless separately agreed and lawfully accessible.",
        ],
      },
      {
        title: "Fee-Simple Townhomes",
        paragraphs: [
          "Fee-simple townhomes normally receive the standard house scope and house pricing.",
          "Condominium-form townhomes use condominium scope and pricing.",
        ],
      },
      {
        title: "Duplexes, Triplexes, and Four-Unit Properties",
        paragraphs: [
          "Qualifying residential properties with up to four dwelling units may be inspected.",
          "Every contracted unit and applicable common area is inspected rather than relying on representative sampling. Additional-unit pricing applies.",
        ],
      },
      {
        title: "Detached Dwellings",
        paragraphs: [
          "A detached accessory dwelling, guest house, or finished residential structure receives separate dwelling-level scope and pricing.",
        ],
      },
      {
        title: "Garages, Workshops, and Other Structures",
        paragraphs: [
          "One ordinary detached residential garage is included with the full inspection. Additional garages, workshops, powered buildings, finished structures, and complex outbuildings may require an adjustment or custom quote.",
        ],
      },
      {
        title: "Large or Unusual Properties",
        paragraphs: [
          "Properties involving more than four units, mixed use, extensive commercial or agricultural elements, numerous complex buildings, significant access restrictions, extensive document review, or other nonstandard conditions require manual review.",
        ],
      },
    ] as const satisfies readonly ContentGroup[],
    link: {
      label: "Compare Other Residential Services",
      route: "otherResidentialServices",
    },
  },
  process: {
    title: "From the first price check through the written report.",
    steps: [
      {
        title: "Get a Property-Specific Quote and See Available Times",
        paragraphs: [
          "Start with Price & Availability to enter the property details and requested services, review the calculated quote, and see available appointment times.",
          "Standard assignments will be able to continue through online scheduling. Large, unusual, multi-unit, multi-building, outer-area, or otherwise complex properties may require manual review.",
        ],
      },
      {
        title: "Receive Preparation and Access Instructions",
        paragraphs: [
          "Before the appointment, confirm the selected services, estimated duration, agreement and payment requirements, attendance, utilities, access, occupancy, pets, additional buildings, and service-specific preparation with Rivermark.",
          "The estimated duration is useful for planning but is not a guaranteed departure time.",
        ],
      },
      {
        title: "Complete the Inspection and Walkthrough",
        paragraphs: [
          "Your inspector works through the property methodically, documents relevant conditions and limitations, and adapts the sequence when weather, access, occupancy, layout, or safety requires it.",
          "The visit concludes with a prioritized walkthrough for the client and authorized participants.",
        ],
      },
      {
        title: "Review the Written Report",
        paragraphs: [
          "Onsite explanations remain preliminary until report review and quality control are complete.",
          "Read the complete report for the findings, photographs, recommendations, and limitations. The original client can ask reasonable report-related questions by email for approximately 30 calendar days.",
        ],
      },
    ] as const satisfies readonly ContentGroup[],
  },
  faqs: {
    title: "Residential Inspection FAQs",
  },
  finalConversion: {
    title: "Start with the property and the questions you need answered.",
    paragraphs: [
      "Use Price & Availability for a standard residential quote and available times. Complete the required booking steps before treating an appointment as confirmed.",
      "For a property needing more time or a different scope, choose Help with a property or quote on Contact so Rivermark can assess the service, price, and appointment fit.",
    ],
    primaryAction: {
      label: "See Price & Availability",
      route: "priceAvailability",
    },
    secondaryAction: { label: "View Complete Pricing", route: "pricing" },
    fallback: {
      text: "Have a large, unusual, multi-unit, or multi-building property?",
      action: { label: "Get help with the property", route: "contact" },
    },
  },
} as const;
