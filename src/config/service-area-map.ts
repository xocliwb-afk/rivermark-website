import { travelCopy } from "./travel-policy";
import type { SiteHref } from "./routes";

type ServiceAreaDisplayZone = Readonly<{
  id: "included" | "extended" | "by_arrangement";
  name: string;
  description: string;
  communities: readonly string[];
}>;

type ServiceAreaMapDisplay = Readonly<{
  heroCaption: string;
  fullCaption: string;
  heroLink: Readonly<{ label: string; href: SiteHref }>;
  availability: string;
  zones: readonly ServiceAreaDisplayZone[];
  accessibility: Readonly<Record<"hero" | "full", Readonly<{ title: string; description: string }>>>;
}>;

// A127 public display copy. Community examples do not override physical-location exceptions.
export const serviceAreaMapDisplay = {
  "heroCaption": "Travel included in Grand Rapids, Holland, Grand Haven and Spring Lake.",
  "fullCaption": "Approximate coverage; the property address determines travel.",
  "heroLink": {
    "label": "View service area",
    "href": "/service-area/"
  },
  "availability": "Availability depends on the property and the schedule.",
  "zones": [
    {
      "id": "included",
      "name": "Included",
      "description": travelCopy.included,
      "communities": ["Grand Rapids", "Holland", "Grand Haven", "Spring Lake", "Rockford", "Ada", "Lowell"]
    },
    {
      "id": "extended",
      "name": "Extended",
      "description": travelCopy.extended,
      "communities": ["West Olive", "Macatawa", "Ferrysburg", "Muskegon", "Allegan", "Ionia"]
    },
    {
      "id": "by_arrangement",
      "name": "By arrangement",
      "description": travelCopy.byArrangement,
      "communities": ["Kalamazoo", "Lansing", "Big Rapids", "South Haven"]
    }
  ],
  "accessibility": {
    "hero": {
      "title": "Travel-included area around Grand Rapids",
      "description": "Approximate travel-included coverage around Grand Rapids, Holland, Grand Haven and Spring Lake. The physical property address and municipal exceptions determine travel."
    },
    "full": {
      "title": "Rivermark service area map",
      "description": "Approximate Included, Extended and By arrangement coverage. Grand Rapids, Holland, Grand Haven and Spring Lake outside Ferrysburg are included. Ferrysburg is shown as an Extended exception. Zone descriptions and municipal exceptions are explained in the surrounding text; the physical property address determines travel."
    }
  }
} as const satisfies ServiceAreaMapDisplay;
