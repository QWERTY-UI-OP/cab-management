const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cab_management', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
