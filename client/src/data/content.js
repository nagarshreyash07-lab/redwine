// Default site content. Shown instantly and used as a fallback when the API is offline.
// Projects & insights are SAMPLES — replace them from /admin (or edit server/src/seed.js).

export const capabilities = [
  { id: "01", icon: "Code2", title: "Software & Engineering", text: "Thoughtful software systems, engineered to solve meaningful problems.", points: ["Web platforms & APIs", "Cloud-native architecture", "Security by default"] },
  { id: "02", icon: "Layers", title: "Digital Experiences", text: "Intuitive interfaces and connected experiences made around people.", points: ["Product & interface design", "Motion & interaction", "Design systems"] },
  { id: "03", icon: "FlaskConical", title: "Emerging Technology", text: "Exploring new tools, technologies and possibilities with curiosity.", points: ["Applied AI prototypes", "Rapid experiments", "Technology research"] }
];

// Placeholder numbers — replace with your real figures.
export const stats = [
  { value: 12, suffix: "+", label: "Products shipped" },
  { value: 4, suffix: "", label: "Core disciplines" },
  { value: 100, suffix: "%", label: "Curiosity-led" }
];

export const projects = [
  { _id: "p1", title: "Northstar", category: "Software & Engineering", summary: "A real-time analytics platform that turns scattered data into clear decisions.", tags: ["React", "Node.js", "MongoDB"], year: 2026, accent: "#762d40" },
  { _id: "p2", title: "Lumen", category: "Digital Experiences", summary: "A design system and storefront rebuilt for speed, clarity and delight.", tags: ["Design System", "Motion", "Accessibility"], year: 2026, accent: "#5b3a6b" },
  { _id: "p3", title: "Orbit", category: "Emerging Technology", summary: "An applied-AI assistant prototype exploring how teams find answers faster.", tags: ["AI", "Prototyping", "Research"], year: 2025, accent: "#8a4a2f" },
  { _id: "p4", title: "Meridian", category: "Software & Engineering", summary: "A secure customer portal with role-based access and live status tracking.", tags: ["Security", "Firebase", "APIs"], year: 2025, accent: "#2f5a66" }
];

export const workflow = [
  { step: "01", title: "Discover", text: "We start with better questions — understanding people, problems and possibility." },
  { step: "02", title: "Design", text: "Ideas become clear, intuitive experiences shaped through rapid exploration." },
  { step: "03", title: "Build", text: "Careful engineering turns the concept into something fast, secure and reliable." },
  { step: "04", title: "Evolve", text: "We measure, learn and keep improving long after launch." }
];

export const insights = [
  { _id: "i1", title: "Why curiosity is an engineering practice", category: "Mindset", excerpt: "Better questions up front save months of building the wrong thing.", readTime: 5 },
  { _id: "i2", title: "Designing interfaces that respect attention", category: "Design", excerpt: "Motion, hierarchy and restraint — how small decisions make products feel calm.", readTime: 4 },
  { _id: "i3", title: "Shipping small: the case for tighter feedback loops", category: "Engineering", excerpt: "Why the fastest teams release in slices and learn from every one.", readTime: 6 }
];

