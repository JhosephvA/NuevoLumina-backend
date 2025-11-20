'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tasks', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      courseId: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'courses', key: 'id' },
        onDelete: 'CASCADE'
      },
      titulo: { type: Sequelize.STRING, allowNull: false },
      descripcion: { type: Sequelize.TEXT, allowNull: true },
      fechaEntrega: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tasks');
  }
};
