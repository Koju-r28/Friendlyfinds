const User = require("../models/user");

// 🔹 SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("SIGNUP DATA:", req.body);

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Signup failed: User already exists");
      return res.json({ message: "User already exists" });
    }

    // create new user
    const user = new User({ name, email, password });
    await user.save();

    const allUsers = await User.find();
    console.log("USERS AFTER SIGNUP:", allUsers);

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
};

// 🔹 LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN DATA:", req.body);

    // check user in database
    const user = await User.findOne({ email, password });
    if (user) {
      console.log("Login successful for:", email);
      res.json({ message: "Login successful" });
    } else {
      console.log("Login failed: Invalid credentials for", email);
      res.json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
