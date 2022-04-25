var Sequelize = require('sequelize');

var Admins = (sequelize, type) => {
    return sequelize.define('user_profile', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: Sequelize.STRING,
        firstname: Sequelize.STRING,
        lastname: Sequelize.STRING,
        picture: Sequelize.STRING,
        birth_date: Sequelize.STRING,
        gender: Sequelize.STRING,
        bvn: Sequelize.STRING,
        title_cd: Sequelize.STRING,
        marital_status_cd: Sequelize.STRING,
        nationality_cd: Sequelize.STRING,
        address_street: Sequelize.STRING,
        address_city: Sequelize.STRING,
        address_state_cd: Sequelize.STRING,
        address_country_cd: Sequelize.STRING,
        occupation: Sequelize.STRING,
    }, {
        timestamps: false
    });
}

module.exports = Admins;


