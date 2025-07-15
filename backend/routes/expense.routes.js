import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  addExpense,
  deleteExpense,
  downloadExpenseExcel,
  getAllExpense,
} from "../controllers/expense.controller.js";

const expenseRoutes = express.Router();

expenseRoutes.post("/add", protect, addExpense);
expenseRoutes.get("/get", protect, getAllExpense);
expenseRoutes.get("/downloadexcel", protect, downloadExpenseExcel);
expenseRoutes.delete("/:id", protect, deleteExpense);

export default expenseRoutes;
