import Expense from "../models/expense.model.js";
import xlsx from "xlsx";

export const addExpense = async (req, res) => {
  const userId = req.user._id;

  try {
    const { icon, category, amount, date } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date,
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (error) {
    console.log("Error from addExpense", error);
    res
      .status(500)
      .json({ message: "Error adding expense", error: error.message });
  }
};

export const getAllExpense = async (req, res) => {
  const userId = req.user._id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.status(200).json(expense);
  } catch (error) {
    console.log("Error from getAllExpense", error);
    res
      .status(500)
      .json({ message: "Error getting all expense", error: error.message });
  }
};

export const downloadExpenseExcel = async (req, res) => {
  const userId = req.user._id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");
    xlsx.writeFile(wb, "expense_details.xlsx");
    res.download("expense_details.xlsx");
  } catch (error) {
    console.log("Error from downloadExpenseExcel", error);
    res.status(500).json({
      message: "Error downloading expense excel",
      error: error.message,
    });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense deleted" });
  } catch (error) {
    console.log("Error from deleteExpense", error);
    res
      .status(500)
      .json({ message: "Error deleting expense", error: error.message });
  }
};
