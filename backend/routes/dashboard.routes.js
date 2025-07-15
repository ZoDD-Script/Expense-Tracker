import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getDashboardData } from "../controllers/dashoard.controller.js";

const dashboardRoutes = express.Router();

dashboardRoutes.get("/", protect, getDashboardData);

export default dashboardRoutes;
