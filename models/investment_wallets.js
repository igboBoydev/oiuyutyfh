var Sequelize = require('sequelize');

var Admins = (sequelize, type) => {
    return sequelize.define('investment_wallets', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: Sequelize.STRING,
        fund_id: Sequelize.STRING,
        virtualaccount: Sequelize.STRING,
        virtualaccountname: Sequelize.STRING,
        amount: Sequelize.STRING,
        bank_code: Sequelize.STRING,
        amountcontrol: Sequelize.STRING,
    },
        {
            timestamps: false
        }
    );
}

module.exports = Admins;


