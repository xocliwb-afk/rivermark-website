import type { SiteRouteKey } from "@/config/routes";

export type FaqPageLink = Readonly<{
  label: string;
  route: SiteRouteKey;
}>;

export const faqPageContent = {
  metadata: {
    title: "Home Inspection FAQs | Rivermark Home Inspections",
    description:
      "Answers about Rivermark pricing, booking, inspection day, reports, services, scope, property types, travel, and manual review in Grand Rapids and West Michigan.",
    openGraphTitle: "Frequently Asked Questions | Rivermark",
    openGraphDescription:
      "Clear answers about booking, pricing, attendance, reports, service scope, optional services, and unusual properties.",
  },
  hero: {
    eyebrow: "Direct answers before you schedule",
    title: "Frequently Asked Questions",
    paragraphs: [
      "Find answers about prices, inspection day, reports, and choosing a service. Links to the relevant pages provide more detail when you need it.",
      "Confirm service availability and any unusual property details before relying on an appointment. Your inspection agreement, accepted order, and property-specific confirmation establish the agreed service.",
    ],
    primaryAction: {
      label: "See Price & Availability",
      route: "priceAvailability",
    },
    secondaryAction: { label: "View Pricing", route: "pricing" },
  },
  categoryNavigationLabel: "FAQ categories",
  final: {
    eyebrow: "A property-specific next step",
    title: "Still deciding? Start with a property-specific quote.",
    paragraphs: [
      "Use Price & Availability for a standard residential quote and available times. Complete the required booking steps before treating an appointment as confirmed.",
      "Review Pricing and Residential Home Inspections for the full detail. If the property or question needs a person, use Contact for a short question or Manual Review.",
    ],
    primaryAction: {
      label: "See Price & Availability",
      route: "priceAvailability",
    },
    supportingActions: [
      { label: "View Pricing", route: "pricing" },
      {
        label: "Residential Home Inspections",
        route: "residentialHomeInspections",
      },
      { label: "Contact Rivermark", route: "contact" },
    ],
  },
} as const;
