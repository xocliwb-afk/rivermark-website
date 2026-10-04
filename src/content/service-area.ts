import { travelCopy } from "@/config/travel-policy";
import type { GeographyReadinessCopy } from "@/config/geography-readiness";
import type { SiteRouteKey } from "@/config/routes";
import type { WorkflowCopy } from "@/config/workflows";

export type ServiceAreaPageLink = Readonly<{
  label: string;
  route: SiteRouteKey;
}>;

export const serviceAreaContent = {
  metadata: {
    title: "Home Inspection Service Area | Grand Rapids & West Michigan",
    description:
      "View home inspection coverage around Grand Rapids, Holland, Grand Haven and Spring Lake. Confirm travel and availability for the property address.",
    openGraphTitle: "Where Rivermark Works in West Michigan",
    openGraphDescription:
      "Understand travel considerations and when an assignment needs individual review.",
  },
  hero: {
    eyebrow: "Grand Rapids & West Michigan",
    title: "Where Rivermark Works in West Michigan",
    paragraphs: {
      production: [
        "Normal travel is included in Grand Rapids and nearby communities, including Holland, Grand Haven and Spring Lake outside Ferrysburg. Start with the property’s physical address to confirm coverage.",
        "Availability depends on the requested services, travel, number of visits, and current schedule.",
      ],
      development: [
        "Normal travel is included in Grand Rapids and nearby communities, including Holland, Grand Haven and Spring Lake outside Ferrysburg. Start with the property’s physical address to confirm coverage.",
        "Availability depends on the requested services, travel, number of visits, and current schedule. Contact Rivermark about an outlying property or unusual assignment.",
      ],
    } satisfies GeographyReadinessCopy<readonly string[]>,
    primaryAction: {
      label: "See Price & Availability",
      route: "priceAvailability",
    },
    secondaryAction: { label: "View Pricing", route: "pricing" },

  },
  addressCheck: {
    eyebrow: "Check the Address",
    title: "Start with the property address.",
    paragraphs: {
      production: [
        "Enter the property address and requested services through See Price & Availability.",
        travelCopy.locationReview,
        travelCopy.confirmation,
      ],
      development: [
        "Enter the property address through Price & Availability for a standard residential quote. Send an outlying property through Help with a property or quote on Contact for individual consideration.",
        travelCopy.locationReview,
        travelCopy.confirmation,
      ],
    } satisfies WorkflowCopy<readonly string[]>,
    primaryAction: {
      label: "See Price & Availability",
      route: "priceAvailability",
    },
    fallbackText:
      "Have a multi-visit, outer-area, or unusual assignment? Choose Help with a property or quote on the Contact page to share the property and travel details.",
    fallbackAction: { label: "Contact Rivermark", route: "contact" },
  },
  zones: {
    eyebrow: "Travel and service area",
    title: "Three zones describe how travel changes the assignment.",
    introduction: [
      "The map and community examples are a starting point. Travel follows the inspected property’s physical location, with municipal exceptions to ZIP defaults.",
    ],
  },

  mapException: {
    title: "Ferrysburg is Extended, including properties using 49456.",
    paragraphs: [travelCopy.exception, "The map shows an approximate municipal exception. Confirm the physical property location with Rivermark if the boundary is unclear; a mailing city alone does not establish coverage."],
  },

  multiVisit: {
    eyebrow: "Multi-visit and equipment-dependent travel",
    title: "Account for every visit the service needs.",
    paragraphs: [
      travelCopy.sharedVisits,
      travelCopy.radon,
      travelCopy.custom,
      "Included properties have no normal travel surcharge, including an inspection with radon and its normal retrieval. There is no new travel surcharge for a qualifying complimentary weather return. Already accepted quotes are honored.",
    ],
  },
  faqs: {
    eyebrow: "Service-Area FAQs",
    title: "Questions about location and travel.",
  },
  final: {
    eyebrow: "Check your address",
    title: "Share the address and the services you need.",
    paragraphs: {
      production: [
        "Enter the address and service information to review the property-specific price and available times. Contact Rivermark about an outlying property or unusual assignment.",
      ],
      development: [
        "Use Price & Availability for a standard residential quote and available times. For unusual or outlying work, contact Rivermark; a displayed quote alone does not confirm acceptance of that assignment.",
      ],
    } satisfies WorkflowCopy<readonly string[]>,
    primaryAction: {
      label: "See Price & Availability",
      route: "priceAvailability",
    },
    fallback: {
      text: "Have an unusual route or multi-visit assignment? Choose Help with a property or quote on Contact to share the details.",
      action: { label: "Contact Rivermark", route: "contact" },
    },
  },
} as const;
