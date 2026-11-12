import Project from "../models/Project.js";
import Insight from "../models/Insight.js";
import { createCrud } from "./crudFactory.js";

// ---- Public (published only)
export const listProjects = async (_req, res) =>
  res.json({ items: await Project.find({ published: true }).sort({ order: 1, createdAt: -1 }).select("-__v").lean() });

export const getProject = async (req, res) => {
  const item = await Project.findOne({ slug: req.params.slug, published: true }).select("-__v").lean();
  if (!item) return res.status(404).json({ message: "Project not found" });
  res.json({ item });
};

export const listInsights = async (_req, res) =>
  res.json({ items: await Insight.find({ published: true }).sort({ publishedAt: -1 }).select("-__v").lean() });

// ---- Admin
export const projectsAdmin = createCrud(Project, {
  sort: { order: 1, createdAt: -1 },
  fields: ["title", "slug", "category", "summary", "description", "tags", "year", "accent", "link", "featured", "published", "order"]
});

export const insightsAdmin = createCrud(Insight, {
  sort: { publishedAt: -1 },
  fields: ["title", "slug", "category", "excerpt", "readTime", "url", "published", "publishedAt"]
});
