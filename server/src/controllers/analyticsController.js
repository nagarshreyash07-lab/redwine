import AnalyticsEvent from "../models/AnalyticsEvent.js";
import AnalyticsVisitor from "../models/AnalyticsVisitor.js";

const UUID = /^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}$/i;
const PATH = /^\/(?:[a-zA-Z0-9_-]+\/?)*$/;
const TARGET = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/;
const EVENT_TYPES = new Set(["page_view", "section_view", "navigation", "cta", "content_click", "contact_submit", "ui_interaction"]);
const ALLOWED_RANGES = new Set([7, 30, 90, 365]);

export async function saveConsent(req, res) {
  const { visitorId, consent } = req.body || {};
  if (typeof visitorId !== "string" || !UUID.test(visitorId) || typeof consent !== "boolean") {
    return res.status(400).json({ message: "Invalid analytics consent" });
  }

  if (consent) {
    await AnalyticsVisitor.findOneAndUpdate(
      { visitorId },
      { $set: { consentedAt: new Date() } },
      { upsert: true, new: true, runValidators: true }
    );
    return res.json({ consent: true });
  }

  await AnalyticsEvent.deleteMany({ visitorId });
  await AnalyticsVisitor.deleteOne({ visitorId });
  res.json({ consent: false });
}

export async function recordEvent(req, res) {
  const { visitorId, sessionId, type, path, target = "" } = req.body || {};
  if (
    typeof visitorId !== "string" || !UUID.test(visitorId) ||
    typeof sessionId !== "string" || !UUID.test(sessionId) ||
    typeof type !== "string" || !EVENT_TYPES.has(type) ||
    typeof path !== "string" || path.length > 120 || !PATH.test(path) ||
    typeof target !== "string" || target.length > 80 || (target && !TARGET.test(target))
  ) {
    return res.status(400).json({ message: "Invalid analytics event" });
  }

  if (!await AnalyticsVisitor.exists({ visitorId })) {
    return res.status(403).json({ message: "Analytics consent is required" });
  }

  await AnalyticsEvent.create({ visitorId, sessionId, type, path, target });
  res.status(202).json({ accepted: true });
}

export async function getAnalytics(req, res) {
  const days = Number(req.query.days || 30);
  if (!ALLOWED_RANGES.has(days)) {
    return res.status(400).json({ message: "Choose an analytics range of 7, 30, 90, or 365 days" });
  }

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const range = { createdAt: { $gte: since } };
  const [totalEvents, uniqueVisitors, uniqueSessions, pageViews, contactSubmissions, daily, topPages, topSections, ctaPerformance, sessionFunnel] = await Promise.all([
    AnalyticsEvent.countDocuments(range),
    AnalyticsEvent.aggregate([{ $match: range }, { $group: { _id: "$visitorId" } }, { $count: "count" }]),
    AnalyticsEvent.aggregate([{ $match: range }, { $group: { _id: "$sessionId" } }, { $count: "count" }]),
    AnalyticsEvent.countDocuments({ ...range, type: "page_view" }),
    AnalyticsEvent.countDocuments({ ...range, type: "contact_submit" }),
    AnalyticsEvent.aggregate([
      { $match: range },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, events: { $sum: 1 }, visitors: { $addToSet: "$visitorId" } } },
      { $project: { date: "$_id", events: 1, visitors: { $size: "$visitors" }, _id: 0 } },
      { $sort: { date: 1 } }
    ]),
    AnalyticsEvent.aggregate([
      { $match: { ...range, type: "page_view" } },
      { $group: { _id: "$path", views: { $sum: 1 } } },
      { $sort: { views: -1, _id: 1 } },
      { $limit: 8 }
    ]),
    AnalyticsEvent.aggregate([
      { $match: { ...range, type: "section_view", target: { $ne: "" } } },
      { $group: { _id: "$target", views: { $sum: 1 }, visitors: { $addToSet: "$visitorId" } } },
      { $project: { _id: 1, views: 1, visitors: { $size: "$visitors" } } },
      { $sort: { views: -1, _id: 1 } },
      { $limit: 8 }
    ]),
    AnalyticsEvent.aggregate([
      { $match: { ...range, type: "cta", target: { $ne: "" } } },
      { $group: { _id: "$target", clicks: { $sum: 1 }, sessions: { $addToSet: "$sessionId" } } },
      { $project: { _id: 1, clicks: 1, sessions: { $size: "$sessions" } } },
      { $sort: { clicks: -1, _id: 1 } },
      { $limit: 8 }
    ]),
    AnalyticsEvent.aggregate([
      { $match: range },
      { $group: {
        _id: "$sessionId",
        pageView: { $max: { $cond: [{ $eq: ["$type", "page_view"] }, 1, 0] } },
        ctaClick: { $max: { $cond: [{ $eq: ["$type", "cta"] }, 1, 0] } },
        contact: { $max: { $cond: [{ $eq: ["$type", "contact_submit"] }, 1, 0] } }
      } },
      { $group: {
        _id: null,
        pageViewSessions: { $sum: "$pageView" },
        ctaSessions: { $sum: { $cond: [{ $and: [{ $gt: ["$pageView", 0] }, { $gt: ["$ctaClick", 0] }] }, 1, 0] } },
        contactSessions: { $sum: { $cond: [{ $and: [{ $gt: ["$pageView", 0] }, { $gt: ["$contact", 0] }] }, 1, 0] } }
      } },
      { $project: { _id: 0, pageViewSessions: 1, ctaSessions: 1, contactSessions: 1 } }
    ])
  ]);

  res.json({
    rangeDays: days,
    totalEvents,
    uniqueVisitors: uniqueVisitors[0]?.count || 0,
    uniqueSessions: uniqueSessions[0]?.count || 0,
    pageViews,
    contactSubmissions,
    daily,
    topPages: topPages.map(({ _id, views }) => ({ path: _id, views })),
    topSections: topSections.map(({ _id, views, visitors }) => ({ section: _id, views, visitors })),
    ctaPerformance: ctaPerformance.map(({ _id, clicks, sessions }) => ({ action: _id, clicks, sessions })),
    sessionFunnel: sessionFunnel[0] || { pageViewSessions: 0, ctaSessions: 0, contactSessions: 0 }
  });
}

export async function deleteAnalytics(req, res) {
  const result = await AnalyticsEvent.deleteMany({});
  res.json({ deleted: result.deletedCount });
}
