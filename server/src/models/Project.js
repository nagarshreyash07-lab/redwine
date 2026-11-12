import mongoose from "mongoose";
import { slugify } from "../utils/helpers.js";

const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true, maxlength: 120 },
  slug:        { type: String, unique: true, index: true, trim: true },
  category:    { type: String, default: "Software & Engineering", trim: true, maxlength: 80 },
  summary:     { type: String, required: true, trim: true, maxlength: 400 },
  description: { type: String, default: "", maxlength: 5000 },
  tags:        { type: [String], default: [] },
  year:        { type: Number, default: () => new Date().getFullYear() },
  accent:      { type: String, default: "#762d40", match: /^#[0-9a-fA-F]{6}$/ },
  link:        { type: String, default: "", trim: true, maxlength: 300 },
  featured:    { type: Boolean, default: false },
  published:   { type: Boolean, default: true },
  order:       { type: Number, default: 0 }
}, { timestamps: true });

projectSchema.pre("validate", function () {
  if (!this.slug && this.title) this.slug = slugify(this.title);
});

export default mongoose.model("Project", projectSchema);
