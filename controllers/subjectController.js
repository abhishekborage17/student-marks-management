const Subject = require('../models/Subject');
const Class = require('../models/Class');

exports.listSubjects = async (req, res) => {
    const classes = await Class.find();
    const selectedClass = req.query.classId || (classes[0]?._id || null);
    const subjects = await Subject.find().populate('classId');

    res.render('teacher/subjects', {
        subjects,
        classes,
        selectedClass
    });
};


exports.addSubject = async (req, res) => {
    const { name, classId } = req.body;
    await Subject.create({ name, classId });
    res.redirect('/teacher/subjects');
};

exports.editSubject = async (req, res) => {
    const { name, classId } = req.body;
    await Subject.findByIdAndUpdate(req.params.id, { name, classId });
    res.redirect('/teacher/subjects');
};

exports.deleteSubject = async (req, res) => {
    await Subject.findByIdAndDelete(req.params.id);
    res.redirect('/teacher/subjects');
};
