const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');

router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.findAll();
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

module.exports = router;
