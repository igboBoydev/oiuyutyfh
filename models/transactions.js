var Sequelize = require('sequelize');

var Admins = (sequelize, type) => {
    return sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: Sequelize.STRING,
        fund_id: Sequelize.STRING,
        reference: Sequelize.STRING,
        amount: Sequelize.STRING,
        type: Sequelize.STRING,
        status: Sequelize.STRING,
        narration: Sequelize.STRING,
    });
}

module.exports = Admins;


