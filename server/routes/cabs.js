const express = require('express');
const router = express.Router();
const Cab = require('../models/cab');

router.get('/', async (req, res) => {
    try {
        const cabs = await Cab.findAll();
        res.json(cabs);
    } catch (error) {
        console.error('Error fetching cabs:', error);
        res.status(500).json({ error: 'Failed to fetch cabs' });
    }
});

module.exports = router;
