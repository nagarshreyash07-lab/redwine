import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";
import { apiLimiter } from "./middleware/rateLimiters.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN?.split(",").map((origin) => origin.trim()) || "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "100kb" }));

app.use("/api", apiLimiter, routes);
app.use("/api", notFound);
app.use(errorHandler);

connectDB()
  .then(() => app.listen(port, () => console.log(`RÉDWÍNE API running on port ${port}`)))
  .catch((error) => {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  });
