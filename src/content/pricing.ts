import { travelCopy } from "@/config/travel-policy";
import { promotion, promotionExplanation } from "@/config/publication";
import type { SiteRouteKey } from "@/config/routes";

export type PricingPageLink = Readonly<{
  label: string;
  route: SiteRouteKey;
}>;

export const pricingContent = {
  metadata: {
    title: "Home Inspection Pricing in Grand Rapids MI | Rivermark",
    description:
      "See Rivermark's home inspection prices, size tiers, condo pricing, optional services, property adjustments, and manual-review rules for Grand Rapids and West Michigan.",
    openGraphTitle: "Straightforward Home Inspection Pricing | Rivermark",
    openGraphDescription:
      "Complete public pricing, clear adjustments, and no automatic age surcharge.",
  },
  hero: {
    eyebrow: "Public pricing before you book",
    title: "Straightforward Home Inspection Pricing",
    paragraphs: [
      `A full residential inspection begins at the standard rate of $${promotion.residentialStandardPrice} through 3,000 square feet of total inspected main-building floor area. ${promotionExplanation()}`,
      "Review the size tiers, included work, and property adjustments below. Then use Price & Availability for a property-specific quote and available times, or choose Help with a property or quote on Contact for an unusual assignment.",
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
  quickAnswer: {
    title: "Quick Price Answer",
    house: {
      title: "Full residential inspection",
      introductory: {
        label: "Introductory starting price",
        amount: `$${promotion.residentialIntroPrice}`,
      },
      standard: { label: "Standard starting price", amount: `$${promotion.residentialStandardPrice}` },
      scope: "Through 3,000 square feet of total inspected main-building area.",
    },
    condominium: {
      title: "Condominium inspection",
      introductory: {
        label: "Introductory starting price",
        amount: "$300",
      },
      standard: { label: "Standard starting price", amount: "$350" },
      scope: "Through 1,500 square feet of the contracted unit.",
    },
    included: {
      title: "What the full residential price includes",
      items: [
        "The agreed visual, non-invasive inspection of visible and reasonably accessible residential systems",
        "A prioritized walkthrough and written report with relevant photographs",
        "Approximately 30 calendar days of reasonable report-related email support for the original client",
        "For full buyer inspections: a home-specific systems and maintenance packet for taking possession, plus one short scheduled remote explanation session when requested",
        "One qualifying ordinary detached residential garage for applicable house inspections",
        "Normal electronic-payment processing",
      ],
      qualification: "Scope follows the property and agreed service. The buyer packet and requested remote session also apply to applicable condominium buyer inspections within the unit and exclusive-use scope. They are separate from report-related email support and remain available when possession falls after that period; they are not automatically included with standalone tests, limited consultations, seller inspections or follow-up visits. Condominium inspections focus on the contracted unit, directly serving systems and accessible exclusive-use components; added services and unusual properties have separate requirements.",
    },
    guideLink: { label: "Understand what affects home inspection cost", route: "homeInspectionCostResource" },
    action: { label: "See Price & Availability", route: "priceAvailability" },
  },
  calculation: {
    title:
      "The price is based on the work the property requires—not an automatic old-house fee.",
    groups: [
      {
        title: "Main-building area",
        paragraphs: [
          "Use the total reasonably available floor area of the primary building, including finished and unfinished basement areas.",
          "Do not include garages, porches, decks, sheds, detached structures, or detached dwellings in that number. Those are handled separately.",
        ],
      },
      {
        title: "No automatic age surcharge",
        paragraphs: [
          "Rivermark does not add a routine surcharge simply because a home is older.",
          "A materially unusual property may still require manual review when its size, number of systems, number of units, buildings, access restrictions, mixed use, or other conditions change the assignment.",
        ],
      },
      {
        title: "Ordinary electronic payment is included",
        paragraphs: [
          "Rivermark's published prices include normal electronic-payment processing. A routine card surcharge is not added at checkout.",
        ],
      },
      {
        title: "Minor data differences do not create surprise onsite charges",
        paragraphs: [
          "Listing, assessor, and customer-supplied property information do not always match perfectly.",
          "A small discrepancy does not trigger a surprise charge at the property. A materially inaccurate size, unit count, structure count, ownership form, or added service may require a revised scope and price before the added work proceeds.",
        ],
      },
      {
        title: "An accurate accepted quote is protected",
        paragraphs: [
          "When the customer supplied materially accurate information and did not later expand the scope, Rivermark honors the accepted quote.",
        ],
      },
    ],
  },
  housePricing: {
    title: "Full-Scope House Pricing",
    introduction: [
      "These prices apply to Residential Buyer, Pre-Listing, Home Maintenance, and single-family Investment Property Inspections using the standard full-scope residential foundation.",
    ],
    table: {
      caption:
        "Full-scope house prices by total inspected main-building floor area",
      firstColumnLabel: "Total inspected main-building floor area",
      columns: [
        { label: "Introductory price", numeric: true },
        { label: "Standard price", numeric: true },
      ],
      rows: [
        { label: "Up to 3,000 sq. ft.", values: [`$${promotion.residentialIntroPrice}`, `$${promotion.residentialStandardPrice}`] },
        { label: "3,001–3,500 sq. ft.", values: ["$440", "$490"] },
        { label: "3,501–4,000 sq. ft.", values: ["$480", "$530"] },
        { label: "4,001–4,500 sq. ft.", values: ["$520", "$570"] },
        { label: "4,501–5,000 sq. ft.", values: ["$560", "$610"] },
        { label: "5,001–5,500 sq. ft.", values: ["$600", "$650"] },
        { label: "5,501–6,000 sq. ft.", values: ["$640", "$690"] },
        { label: "Above 6,000 sq. ft.", values: ["Manual review", "Manual review"] },
      ],
    },
    paragraphs: [
      "One ordinary detached residential garage is included. One ordinary accessible small storage shed may receive a limited visual observation when little additional time is required.",
    ],
    link: {
      label: "Residential Home Inspection Scope",
      route: "residentialHomeInspections",
    },
  },
  condominiumPricing: {
    title: "Condominium Pricing",
    introduction: [
      "Condominium-form properties use a separate price structure because the inspection normally focuses on the contracted unit, the systems directly serving it, and reasonably accessible exclusive-use components.",
    ],
    table: {
      caption: "Condominium prices by contracted unit size",
      firstColumnLabel: "Contracted unit size",
      columns: [
        { label: "Introductory price", numeric: true },
        { label: "Standard price", numeric: true },
      ],
      rows: [
        { label: "Up to 1,500 sq. ft.", values: ["$300", "$350"] },
        { label: "1,501–2,000 sq. ft.", values: ["$340", "$390"] },
        { label: "2,001–2,500 sq. ft.", values: ["$380", "$430"] },
        { label: "2,501–3,000 sq. ft.", values: ["$420", "$470"] },
        {
          label: "Above 3,000 sq. ft.",
          values: [
            "Manual review",
            "Manual review or approved continued increments",
          ],
        },
      ],
    },
    paragraphs: [
      "Fee-simple townhomes use the house price grid. Condominium-form townhomes use the condominium grid.",
      "Private garages, multiple HVAC systems, multiple electrical panels, extensive exclusive-use areas, unusual multi-level configurations, or materially broader lawful access may require review.",
    ],
  },
  conditionalPricing: {
    title: "Optional service pricing",
    serviceAndCombinationTable: {
      caption: "Optional services and combinations",
      firstColumnLabel: "Service or combination",
      columns: [
        { label: "Introductory price", numeric: true },
        { label: "Standard price", numeric: true },
      ],
      rows: [
        {
          label: "Radon testing added to a full inspection",
          values: ["$150", "$175"],
          requiredRoutes: ["radonTesting"],
        },
        {
          label: "Standalone radon test",
          values: ["$225", "$250"],
          requiredRoutes: ["radonTesting"],
        },
        {
          label: "Sewer scope added to a full inspection",
          values: ["$150", "$175"],
          requiredRoutes: ["sewerScope"],
        },
        {
          label: "Standalone sewer scope",
          values: ["$250", "$275"],
          requiredRoutes: ["sewerScope"],
        },
        {
          label: "Full inspection with radon",
          values: ["$550", "$625"],
          requiredRoutes: ["radonTesting"],
        },
        {
          label: "Full inspection with sewer scope",
          values: ["$550", "$625"],
          requiredRoutes: ["sewerScope"],
        },
        {
          label: "Full inspection with radon and sewer scope",
          values: ["$675", "$750"],
          requiredRoutes: ["radonTesting", "sewerScope"],
        },
      ] as const satisfies readonly Readonly<{
        label: string;
        values: readonly string[];
        requiredRoutes: readonly SiteRouteKey[];
      }>[],
    },
    thermalTable: {
      caption: "Paid thermal services",
      firstColumnLabel: "Paid thermal service",
      columns: [{ label: "Price", numeric: true }],
      requiredRoutes: ["thermalImaging"],
      rows: [
        {
          label: "Expanded systematic thermal scan added to a full inspection",
          values: ["$100"],
        },
        {
          label: "Enhanced building-envelope thermal assessment",
          values: ["Starting at $225"],
        },
        {
          label: "Targeted standalone thermal assessment through 60 onsite minutes",
          values: ["$195"],
        },
        {
          label: "Whole-home thermal screening through 2,500 sq. ft.",
          values: ["$300"],
        },
        {
          label: "Each additional 500 sq. ft. for whole-home screening",
          values: ["+$40"],
        },
      ],
    },
  },
  limitedServices: {
    title: "Limited Consultations and Repair Follow-Up",
    items: [
      {
        title: "Pre-Offer Walk-Through Consultation",
        price: "$275",
        paragraphs: [
          "Includes up to 90 scheduled onsite minutes, a verbal consultation, selected photographs, and a concise written summary focused on the limited agreed purpose.",
        ],
      },
      {
        title: "Investor Property Consultation",
        price: "$300",
        paragraphs: [
          "Includes up to 90 scheduled onsite minutes, a verbal consultation, selected photographs, and a concise investor-oriented condition summary.",
        ],
      },
      {
        title: "Repair Follow-Up Visit",
        price: "$195",
        paragraphs: [
          "Includes pre-review of the submitted item list, one scheduled visit, up to 60 onsite minutes, appropriate photographs or instruments, and a separate supplemental report.",
          "Additional onsite time is $75 per 30 minutes.",
        ],
      },
    ],
    clarification:
      "Limited consultations are not discounted full inspections. A Repair Follow-Up Visit does not certify workmanship, permits, code compliance, concealed repairs, or future performance.",
    link: {
      label: "Compare Other Residential Services",
      route: "otherResidentialServices",
    },
  },
  adjustments: {
    title: "Additional Units, Dwellings, and Structures",
    groups: [
      {
        title: "Additional dwelling units inside the primary building",
        table: {
          caption: "Additional in-building dwelling-unit adjustments",
          firstColumnLabel: "Property configuration",
          columns: [{ label: "Adjustment", numeric: true }],
          rows: [
            { label: "Duplex", values: ["+$100"] },
            { label: "Triplex", values: ["+$200"] },
            { label: "Four-unit property", values: ["+$300"] },
          ],
        },
        paragraphs: [
          "Every contracted unit and applicable common area is inspected rather than using a representative sample.",
        ],
      },
      {
        title: "Detached accessory dwelling or guest house",
        table: {
          caption: "Additional detached-dwelling prices by size",
          firstColumnLabel: "Detached dwelling size",
          columns: [{ label: "Additional price", numeric: true }],
          rows: [
            { label: "Up to 1,000 sq. ft.", values: ["$250"] },
            { label: "1,001–1,500 sq. ft.", values: ["$290"] },
            { label: "1,501–2,000 sq. ft.", values: ["$330"] },
            { label: "2,001–2,500 sq. ft.", values: ["$370"] },
            { label: "Each additional 500 sq. ft.", values: ["+$40"] },
          ],
        },
        paragraphs: [
          "A detached dwelling receives dwelling-level scope. The ordinary in-building unit adjustment is not also charged for the same detached dwelling.",
        ],
      },
      {
        title: "Additional structures",
        table: {
          caption: "Additional structure adjustments",
          firstColumnLabel: "Additional structure",
          columns: [{ label: "Adjustment", numeric: true }],
          rows: [
            {
              label:
                "Additional ordinary garage or simple outbuilding through 1,000 sq. ft.",
              values: ["+$75"],
            },
            {
              label: "Powered workshop or structure from 1,001–2,000 sq. ft.",
              values: ["Starting at +$125"],
            },
            {
              label: "Additional small shed receiving limited observation",
              values: ["+$25"],
            },
            {
              label:
                "Larger, finished, heated, plumbed, agricultural, or complex structure",
              values: ["Manual review"],
            },
          ],
        },
        paragraphs: [
          "One ordinary detached residential garage and one limited observation of one ordinary accessible small storage shed are already included with a full inspection.",
        ],
      },
    ],
  },
  travel: {
    title: "Location can affect the price when the trip materially changes the work.",
    introduction: [
      "Rivermark uses Included, Extended and By-arrangement travel areas.",
    ],
    groups: [
      {
        title: "Included zone",
        paragraphs: [travelCopy.included, "This includes an inspection with radon and its normal retrieval."],
      },
      {
        title: "Extended zone",
        paragraphs: [
          travelCopy.extended,
          travelCopy.exception,
          travelCopy.sharedVisits,
          travelCopy.radon,
          travelCopy.confirmation,
        ],
      },
      {
        title: "By arrangement",
        paragraphs: [
          travelCopy.byArrangement,
          travelCopy.custom,
          travelCopy.locationReview,
          "Choose Help with a property or quote on Contact and share the address and requested services when known. Already accepted quotes are honored; these rules are not applied retroactively.",
        ],
      },
    ],
    link: { label: "View the Service Area", route: "serviceArea" },
  },
  otherCharges: {
    title: "Other Charges Customers Should Know About",
    introduction: [
      "Rivermark uses reasonable grace rather than treating every disruption as an automatic penalty. Charges may apply when late changes, denied access, failed preparation, or special scheduling create real lost time or completed work.",
    ],
    groups: [
      {
        title: "Cancellation or rescheduling",
        items: [
          "24 hours or more: no charge",
          "Less than 24 hours: Rivermark may charge up to $100",
          "Same day, no-show, denied access, or cancellation after travel begins: Rivermark may charge up to $195",
        ],
        paragraphs: [
          "Work already completed—including travel, advance review, site assessment, or report work—remains earned.",
        ],
      },
      {
        title: "A qualifying weather-related return",
        items: [],
        paragraphs: [
          "At launch, Rivermark intends to include one reasonable, limited complimentary return when a materially important component could not be inspected solely because of legitimate weather or seasonal conditions.",
          "The return addresses the previously limited component and produces a brief supplement; it is not a second full inspection and has no new travel surcharge. The complimentary return does not normally apply to utilities that were off, winterization, denied access, stored belongings, missing authorization, or other non-weather limitations.",
        ],
      },
      {
        title: "Special scheduling",
        items: [],
        paragraphs: [
          "An appointment manually opened outside the published schedule may carry a $75 special-scheduling charge. Sunday, holiday, late-evening, or highly disruptive work may require a custom quote.",
          "Detailed terms remain in the applicable agreement and booking confirmation.",
        ],
      },
    ],
  },
  manualReview: {
    title: "When a person needs to review the details",
    introduction: "A request may need individual review when it involves:",
    items: [
      "More than 6,000 square feet",
      "More than four dwelling units",
      "Mixed residential and commercial use",
      "Material agricultural or industrial elements",
      "Several detached buildings or complex structures",
      "A large detached dwelling outside the standard schedule",
      "Extensive duplicated systems",
      "Significant access, occupancy, tenant, or utility restrictions",
      "Outer territory or unusually burdensome travel",
      "Extensive document review",
      "Large third-party Repair Follow-Up assignments",
      "Unusual report separation or reliance requests",
      "Special scheduling outside released availability",
      "Any scope materially different from the standard service definition",
    ],
    clarification:
      "A person reviews the property details to determine the appropriate scope, price, and appointment fit. Sending a request does not reserve a time or confirm acceptance.",
  },
  faqs: {
    title: "Pricing FAQs",
  },
  finalConversion: {
    title: "Review the property-specific price and appointment options.",
    paragraphs: [
      "Use Price & Availability for a standard residential quote and available times. Complete the required booking steps before treating an appointment as confirmed.",
      "For nonstandard work, choose Help with a property or quote on Contact so the scope, price, and appointment can be considered together.",
    ],
    primaryAction: {
      label: "See Price & Availability",
      route: "priceAvailability",
    },
    fallback: {
      text: "Have a large, unusual, multi-unit, multi-building, or outer-area property?",
      action: { label: "Get help with the property", route: "contact" },
    },
  },
} as const;
