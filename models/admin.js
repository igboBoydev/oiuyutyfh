var Sequelize = require('sequelize');

var Admins = (sequelize, type) => {
    return sequelize.define('admin', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        uuid: Sequelize.STRING,
        firstname: Sequelize.STRING,
        lastname: Sequelize.STRING,
        password: Sequelize.STRING,
        gender: Sequelize.STRING,
        email: Sequelize.STRING,
        role: Sequelize.STRING,
        activated: Sequelize.INTEGER,
        locked: Sequelize.INTEGER,
        permissions: Sequelize.TEXT
    });
}

module.exports = Admins;


