const allowlist = () =>
  (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

/** Admin = Firebase custom claim { admin: true }, or a VERIFIED email on the server allowlist. */
export function isAdminAuth(auth) {
  if (!auth) return false;
  if (auth.admin === true) return true;
  return Boolean(auth.emailVerified && auth.email && allowlist().includes(auth.email.toLowerCase()));
}

export function requireAdmin(req, res, next) {
  if (!isAdminAuth(req.auth)) return res.status(403).json({ message: "Administrator access required" });
  next();
}
