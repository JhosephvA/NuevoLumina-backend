'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StudyLogs', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      estudianteId: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      minutosEstudio: { type: Sequelize.INTEGER, allowNull: false },
      fecha: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('StudyLogs');
  }
};
