const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const ContactMessage = require('../models/ContactMessage'); // For contact messages

// Admin Dashboard
router.get(
  "/dashboard",
  isAuthenticated,
  allowRoles("admin"),
  adminController.dashboard
);

// Users Management
router.get("/users", isAuthenticated, allowRoles("admin"), adminController.getAllUsers);
router.get("/users/new", isAuthenticated, allowRoles("admin"), adminController.renderNewUserForm);
router.post("/users", isAuthenticated, allowRoles("admin"), adminController.createUser);
router.get("/users/:id/edit", isAuthenticated, allowRoles("admin"), adminController.renderEditUserForm);
router.post("/users/:id", isAuthenticated, allowRoles("admin"), adminController.updateUser);
router.post("/users/:id/delete", isAuthenticated, allowRoles("admin"), adminController.deleteUser);

// Audit Logs
router.get('/logs', isAuthenticated, allowRoles("admin"), adminController.viewAuditLogs);

// Roles Management
router.get("/roles", isAuthenticated, allowRoles("admin"), adminController.getRolesPage);
router.post("/roles/update/:id", isAuthenticated, allowRoles("admin"), adminController.updateUserRole);

// Contact Messages
router.get('/contact-messages', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.render('admin/contactMessages', { messages });
  } catch (error) {
    console.error('Failed to load contact messages:', error);
    res.status(500).send('Server Error');
  }
});

// DELETE a contact message
router.delete('/contact-messages/:id', isAuthenticated, allowRoles("admin"), async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.redirect('/admin/contact-messages');
  } catch (error) {
    console.error('Failed to delete contact message:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
