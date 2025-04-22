import User from "../models/User.js";

// Register User (Plain Text Password)
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing Details" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    // Save user with plain text password ⚠️ (Insecure)
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Login User (Plain Text Password)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }

    // Compare plain text password ⚠️ (Insecure)
    if (user.password === password) {
      // Remove password from response
      const { password, ...userWithoutPassword } = user._doc;
      return res.json({ success: true, message: "Login successful", user: userWithoutPassword });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get User Profile (Using Email - Risky)
const getUserProfile = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("❌ Profile fetch error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { registerUser, loginUser, getUserProfile };
