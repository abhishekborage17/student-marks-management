const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    classId: { type: mongoose.Schema.Types.ObjectId },
    marks: Number,
    examType: { type: String, default: 'Midterm' } // Optional
});

module.exports = mongoose.model('Mark', markSchema);
