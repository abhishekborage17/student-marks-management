const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  className: { type: String, required: true },
  month: { type: String, required: true }, // e.g. "June 2025"
  daysPresent: [{ type: Number }], // e.g. [1, 2, 5, 7] for dates
  totalDays: { type: Number, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);
