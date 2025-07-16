import jwt from "jsonwebtoken";
import User from "../models/users.model.js";
import cloudinary from "../middlewares/cloudinary.js";

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

    let uploadedImageUrl = profileImageUrl;

    if (profileImageUrl) {
      const uploadResponse = await cloudinary.uploader.upload(profileImageUrl, {
        resource_type: "image",
      });
      if (!uploadResponse.secure_url) {
        return res.status(500).json({ message: "Image upload failed" });
      }
      uploadedImageUrl = uploadResponse.secure_url;
    }

    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl: uploadedImageUrl,
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

export const updateProfileController = async (req, res) => {
  const { profileImageUrl } = req.body;
  try {
    const userId = req.user._id;

    if (!profileImageUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Profile picture is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid User" });
    }

    const uploadRespone = await cloudinary.uploader.upload(profileImageUrl, {
      public_id: userId,
      resource_type: "image",
    });

    // user.profileImageUrl = uploadRespone.secure_url;
    // await user.save();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profileImageUrl: uploadRespone.secure_url,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log("Error in update profile controller", error.message);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};
