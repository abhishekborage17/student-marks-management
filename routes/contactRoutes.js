// routes/contact.js
const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await ContactMessage.create({ name, email, message });
        res.redirect('/?submitted=true'); // or show a success alert
    } catch (err) {
        console.error('Error saving message:', err);
        res.redirect('/?submitted=false');
    }
});

module.exports = router;
