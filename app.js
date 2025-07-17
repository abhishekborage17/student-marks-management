require("dotenv").config();

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const path = require("path");
const flash = require('connect-flash');

const app = express();

// Set views folder and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

app.use(flash());

// Make flash available in views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware to expose session data to views
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.userId = req.session.userId;
  res.locals.userRole = req.session.userRole;
  next();
});

// Import routes
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require('./routes/contactRoutes');

// Use routes
app.use("/student", studentRoutes);
app.use("/teacher", teacherRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/", contactRoutes);
app.use(express.static('public'));

// Root route (portal page)
app.get("/", (req, res) => {
  res.render("pages/portal", {
    userId: req.session.userId,
    userRole: req.session.userRole,
    submitted: req.query.submitted
  });
});

// Catch-all route (optional)

app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const methodOverride = require('method-override');
app.use(methodOverride('_method'));
