import "server-only";
import { travelCopy } from "@/config/travel-policy";
import { manualReviewHref } from "@/config/inquiries";

import type { SiteHref, SiteRouteKey } from "@/config/routes";
import type { SpectoraTransactionMode } from "@/config/spectora-transaction";

export type PriceAvailabilityPageLink = Readonly<{
  label: string;
  route: SiteRouteKey;
}>;

type PriceAvailabilityInlineHelp = Readonly<{
  beforeLink: string;
  link: Readonly<{ label: string; href: SiteHref }>;
  afterLink: string;
}>;

export const priceAvailabilityContent = {
  metadata: {
    title: "See Price & Availability | Rivermark Home Inspections",
    description:
      "Enter property and service details to get a quote and see available times through Spectora. Unusual properties may need individual review.",
  },
  hero: {
    eyebrow: "Property-specific pricing and scheduling",
    title: "See Price & Availability",
    paragraphsByMode: {
      disabled: [
        "Online quoting and scheduling are not open yet. You can review the published pricing rules while Rivermark prepares for launch.",
        "Appointments will become available after the booking process is ready. Unusual properties may require manual review.",
      ],
      hosted: [
        "Review a quote based on your property and service details and see available appointment times in Spectora.",
        "Large, unusual, multi-unit, multi-building, or outer-area assignments may need individual review before an appointment can be confirmed.",
      ],
      embed: [
        "Enter your property and service details to get a quote and see available times through Spectora. Complete the required booking steps before treating an appointment as confirmed.",
      ],
    } satisfies Record<SpectoraTransactionMode, readonly string[]>,
    statusLabel: "Quote through Spectora",
    statusByMode: {
      disabled: "Prelaunch — booking unavailable",
      hosted: "Continue securely in Spectora",
      embed: "Review your quote in Spectora",
    } satisfies Record<SpectoraTransactionMode, string>,
  },
  preparation: {
    eyebrow: "Before you begin",
    title: "What to Have Ready",
    introduction:
      "Have these details ready so the quote reflects the property's actual scope.",
    items: [
      "Property address",
      "Property type",
      "Total inspected main-building floor area, including basement",
      "Approximate year built",
      "Condominium versus fee-simple",
      "Number of dwelling units",
      "Additional garages/structures/detached dwellings",
      "Requested active services",
      "Client and agent contact information",
      "Known access/utility/occupancy/preparation limitations",
    ],
  },
  transaction: {
    eyebrow: "Your property",
    title: "Get Your Quote",
    quoteHelp: {
      beforeLink: "If the quote doesn’t match the services you selected or our published pricing,",
      link: { label: "contact Rivermark", href: manualReviewHref },
      afterLink: " before completing your request.",
    } satisfies PriceAvailabilityInlineHelp,
    disabled: {
      title: "Online booking is not open yet.",
      status: "Prelaunch — booking unavailable",
      paragraphs: [
        "Property-specific quotes and appointment selection are not available yet.",
        "No inspection or order is created here. No information is submitted to Spectora, and no agreement or payment occurs.",
        "Spectora handles inspection quotes, orders, agreements, payments, and reports. Contact Rivermark while online booking is unavailable.",
      ],
    },
    hosted: {
      title: "Continue to your quote",
      paragraphs: [
        "The secure quote and scheduling process will open in the same browser tab.",
        "Review the property-specific quote in Spectora. A quote or selected time is not a confirmed appointment; contact Rivermark if the status or required steps are unclear.",
        travelCopy.confirmation,
        travelCopy.bookingReview,
      ],
      actionLabel: "Continue in Spectora",
    },
    embed: {
      title: "Choose your service and enter the property details",
      paragraphs: [
        "Use the secure quote experience below. If it does not load or you prefer a full-page view, continue directly in Spectora.",
        travelCopy.confirmation,
        travelCopy.bookingReview,
      ],
      iframeTitle: "Rivermark secure price and availability",
      loadingStatus: "Loading your secure quote experience…",
      failureStatus:
        "The quote experience is taking longer than expected. You can retry or continue directly in Spectora.",
      fallbackLabel: "Continue in Spectora",
    },
  },
  manualReview: {
    eyebrow: "A closer look at the property details",
    title: "Get the scope and appointment time right.",
    paragraphs: [
      "Rivermark reviews unusual property details so the scope, price, and appointment time fit the work. This includes houses above 6,000 square feet, condominiums above 3,000 square feet, more than four dwelling units, detached dwellings, multiple buildings, outer-area work, complex structures, and unusual access or scope.",
      "Choose Help with a property or quote on Contact to describe the assignment and obtain a reviewed quote before relying on an automatic price. A request does not create an appointment or guarantee acceptance or price.",
    ],
    contactLink: {
      label: "Get Help with a Property or Quote",
      route: "contact",
    } satisfies PriceAvailabilityPageLink,
  },
  supportingLinks: [
    { label: "View Complete Pricing", route: "pricing" },
    {
      label: "See What the Inspection Covers",
      route: "residentialHomeInspections",
    },
    { label: "Contact Rivermark", route: "contact" },
  ] as const satisfies readonly PriceAvailabilityPageLink[],
} as const;
