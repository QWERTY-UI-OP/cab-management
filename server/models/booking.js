const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {
    customer_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pickup_location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dropoff_location: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Booking;
