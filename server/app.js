const express = require('express');
const sequelize = require('./config/db');
const cabsRouter = require('./routes/cabs');
const bookingsRouter = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('client'));

app.use('/cabs', cabsRouter);
app.use('/bookings', bookingsRouter);

// Sync database and start server
sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
