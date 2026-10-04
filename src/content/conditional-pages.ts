import type { SiteRouteKey } from "@/config/routes";
import type { ConditionalRoute } from "@/config/publication";

export type ConditionalPageContent = Readonly<{
 slug: string; route: ConditionalRoute; title: string; finalTitle: string; eyebrow: string; introduction: readonly string[];
 metadata: { title: string; description: string }; related: readonly SiteRouteKey[];
}>;

export const conditionalPages = {
  "radonTesting": {
    "slug": "radon-testing",
    "route": "radonTesting",
    "title": "Professional Radon Testing",
    "finalTitle": "Add radon measurement to the inspection or schedule it separately.",
    "eyebrow": "Add-on or standalone measurement",
    "introduction": [
      "Measure radon at the property and understand the result in context. Rivermark uses a professional continuous monitor, reviews the data and conditions for validity or possible interference, and provides a written report with the result, material conditions, limitations, and appropriate next steps.",
      "The service may be added to a full residential inspection or ordered separately. It normally requires equipment placement and retrieval.",
      "Rivermark measures radon. Rivermark does not perform mitigation, design mitigation systems, or sell mitigation work."
    ],
    "metadata": {
      "title": "Radon Testing in Grand Rapids MI | Rivermark",
      "description": "Professional continuous radon measurement for Grand Rapids and West Michigan, available with a home inspection or as a standalone service."
    },
    "related": [
      "residentialHomeInspections",
      "pricing",
      "buyers",
      "agents",
      "serviceArea",
      "homeInspectionExpectationsResource"
    ]
  },
  "sewerScope": {
    "slug": "sewer-scope",
    "route": "sewerScope",
    "title": "Sewer Scope Inspections",
    "finalTitle": "Add a sewer scope to the inspection or schedule it separately.",
    "eyebrow": "Add-on or standalone camera service",
    "introduction": [
      "A Rivermark sewer scope is a camera inspection of one primary building sewer from one suitable, readily accessible cleanout or agreed access point toward the municipal or association connection—or toward the septic tank when applicable.",
      "You receive the recorded video, concise written findings, selected images, observed coverage, the endpoint or stopping point, and material limitations.",
      "An ordinary home inspection does not determine the condition of the concealed underground building sewer."
    ],
    "metadata": {
      "title": "Sewer Scope Inspections in Grand Rapids MI | Rivermark",
      "description": "Sewer-camera inspections for one primary building sewer from a suitable access point, with recorded video, concise findings, transparent pricing, and clear limitations."
    },
    "related": [
      "residentialHomeInspections",
      "pricing",
      "buyers",
      "agents",
      "serviceArea",
      "homeInspectionExpectationsResource"
    ]
  },
  "thermalImaging": {
    "slug": "thermal-imaging",
    "route": "thermalImaging",
    "title": "Residential Thermal Imaging Services",
    "finalTitle": "Choose a defined thermal service—or request review for a complex objective.",
    "eyebrow": "Thermal services for defined property questions",
    "introduction": [
      "A thermal camera displays surface-temperature patterns that may help identify areas deserving closer evaluation.",
      "It does not see through walls, determine a concealed condition by itself, or prove the cause of a temperature difference without supporting evidence.",
      "Rivermark distinguishes between targeted discretionary camera use during a full residential inspection and separately contracted paid thermal services with broader coverage, preparation, documentation, and analysis."
    ],
    "metadata": {
      "title": "Thermal Imaging Services in Grand Rapids | Rivermark",
      "description": "Residential thermal imaging for defined property questions, with controlled interpretation, environmental requirements, relevant visible-light comparisons, and clear limitations."
    },
    "related": [
      "residentialHomeInspections",
      "pricing",
      "otherResidentialServices",
      "serviceArea",
      "homeInspectionReportResource"
    ]
  },
  "sampleReport": {
    "slug": "sample-report",
    "route": "sampleReport",
    "title": "See How Rivermark Reports Findings",
    "finalTitle": "Explore inspection scope and pricing.",
    "eyebrow": "Understanding the written report",
    "introduction": [
      "A Rivermark report explains observed conditions, their significance, and useful next steps in an organized written record.",
      "The summary provides orientation; the complete report supplies the supporting photographs, context, recommendations, and material limitations."
    ],
    "metadata": {
      "title": "Sample Home Inspection Report | Rivermark",
      "description": "View Rivermark’s fictional Residential sample PDF and learn how observations, priorities, illustrations, limitations, and practical next steps fit together."
    },
    "related": [
      "homeInspectionReportResource",
      "buyers",
      "residentialHomeInspections",
      "pricing"
    ]
  }
} as const satisfies Record<ConditionalRoute, ConditionalPageContent>;
