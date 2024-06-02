const express = require("express");
const router = express.Router();
const User = require("../models/user_model");
const bcrypt = require("bcrypt");

// Signup route
router.post("/signup", async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    // Check if user with the provided email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If user with email already exists, send "Email already exists" response
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    // Save the new user to the database
    await newUser.save();

    // Store user details in cookies
    res.cookie("userId", newUser._id);

    // Send user details in response
    res.status(201).json({
      message: "Signup successful",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user with the provided email exists
    const user = await User.findOne({ email });

    if (!user) {
      // If user does not exist, send "Wrong email or password" response
      return res.status(401).json({ message: "Wrong email or password" });
    }

    // Check if the provided password matches the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // If password does not match, send "Wrong email or password" response
      return res.status(401).json({ message: "Wrong email or password" });
    }

    // Store user details in cookies
    res.cookie("userId", user._id);

    // Send user details in response
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
