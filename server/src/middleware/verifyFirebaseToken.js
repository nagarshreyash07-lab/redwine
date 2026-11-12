import { firebaseAdmin } from "../config/firebaseAdmin.js";

export async function verifyFirebaseToken(req, res, next) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer (.+)$/i);
  if (!match) return res.status(401).json({ message: "Authentication token required" });

  try {
    const decoded = await firebaseAdmin.auth().verifyIdToken(match[1]);
    req.auth = {
      uid: decoded.uid,
      email: decoded.email || null,
      emailVerified: Boolean(decoded.email_verified),
      name: decoded.name || "",
      picture: decoded.picture || "",
      signInProvider: decoded.firebase?.sign_in_provider || "",
      authTime: decoded.auth_time ? new Date(decoded.auth_time * 1000) : null,
      admin: decoded.admin === true
    };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired authentication token" });
  }
}
