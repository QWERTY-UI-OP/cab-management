const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'cab_management'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
    createDefaultAdmin();
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'cab_management_secret',
    resave: false,
    saveUninitialized: true,
}));

// Create default admin user
async function createDefaultAdmin() {
    const adminUsername = 'admin';
    const adminPassword = '12345';

    db.query('SELECT * FROM users WHERE name = ? AND role = ?', [adminUsername, 'admin'], async (err, results) => {
        if (err) {
            console.error('Error checking for admin user:', err);
            return;
        }
        if (results.length === 0) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const adminUser = { name: adminUsername, password: hashedPassword, role: 'admin' };
            db.query('INSERT INTO users SET ?', adminUser, (err, result) => {
                if (err) {
                    console.error('Error creating default admin user:', err);
                    return;
                }
                console.log('Default admin user created');
            });
        } else {
            console.log('Admin user already exists');
        }
    });
}

// Routes
app.post('/login', (req, res) => {
    const { name, password, role } = req.body;

    db.query('SELECT * FROM users WHERE name = ? AND role = ?', [name, role], async (err, results) => {
        if (err) {
            console.error('Error querying user:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (results.length > 0) {
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                req.session.user = { id: user.id, role: user.role, name: user.name };
                if (user.role === 'admin') {
                    return res.send('/admin');
                } else if (user.role === 'cab_driver') {
                    return res.send('/driver');
                } else {
                    return res.send('/user');
                }
            } else {
                console.log('Password mismatch');
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.redirect('/');
    });
});

// Registration routes
app.post('/register', async (req, res) => {
    const { name, password, role, phone } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, password: hashedPassword, role };

    if (role === 'cab_driver') {
        newUser.phone = phone;
    }

    db.query('INSERT INTO users SET ?', newUser, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating user' });
        }
        res.json({ message: 'User registered successfully' });
    });
});

// Admin routes
app.get('/admin', (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        res.sendFile(__dirname + '/public/admin.html');
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.post('/drivers', (req, res) => {
    const { name, phone } = req.body;
    const newDriver = { name, phone, role: 'cab_driver' };
    db.query('INSERT INTO users SET ?', newDriver, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating driver' });
        }
        res.json({ message: 'Driver created successfully' });
    });
});

app.post('/bookings', (req, res) => {
    const { name, pickup_location, dropoff_location, booking_date, booking_time, driver_id } = req.body;
    const newBooking = { name, pickup_location, dropoff_location, booking_date, booking_time, driver_id };
    db.query('INSERT INTO bookings SET ?', newBooking, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating booking' });
        }
        res.json({ message: 'Booking created successfully' });
    });
});

app.get('/bookings', (req, res) => {
    db.query('SELECT bookings.*, users.name AS driver_name FROM bookings LEFT JOIN users ON bookings.driver_id = users.id', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching bookings' });
        }
        res.json(results);
    });
});

// Driver routes
app.get('/driver', (req, res) => {
    if (req.session.user && req.session.user.role === 'cab_driver') {
        res.sendFile(__dirname + '/public/driver.html');
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.get('/my-bookings', (req, res) => {
    if (req.session.user && req.session.user.role === 'cab_driver') {
        const driverId = req.session.user.id;
        db.query('SELECT * FROM bookings WHERE driver_id = ?', [driverId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching bookings' });
            }
            res.json(results);
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

// User routes
app.get('/user', (req, res) => {
    if (req.session.user && req.session.user.role === 'user') {
        res.sendFile(__dirname + '/public/user.html');
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.post('/create-booking', (req, res) => {
    const { name, pickup_location, dropoff_location, booking_date, booking_time } = req.body;
    const newBooking = { name, pickup_location, dropoff_location, booking_date, booking_time };
    db.query('INSERT INTO bookings SET ?', newBooking, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating booking' });
        }
        res.json({ message: 'Booking created successfully' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
