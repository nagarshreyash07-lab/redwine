export function notFound(_req, res) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(err, _req, res, _next) {
  if (err.type === "entity.parse.failed") return res.status(400).json({ message: "Malformed JSON body" });
  if (err.type === "entity.too.large") return res.status(413).json({ message: "Request body too large" });
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(", ") });
  }
  if (err.name === "CastError") return res.status(400).json({ message: "Invalid identifier" });
  if (err.code === 11000) return res.status(409).json({ message: "A record with that value already exists" });
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}
