// models/Class.js
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: String
    // add more fields like section or grade if needed
});

module.exports = mongoose.model('Class', classSchema);
