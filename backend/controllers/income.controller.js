import Income from "../models/income.model.js";
import xlsx from "xlsx";

export const addIncome = async (req, res) => {
  const userId = req.user._id;

  try {
    const { icon, source, amount, date } = req.body;

    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date,
    });

    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (error) {
    console.log("Error from addIncome", error);
    res
      .status(500)
      .json({ message: "Error adding income", error: error.message });
  }
};

export const getAllIncome = async (req, res) => {
  const userId = req.user._id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    res.status(200).json(income);
  } catch (error) {
    console.log("Error from getAllIncome", error);
    res
      .status(500)
      .json({ message: "Error getting all income", error: error.message });
  }
};

export const downloadIncomeExcel = async (req, res) => {
  const userId = req.user._id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");
    xlsx.writeFile(wb, "income_details.xlsx");
    res.download("income_details.xlsx");
  } catch (error) {
    console.log("Error from downloadIncomeExcel", error);
    res.status(500).json({
      message: "Error downloading income excel",
      error: error.message,
    });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Income deleted" });
  } catch (error) {
    console.log("Error from deleteIncome", error);
    res
      .status(500)
      .json({ message: "Error deleting income", error: error.message });
  }
};
