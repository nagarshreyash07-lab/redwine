import mongoose from "mongoose";

const analyticsEventSchema = new mongoose.Schema({
  visitorId: { type: String, required: true, index: true },
  sessionId: { type: String, required: true, index: true },
  type: {
    type: String,
    required: true,
    enum: ["page_view", "section_view", "navigation", "cta", "content_click", "contact_submit", "ui_interaction"],
    index: true
  },
  path: { type: String, required: true, maxlength: 120 },
  target: { type: String, default: "", maxlength: 80 }
}, { timestamps: { createdAt: true, updatedAt: false } });

analyticsEventSchema.index({ createdAt: -1 });
analyticsEventSchema.index({ path: 1, type: 1, createdAt: -1 });

export default mongoose.model("AnalyticsEvent", analyticsEventSchema);
