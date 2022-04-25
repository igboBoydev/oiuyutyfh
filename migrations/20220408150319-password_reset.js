'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('admin_password_reset', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      admin_id: {
        allowNull: true,
        type: Sequelize.STRING
      },
      token: {
        allowNull: true,
        type: Sequelize.STRING
      },
      used: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      expiry_date: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      updatedAt: {
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: 'TIMESTAMP'
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('admin_password_reset');
  }
};