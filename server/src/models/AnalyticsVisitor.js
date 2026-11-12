import mongoose from "mongoose";

const analyticsVisitorSchema = new mongoose.Schema({
  visitorId: { type: String, required: true, unique: true, index: true },
  consentedAt: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model("AnalyticsVisitor", analyticsVisitorSchema);
