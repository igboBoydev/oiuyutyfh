var Sequelize = require('sequelize');

var Admins = (sequelize, type) => {
    return sequelize.define('corporate_profile', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: Sequelize.STRING,
        name: Sequelize.STRING,
        website_address: Sequelize.STRING,
        bvn: Sequelize.STRING,
        industry: Sequelize.STRING,
        document_type: Sequelize.STRING,
        registration_document: Sequelize.STRING,
        registration_number: Sequelize.STRING,
        registration_date: Sequelize.STRING,
        registration_country_cd: Sequelize.STRING,
        tax_identification_number: Sequelize.STRING,
        address_street: Sequelize.STRING,
        address_state_cd: Sequelize.STRING,
        address_zip_code: Sequelize.STRING,
        alternate_phone_no: Sequelize.STRING,
        alternate_email_address: Sequelize.STRING,
        twitter_address: Sequelize.STRING,
        picture: Sequelize.STRING,
        business_type: Sequelize.STRING,
        start_date: Sequelize.STRING,
    }, {
        timestamps: false
    });
}

module.exports = Admins;


