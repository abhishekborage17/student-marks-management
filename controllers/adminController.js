  const User = require("../models/User");

  // Dashboard
  exports.dashboard = async (req, res) => {
    try {
      const stats = {
        totalUsers: await User.countDocuments(),
        totalTeachers: await User.countDocuments({ role: 'teacher' }),
        totalStudents: await User.countDocuments({ role: 'student' }),
        totalClasses: 15, // Placeholder
        pendingApprovals: 3 // Placeholder
      };

      const recentActivities = []; // Placeholder
      const alerts = []; // Placeholder

      res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        user: req.user,
        stats,
        recentActivities,
        alerts
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).send("Internal Server Error");
    }
  };

  // READ all users
  exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.render("admin/manageUsers", { users });
    } catch (error) {
      res.status(500).send("Error retrieving users");
    }
  };

  // RENDER: Add user form
  exports.renderNewUserForm = (req, res) => {
    res.render("admin/newUser");
  };

  // CREATE user
const AuditLog = require("../models/AuditLog"); // Make sure this is at the top

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();

    // ✅ Add audit log
    await AuditLog.create({
      user: req.user.name,
      action: `Created user: ${user.name} (${role})`
    });

    res.redirect("/admin/users");
  } catch (err) {
    res.status(500).send("Error creating user: " + err.message);
  }
};
  // RENDER: Edit user form
  exports.renderEditUserForm = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).send("User not found");
      res.render("admin/editUser", { user });
    } catch (err) {
      res.status(500).send("Error loading edit form");
    }
  };

  // UPDATE user
  exports.updateUser = async (req, res) => {
    try {
      const { name, email, role } = req.body;
      await User.findByIdAndUpdate(req.params.id, { name, email, role });
      res.redirect("/admin/users");
    } catch (err) {
      res.status(500).send("Error updating user: " + err.message);
    }
  };

  // DELETE user
  exports.deleteUser = async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.redirect("/admin/users");
    } catch (err) {
      res.status(500).send("Error deleting user: " + err.message);
    }
  };


  // Render Manage Roles Page
exports.getRolesPage = async (req, res) => {
  try {
    const users = await User.find().sort({ role: 1 });
    res.render("admin/manageRoles", { users });
  } catch (error) {
    console.error("Error fetching users for role management:", error);
    res.status(500).send("Server Error");
  }
};

// Update a User's Role
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "teacher", "student"].includes(role)) {
      return res.status(400).send("Invalid role.");
    }

    await User.findByIdAndUpdate(id, { role });
    res.redirect("/admin/roles");
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).send("Server Error");
  }
};




// controllers/adminController.js


exports.viewAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ time: -1 });
    res.render('admin/logs', { logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).send('Server Error');
  }
};