import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import path from "path";

import connectDB from "./config/db.js";
import { protect } from "./middleware/authMiddleware.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();

connectDB();

const app = express();

// 1. CORS Middleware (Dynamically allowed origins in production and development)
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2. Security and Logging Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows frontend to load assets served from backend
}));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
});
app.use("/api", limiter);

// 3. Parser Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  // Serve static files fallback
  const distPath = path.join(__dirname, "../ecommerceFrontend/dist");
  app.use(express.static(distPath));

  app.get("*all", (req, res, next) => {
    // If request is directed to api routes, pass to next middleware (so we don't return HTML on broken APIs)
    if (req.originalUrl.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.resolve(__dirname, "../ecommerceFrontend", "dist", "index.html"), (err) => {
      if (err) {
        res.status(200).send("Merchant Grid API is running in production.");
      }
    });
  });
} else {
  // Test routes
  app.get("/", (req, res) => {
    res.send("API Running...");
  });

  app.get("/api/protected", protect, (req, res) => {
    res.json({
      message: "Protected Route Accessed",
      user: req.user,
    });
  });
}

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});