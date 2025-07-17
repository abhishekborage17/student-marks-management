const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Student = require('../models/Student');
const Mark = require('../models/Mark');
const User = require('../models/User'); // Added to count students

// Dashboard with live data counts
exports.dashboard = async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/auth/login");
  }

  try {
    const loggedInUser = await User.findById(req.session.userId);

    if (!loggedInUser) {
      return res.redirect("/auth/login");
    }

    const studentCount = await User.countDocuments({ role: 'student' });
    const subjectCount = await Subject.countDocuments();

    res.render("teacher/dashboard", {
      title: "Teacher Dashboard",
      user: loggedInUser, // ✅ Pass the actual user object here
      studentCount,
      subjectCount,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).send("Error loading dashboard");
  }
};

// Display form to enter marks
exports.getMarksForm = async (req, res) => {
  const classId = req.query.classId;

  try {
    const classes = await Class.find();
    const subjects = await Subject.find();
    const selectedClass = classId || (classes[0]?._id || null);
    const students = selectedClass
      ? await Student.find({ classId: selectedClass })
      : [];

    res.render('teacher/marks', {
      classes,
      subjects,
      students,
      selectedClass
    });
  } catch (err) {
    console.error("Error loading marks form:", err);
    res.status(500).send("Error loading marks form");
  }
};

// Save marks
exports.saveMarks = async (req, res) => {
  const { classId, subjectId, marks } = req.body;

  try {
    for (const studentId in marks) {
      const value = parseFloat(marks[studentId]);

      if (!isNaN(value)) {
        await Mark.findOneAndUpdate(
          { studentId, subjectId, classId },
          { marks: value },
          { upsert: true }
        );
      }
    }

    res.redirect('/teacher/marks?classId=' + classId);
  } catch (err) {
    console.error("Error saving marks:", err);
    res.status(500).send("Error saving marks");
  }
};
