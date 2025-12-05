"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregar columna semana a Tasks si no existe
    return queryInterface.addColumn("Tasks", "semana", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    // Eliminar columna en caso de rollback
    return queryInterface.removeColumn("Tasks", "semana");
  }
};
