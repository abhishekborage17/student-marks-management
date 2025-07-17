const Class = require('../models/Class');

exports.listClasses = async (req, res) => {
    const classes = await Class.find().sort('name');
    res.render('teacher/classes', { classes });
};

exports.addClass = async (req, res) => {
    try {
        const { name } = req.body;
        await Class.create({ name });
        res.redirect('/teacher/classes');
    } catch (err) {
        res.status(400).send('Error adding class.');
    }
};

exports.editClass = async (req, res) => {
    try {
        const { name } = req.body;
        await Class.findByIdAndUpdate(req.params.id, { name });
        res.redirect('/teacher/classes');
    } catch (err) {
        res.status(400).send('Error editing class.');
    }
};

exports.deleteClass = async (req, res) => {
    try {
        await Class.findByIdAndDelete(req.params.id);
        res.redirect('/teacher/classes');
    } catch (err) {
        res.status(400).send('Error deleting class.');
    }
};
