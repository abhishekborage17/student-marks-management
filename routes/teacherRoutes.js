const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const classController = require('../controllers/classController');
const studentController = require('../controllers/studentController');
const performanceController = require('../controllers/performanceController');
const subjectController = require('../controllers/subjectController');
const attendanceController = require('../controllers/attendanceController');
const { isAuthenticated } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

// Teacher dashboard
router.get("/dashboard", isAuthenticated, allowRoles("teacher"), teacherController.dashboard);

// Marks
router.get('/marks', teacherController.getMarksForm);
router.post('/marks', teacherController.saveMarks);

// Classes
router.get('/classes', classController.listClasses);
router.post('/classes/add', classController.addClass);
router.post('/classes/edit/:id', classController.editClass);
router.post('/classes/delete/:id', classController.deleteClass);

// Students
router.get('/students', studentController.getStudentsPage); // ✅ fixed here
router.post('/students/add', studentController.addStudent);
router.post('/students/edit/:id', studentController.editStudent);
router.post('/students/delete/:id', studentController.deleteStudent);

// Subjects
router.get('/subjects', subjectController.listSubjects);
router.post('/subjects/add', subjectController.addSubject);
router.post('/subjects/edit/:id', subjectController.editSubject);
router.post('/subjects/delete/:id', subjectController.deleteSubject);

// Performance
router.get('/performance', performanceController.getPerformancePage);

// Attendance
router.get('/attendance/manage', isAuthenticated, allowRoles("teacher"), attendanceController.getAllAttendance);
router.get('/attendance/add', isAuthenticated, allowRoles("teacher"), attendanceController.renderAddForm);
router.post('/attendance/add', isAuthenticated, allowRoles("teacher"), attendanceController.postAttendance);

// Edit
router.get("/attendance/edit/:id", attendanceController.editAttendanceForm);
router.post("/attendance/edit/:id", attendanceController.updateAttendance);

// Delete
router.post("/attendance/delete/:id", attendanceController.deleteAttendance);



module.exports = router;
