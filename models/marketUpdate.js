var Sequelize = require('sequelize');

var Admins = (sequelize, type) => {
    return sequelize.define('market_update', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        uuid: Sequelize.STRING,
        message: Sequelize.TEXT,
        isEnabled: Sequelize.INTEGER,
    }, {
        timestamps: false
    });
}

module.exports = Admins;


