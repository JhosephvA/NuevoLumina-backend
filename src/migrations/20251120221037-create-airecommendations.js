'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AiRecommendations', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      estudianteId: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      taskId: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Tasks', key: 'id' },
        onDelete: 'CASCADE'
      },
      recomendacion: { type: Sequelize.TEXT, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AiRecommendations');
  }
};
