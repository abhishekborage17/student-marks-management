const Attendance = require("../models/Attendance");
const User = require("../models/User"); // Assuming User model exists

// Display all attendance records (for teacher/admin)
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().populate("studentId", "name role");
    const validRecords = records.filter(record => record.studentId !== null);
    
    const success_msg = req.flash("success_msg")[0]; // get first flash msg or undefined

    res.render("teacher/manageattendance", {
      records: validRecords,
      success_msg
    });
  } catch (err) {
    res.status(500).send("Error fetching attendance");
  }
};


// Render form to add attendance
exports.renderAddForm = async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    res.render("teacher/addattendance", { students });
  } catch (err) {
    res.status(500).send("Error loading form");
  }
};

// Save attendance
exports.postAttendance = async (req, res) => {
  try {
    const { studentId, className, month, daysPresent, totalDays } = req.body;
    const attendance = new Attendance({
      studentId,
      className,
      month,
      daysPresent: daysPresent.split(',').map(Number),
      totalDays
    });
    await attendance.save();
    const students = await User.find({ role: 'student' });
    res.render('teacher/addattendance', { students, success: true });
  } catch (err) {
    res.status(500).send("Error saving attendance");
  }
};

// Render edit attendance form
exports.editAttendanceForm = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id).populate("studentId", "name");
    const students = await User.find({ role: "student" });
    res.render("teacher/editattendance", { attendance, students });
  } catch (err) {
    res.status(500).send("Error loading edit form");
  }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const { studentId, className, month, daysPresent, totalDays } = req.body;
    await Attendance.findByIdAndUpdate(req.params.id, {
      studentId,
      className,
      month,
      daysPresent: daysPresent.split(',').map(Number),
      totalDays,
    });
    req.flash('success_msg', 'Attendance updated successfully!');
    res.redirect("/teacher/attendance/manage");
  } catch (err) {
    res.status(500).send("Error updating attendance");
  }
};

// Delete attendance
exports.deleteAttendance = async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Attendance deleted successfully!');
    res.redirect("/teacher/attendance/manage");
  } catch (err) {
    res.status(500).send("Error deleting attendance");
  }
};
