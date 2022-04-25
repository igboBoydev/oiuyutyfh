var Sequelize = require('sequelize');

var AdminLog = (sequelize, type) => {
  return sequelize.define('admin_log', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    email: Sequelize.STRING,
    description: Sequelize.STRING,
    data: Sequelize.STRING,
  })
}

module.exports = AdminLog;