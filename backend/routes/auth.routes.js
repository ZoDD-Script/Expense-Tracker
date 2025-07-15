import express from "express";
import {
  getUserInfo,
  loginUser,
  registerUser,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.get("/getUser", protect, getUserInfo);

authRoutes.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  res.status(200).json({ imageUrl });
});

export default authRoutes;
