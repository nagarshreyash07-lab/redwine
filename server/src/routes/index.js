import { Router } from "express";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { contactLimiter } from "../middleware/rateLimiters.js";
import { analyticsLimiter } from "../middleware/rateLimiters.js";
import { listUsers, syncCurrentUser } from "../controllers/userController.js";
import { listProjects, getProject, listInsights, projectsAdmin, insightsAdmin } from "../controllers/contentController.js";
import { submitContact, listMessages, updateMessage, deleteMessage, stats } from "../controllers/contactController.js";
import { deleteAnalytics, getAnalytics, recordEvent, saveConsent } from "../controllers/analyticsController.js";

const router = Router();

router.get("/health", (_req, res) => res.json({ status: "ok", service: "redwine-api" }));

// Public
router.get("/projects", listProjects);
router.get("/projects/:slug", getProject);
router.get("/insights", listInsights);
router.post("/contact", contactLimiter, submitContact);
router.post("/analytics/consent", analyticsLimiter, saveConsent);
router.post("/analytics/events", analyticsLimiter, recordEvent);

// Authenticated
router.get("/users/me", verifyFirebaseToken, syncCurrentUser);

// Admin (server-enforced: Firebase claim or verified-email allowlist)
const admin = Router();
admin.use(verifyFirebaseToken, requireAdmin);
admin.get("/stats", stats);
admin.get("/analytics", getAnalytics);
admin.get("/users", listUsers);
admin.delete("/analytics/events", deleteAnalytics);
admin.route("/projects").get(projectsAdmin.list).post(projectsAdmin.create);
admin.route("/projects/:id").patch(projectsAdmin.update).delete(projectsAdmin.remove);
admin.route("/insights").get(insightsAdmin.list).post(insightsAdmin.create);
admin.route("/insights/:id").patch(insightsAdmin.update).delete(insightsAdmin.remove);
admin.get("/messages", listMessages);
admin.patch("/messages/:id", updateMessage);
admin.delete("/messages/:id", deleteMessage);
router.use("/admin", admin);

export default router;
