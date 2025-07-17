const User = require("../models/User");

// Show register form
exports.showRegister = (req, res) => {
  res.render("auth/register", { title: "Register", error: null });
};

// Handle registration
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.render("auth/register", { title: "Register", error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("auth/register", { title: "Register", error: "Email already registered" });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    req.session.userId = user._id;
    req.session.userRole = user.role;

    res.redirect(`/${user.role}/dashboard`);
  } catch (error) {
    console.error(error);
    res.render("auth/register", { title: "Register", error: "Registration failed" });
  }
};

// Show login form
exports.showLogin = (req, res) => {
  res.render("auth/login", { title: "Login", error: null });
};

// Handle login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("auth/login", { title: "Login", error: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.render("auth/login", { title: "Login", error: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render("auth/login", { title: "Login", error: "Invalid email or password" });
    }

    req.session.userId = user._id;
    req.session.userRole = user.role;

    res.redirect(`/${user.role}/dashboard`);
  } catch (error) {
    console.error(error);
    res.render("auth/login", { title: "Login", error: "Login failed" });
  }
};

// Handle logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
};
