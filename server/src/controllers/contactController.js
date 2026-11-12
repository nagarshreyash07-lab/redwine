import mongoose from "mongoose";
import Message from "../models/Message.js";
import Project from "../models/Project.js";
import Insight from "../models/Insight.js";
import User from "../models/User.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const text = (value) => (typeof value === "string" ? value.trim() : "");

export async function submitContact(req, res) {
  const { name, email, message, company } = req.body || {};

  // Honeypot: real visitors never see/fill this field. Pretend success so bots learn nothing.
  if (text(company)) return res.status(201).json({ message: "Thanks — we'll be in touch." });

  const clean = { name: text(name), email: text(email), message: text(message) };
  if (clean.name.length < 2 || clean.name.length > 80) return res.status(400).json({ message: "Please enter your name." });
  if (!EMAIL.test(clean.email) || clean.email.length > 160) return res.status(400).json({ message: "Please enter a valid email address." });
  if (clean.message.length < 10 || clean.message.length > 2000) return res.status(400).json({ message: "Your message should be between 10 and 2000 characters." });

  await Message.create(clean);
  res.status(201).json({ message: "Thanks — we'll be in touch." });
}

// ---- Admin
export const listMessages = async (_req, res) =>
  res.json({ items: await Message.find().sort({ createdAt: -1 }).limit(200).lean() });

export async function updateMessage(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid identifier" });
  const status = req.body?.status === "read" ? "read" : "new";
  const item = await Message.findByIdAndUpdate(req.params.id, { $set: { status } }, { new: true });
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json({ item });
}

export async function deleteMessage(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid identifier" });
  const item = await Message.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
}

export async function stats(_req, res) {
  const [projects, insights, messages, unread, users] = await Promise.all([
    Project.countDocuments(), Insight.countDocuments(), Message.countDocuments(), Message.countDocuments({ status: "new" }), User.countDocuments()
  ]);
  res.json({ projects, insights, messages, unread, users });
}
