const Student = require('../models/Student');
const Class = require('../models/Class');

// ------------------ Student Dashboard ------------------

exports.dashboard = (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/auth/login");
  }

  res.render("student/dashboard", {
    title: "Student Dashboard",
    user: req.session,
  });
};

// ------------------ GET Students Page ------------------

exports.getStudentsPage = async (req, res) => {
  try {
    const { classId, error } = req.query;
    const classes = await Class.find();
    let students = [];

    const selectedClass = classId || (classes[0]?._id || null);

    if (selectedClass) {
      students = await Student.find({ classId: selectedClass }).populate('classId');
    }

    res.render('teacher/students', {
      classes,
      students,
      selectedClass,
      error
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// ------------------ Add Student ------------------

exports.addStudent = async (req, res) => {
  const { name, rollNumber, classId } = req.body;

  try {
    const student = new Student({ name, rollNumber, classId });
    await student.save();
    res.redirect(`/teacher/students?classId=${classId}`);
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate roll number in the class
      return res.redirect(`/teacher/students?classId=${classId}&error=DuplicateRollNumber`);
    }
    res.status(500).send('Server Error');
  }
};

// ------------------ Edit Student ------------------

exports.editStudent = async (req, res) => {
  const { name, rollNumber, classId } = req.body;

  try {
    // Ensure uniqueness manually (optional)
    const existing = await Student.findOne({ classId, rollNumber, _id: { $ne: req.params.id } });

    if (existing) {
      return res.redirect(`/teacher/students?classId=${classId}&error=DuplicateRollNumber`);
    }

    await Student.findByIdAndUpdate(req.params.id, { name, rollNumber });
    res.redirect(`/teacher/students?classId=${classId}`);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// ------------------ Delete Student ------------------

exports.deleteStudent = async (req, res) => {
  const { classId } = req.body;

  try {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect(`/teacher/students?classId=${classId}`);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// ------------------ Student Details ------------------

exports.getStudentDetails = async (req, res) => {
  const studentId = req.params.id;

  try {
    const student = await Student.findById(studentId).populate('classId');

    if (!student) {
      return res.status(404).send('Student not found');
    }

    res.render('teacher/studentDetails', { student });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
