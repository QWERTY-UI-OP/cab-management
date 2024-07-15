const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'cab_management'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Route to create a new booking
app.post('/bookings', (req, res) => {
    const { name, pickup_location, dropoff_location } = req.body;
    const query = 'INSERT INTO bookings (name, pickup_location, dropoff_location) VALUES (?, ?, ?)';
    connection.query(query, [name, pickup_location, dropoff_location], (err, results) => {
        if (err) {
            res.status(500).send('Error creating booking');
        } else {
            res.status(201).send('Booking created successfully');
        }
    });
});

// Route to get all bookings
app.get('/bookings', (req, res) => {
    const query = 'SELECT * FROM bookings';
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching bookings');
        } else {
            res.json(results);
        }
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
