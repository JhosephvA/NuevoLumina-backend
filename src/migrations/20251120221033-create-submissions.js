'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Submissions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      taskId: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Tasks', key: 'id' },
        onDelete: 'CASCADE'
      },
      estudianteId: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      archivoURL: { type: Sequelize.STRING, allowNull: true },
      nota: { type: Sequelize.FLOAT, allowNull: true },
      fechaEntrega: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Submissions');
  }
};
