import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    const token = generateToken(user._id);
    res.status(201).json({ id: user._id, user, token });
  } catch (error) {
    console.log("Error from registerUser", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.status(200).json({ id: user._id, user, token });
  } catch (error) {
    console.log("Error from loginUser", error);
    res
      .status(500)
      .json({ message: "Error logging in user", error: error.message });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error from getUserInfo", error);
    res
      .status(500)
      .json({ message: "Error getting user info", error: error.message });
  }
};
