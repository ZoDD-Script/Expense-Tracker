import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  addIncome,
  deleteIncome,
  downloadIncomeExcel,
  getAllIncome,
} from "../controllers/income.controller.js";

const incomeRoutes = express.Router();

incomeRoutes.post("/add", protect, addIncome);
incomeRoutes.get("/get", protect, getAllIncome);
incomeRoutes.get("/downloadexcel", protect, downloadIncomeExcel);
incomeRoutes.delete("/:id", protect, deleteIncome);

export default incomeRoutes;
