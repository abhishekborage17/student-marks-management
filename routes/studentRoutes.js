const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.get("/dashboard", isAuthenticated, allowRoles("student"), studentController.dashboard);

module.exports = router;
