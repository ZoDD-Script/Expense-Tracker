import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import incomeRoutes from "./routes/income.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// ✅ Fixed static path
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(path.join(__dirname, "../frontend/ExpenseTracker/dist"))
  );

  app.get("*name", (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "../",
        "frontend",
        "ExpenseTracker",
        "dist",
        "index.html"
      )
    );
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
