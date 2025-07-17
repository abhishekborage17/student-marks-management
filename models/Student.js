const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    rollNumber: { type: Number, required: true }
});

// Compound unique index on classId + rollNumber
studentSchema.index({ classId: 1, rollNumber: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);
