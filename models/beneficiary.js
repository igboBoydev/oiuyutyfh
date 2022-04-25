var Sequelize = require('sequelize');

var Admins = (sequelize, type) => {
    return sequelize.define('beneficiary', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        uuid: Sequelize.STRING,
        user_id: Sequelize.STRING,
        picture: Sequelize.STRING,
        firstname: Sequelize.STRING,
        lastname: Sequelize.STRING,
        gender: Sequelize.STRING,
        email: Sequelize.STRING,
        phoneNumber: Sequelize.STRING,
        relationship: Sequelize.STRING,
        percentage: Sequelize.STRING,
    }, {
        timestamps: false
    });
}

module.exports = Admins;


