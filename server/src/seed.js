// Usage: npm run seed --prefix server
// Inserts SAMPLE content only into empty collections. Replace it with your real work from /admin.
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Project from "./models/Project.js";
import Insight from "./models/Insight.js";

const projects = [
  { title: "Northstar", category: "Software & Engineering", summary: "A real-time analytics platform that turns scattered data into clear decisions.", tags: ["React", "Node.js", "MongoDB"], year: 2026, accent: "#762d40", featured: true, order: 1 },
  { title: "Lumen", category: "Digital Experiences", summary: "A design system and storefront rebuilt for speed, clarity and delight.", tags: ["Design System", "Motion", "Accessibility"], year: 2026, accent: "#5b3a6b", order: 2 },
  { title: "Orbit", category: "Emerging Technology", summary: "An applied-AI assistant prototype exploring how teams find answers faster.", tags: ["AI", "Prototyping", "Research"], year: 2025, accent: "#8a4a2f", order: 3 },
  { title: "Meridian", category: "Software & Engineering", summary: "A secure customer portal with role-based access and live status tracking.", tags: ["Security", "Firebase", "APIs"], year: 2025, accent: "#2f5a66", order: 4 }
];

const insights = [
  { title: "Why curiosity is an engineering practice", category: "Mindset", excerpt: "Better questions up front save months of building the wrong thing.", readTime: 5 },
  { title: "Designing interfaces that respect attention", category: "Design", excerpt: "Motion, hierarchy and restraint — how small decisions make products feel calm.", readTime: 4 },
  { title: "Shipping small: the case for tighter feedback loops", category: "Engineering", excerpt: "Why the fastest teams release in slices and learn from every one.", readTime: 6 }
];

await connectDB();
if (!(await Project.countDocuments())) { await Project.create(projects); console.log("Seeded projects"); }
if (!(await Insight.countDocuments())) { await Insight.create(insights); console.log("Seeded insights"); }
await mongoose.disconnect();
