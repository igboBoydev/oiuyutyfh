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
        diretor_name: Sequelize.STRING,
        document_type: Sequelize.STRING,
        document_number: Sequelize.STRING,
        issue_date: Sequelize.STRING,
        document_url: Sequelize.STRING,
    });
}

module.exports = Admins;


