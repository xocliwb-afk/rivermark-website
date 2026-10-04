export const newConstructionContent = {
  metadata: {
    title: "New Construction Inspections — Not Currently Scheduling | Rivermark",
    description: "Review Rivermark's planned pre-drywall, final new-construction, and 11-month builder-warranty inspection stages. Not currently scheduling.",
  },
  stages: [
    {
      id: "pre-drywall", title: "Pre-Drywall Inspection",
      timing: "Planned for a suitable stage when rough systems remain visible before insulation and interior finishes conceal them.",
      observations: ["Visible framing, connections, and penetrations", "Accessible exterior moisture-management details", "Visible rough plumbing, electrical, HVAC, and ventilation", "Visible fire- and draft-blocking details, concealment, and access limitations"],
      boundary: "This would not replace engineering, a complete code review, municipal inspections, design approval, or builder quality control.",
    },
    {
      id: "final-construction", title: "Final New-Construction Inspection",
      timing: "Planned for substantial completion before acceptance or closing, with lawful access, utilities, and normal operation available.",
      observations: ["Site, exterior, roofing, and drainage", "Structure, interior, plumbing, electrical, heating, and cooling", "Appliances, attic, insulation, ventilation, and visible moisture concerns", "Garages, stairs, guards, doors, windows, functional finish conditions, and incomplete or limited areas"],
      boundary: "This would not certify completion, permits, contract performance, or acceptance of the home.",
    },
    {
      id: "builder-warranty", title: "11-Month Builder-Warranty Inspection",
      timing: "Planned for visible conditions in an occupied home before the client's applicable builder-warranty deadline.",
      observations: ["Early-occupancy concerns, movement, moisture, and drainage", "Owner-reported functional concerns and accessible residential systems", "Maintenance needs, visible conditions to discuss with the builder, and inspection limitations", "Conditions that warrant evaluation by an appropriate specialist"],
      boundary: "This would not interpret warranty coverage, determine legal rights, make a demand to a builder, guarantee a response, or certify repairs.",
    },
  ],
  faqs: [
    { id: "available", question: "Can I book a new-construction inspection now?", answer: ["No. All three planned stages are Not Currently Scheduling. No appointment, quote, reserved slot, or launch date is being offered."] },
    { id: "reservation", question: "Would expressing interest reserve an appointment?", answer: ["Use the form to share your interest in future availability. The request is nonbinding: it does not reserve a date, establish a price, guarantee availability, or require Rivermark to accept the assignment."] },
    { id: "municipal", question: "Would this replace a municipal inspection?", answer: ["No. An independent client inspection has a different role from builder quality control, municipal inspection, engineering, or a complete code-compliance audit."] },
    { id: "warranty", question: "Would Rivermark decide what the builder must repair?", answer: ["No. An inspection can document observations. It does not interpret the construction contract or warranty, determine coverage, guarantee builder action, or certify concealed repairs."] },
    { id: "completed", question: "What if the home is already completed?", answer: ["A standard Residential Home Inspection may be appropriate after review of the address, completion status, access, utilities, and purpose. A completed home does not automatically qualify, and the standard service is not a substitute name for an unavailable construction-stage inspection."] },
  ],
} as const;
