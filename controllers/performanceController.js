const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Mark = require('../models/Mark');
const Student = require('../models/Student');

exports.getPerformancePage = async (req, res) => {
    const classes = await Class.find();
    const subjects = await Subject.find();

    const { classId, subjectId } = req.query;
    let stats = null;
    let studentMarks = [];

    if (classId && subjectId) {
        const marks = await Mark.find({ classId, subjectId }).populate('studentId');

        const totalMarks = marks.reduce((sum, m) => sum + m.marks, 0);
        const average = marks.length ? (totalMarks / marks.length).toFixed(2) : 0;

        const highest = Math.max(...marks.map(m => m.marks), 0);
        const lowest = Math.min(...marks.map(m => m.marks), 100);

        studentMarks = marks.map(m => ({
            name: m.studentId.name,
            rollNumber: m.studentId.rollNumber,
            marks: m.marks
        }));

        stats = { average, highest, lowest };
    }

    res.render('teacher/performance', {
        classes,
        subjects,
        selectedClass: classId,
        selectedSubject: subjectId,
        stats,
        studentMarks
    });
};
