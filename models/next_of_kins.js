var Sequelize = require('sequelize');

var Admins = (sequelize, type) => {
    return sequelize.define('next_of_kin', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        uuid: Sequelize.STRING,
        user_id: Sequelize.STRING,
        firstname: Sequelize.STRING,
        lastname: Sequelize.STRING,
        gender: Sequelize.STRING,
        email: Sequelize.STRING,
        phoneNumber: Sequelize.STRING,
        relationship: Sequelize.STRING,
    },
        {
            timestamps: false
        }
    );
}

module.exports = Admins;


