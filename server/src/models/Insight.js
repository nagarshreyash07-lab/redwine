import mongoose from "mongoose";
import { slugify } from "../utils/helpers.js";

const insightSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true, maxlength: 140 },
  slug:        { type: String, unique: true, index: true, trim: true },
  category:    { type: String, default: "Thinking", trim: true, maxlength: 60 },
  excerpt:     { type: String, required: true, trim: true, maxlength: 400 },
  readTime:    { type: Number, default: 4, min: 1, max: 120 },
  url:         { type: String, default: "", trim: true, maxlength: 300 },
  published:   { type: Boolean, default: true },
  publishedAt: { type: Date, default: Date.now }
}, { timestamps: true });

insightSchema.pre("validate", function () {
  if (!this.slug && this.title) this.slug = slugify(this.title);
});

export default mongoose.model("Insight", insightSchema);
