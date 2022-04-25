require('dotenv').config();
var Sequelize = require('sequelize');

const db = {};

//Connect to DB
var sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  define: {
      //timestamps: false, // true by default
      freezeTableName: true
  }
});

//Check connection to DB
sequelize
  .authenticate()
  .then(() => {
      console.log('Connection has been established successfully.');
  })
  .catch(err => {
      console.error('Unable to connect to the database:', err);
});

//initialize models
db.Admin = require('../models/admin')(sequelize, Sequelize);
db.Users = require('../models/users')(sequelize, Sequelize);
db.Directors = require('../models/directors')(sequelize, Sequelize);
db.Beneficiary = require('../models/beneficiary')(sequelize, Sequelize);
db.Individual = require('../models/individual')(sequelize, Sequelize);
db.Corperate = require('../models/corperate')(sequelize, Sequelize);
db.MarketUpdate = require('../models/marketUpdate')(sequelize, Sequelize);
db.AdminLog = require('../models/admin_log')(sequelize, Sequelize);
db.Documents = require('../models/documents')(sequelize, Sequelize);
db.NextOfKin = require('../models/next_of_kins')(sequelize, Sequelize);
db.InvestmentWallet = require('../models/investment_wallets')(sequelize, Sequelize);
db.Transactions = require('../models/transactions')(sequelize, Sequelize);
// db.Card = require('../models/cards')(sequelize, Sequelize);
db.Oauth = require('../models/oauth')(sequelize, Sequelize);
db.PasswordReset = require('../models/passwordreset')(sequelize, Sequelize);

//User association
db.Admin.hasOne(db.PasswordReset, {foreignKey: 'user_id', as: "passwordreset"})
// db.User.hasOne(db.MyBank, {foreignKey: 'user_id', as: "my_bank"})

//PasswordReset association
db.PasswordReset.belongsTo(db.Admin, {foreignKey: 'user_id', as: "passwordresets" })

db.sequelize = sequelize;

//export models
module.exports = db;