const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cab = sequelize.define('Cab', {
    driver_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    license_plate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

module.exports = Cab;
