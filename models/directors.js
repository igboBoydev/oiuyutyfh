var Sequelize = require('sequelize');

var Admins = (sequelize, type) => {
    return sequelize.define('directors', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: Sequelize.STRING,
        title_cd: Sequelize.STRING,
        last_name: Sequelize.STRING,
        first_name: Sequelize.STRING,
        other_names: Sequelize.STRING,
        gender_cd: Sequelize.STRING,
        birth_date: Sequelize.STRING,
        nationality_cd: Sequelize.STRING,
        job_title: Sequelize.STRING,
        telephone: Sequelize.STRING,
        email_address: Sequelize.STRING,
        address_street: Sequelize.STRING,
        address_city: Sequelize.STRING,
        address_country_cd: Sequelize.STRING,
        bvn_number: Sequelize.STRING,
    }, {
        timestamps: false
    });
}

module.exports = Admins;


