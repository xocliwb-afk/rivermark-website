import "server-only";

export const contactContent = {
  metadata: {
    title: "Contact Rivermark Home Inspections",
    description: "Call or message Rivermark about an inspection, a property or quote, an existing report, accessibility, scheduling, or another question.",
    openGraphTitle: "Contact Rivermark",
    openGraphDescription: "Have a question about an inspection or a property? Call or send a message.",
  },
  hero: {
    eyebrow: "Questions welcome",
    title: "Contact Rivermark",
    introduction: "Have a question about an inspection or a property? Call or send a message.",
  },
  form: {
    title: "How can Rivermark help?",
    introduction: "Choose a topic and share your question. For property or quote help, you can add the details you know; a complete address or technical answer is not required.",
    pricing: "For a standard inspection quote and available appointments, visit",
    newConstruction: "New Construction is Not Currently Scheduling.",
    newConstructionLink: "Express interest in future availability",
  },
  emergency: {
    title: "This is not an emergency channel.",
    description: "For an apparent active fire, fuel, electrical, structural, flooding, medical or other immediate emergency, contact the appropriate emergency service or responsible property party. Rivermark does not provide emergency response.",
  },
} as const;
