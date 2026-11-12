import User from "../models/User.js";
import { isAdminAuth } from "../middleware/requireAdmin.js";

export async function syncCurrentUser(req, res) {
  const user = await User.findOneAndUpdate(
    { firebaseUid: req.auth.uid },
    {
      $set: {
        email: req.auth.email,
        emailVerified: req.auth.emailVerified,
        signInProvider: req.auth.signInProvider,
        ...(req.auth.name ? { displayName: req.auth.name } : {}),
        ...(req.auth.picture ? { photoURL: req.auth.picture } : {}),
        ...(req.auth.authTime ? { lastSignInAt: req.auth.authTime } : {})
      }
    },
    { new: true, upsert: true, runValidators: true }
  ).select("-__v");

  res.json({ user, isAdmin: isAdminAuth(req.auth) });
}

export async function listUsers(req, res) {
  const page = Number.parseInt(req.query.page, 10) || 1;
  const limit = Number.parseInt(req.query.limit, 10) || 20;
  const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 100) : "";

  if (!Number.isInteger(page) || page < 1 || ![10, 20, 50].includes(limit)) {
    return res.status(400).json({ message: "Invalid user directory pagination" });
  }

  const filter = search
    ? { $or: [
      { email: { $regex: escapeRegex(search), $options: "i" } },
      { displayName: { $regex: escapeRegex(search), $options: "i" } }
    ] }
    : {};
  const [total, users] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter)
      .sort({ lastSignInAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("email displayName photoURL emailVerified signInProvider lastSignInAt createdAt -_id")
      .lean()
  ]);

  res.json({ users, page, limit, total, pages: Math.ceil(total / limit) });
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
