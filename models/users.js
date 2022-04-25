var Sequelize = require('sequelize');

var Admins = (sequelize, type) => {
    return sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        uuid: Sequelize.STRING,
        business_id: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        phone_number: Sequelize.STRING,
        activation: Sequelize.STRING,
        type: Sequelize.STRING,
        code: Sequelize.STRING,
        bvn: Sequelize.STRING
    },
        {
        timestamps: false
    });
}

module.exports = Admins;


