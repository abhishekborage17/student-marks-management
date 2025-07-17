const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
}, { timestamps: true }); // ✅ this adds createdAt and updatedAt automatically


module.exports = mongoose.model('ContactMessage', contactMessageSchema);
