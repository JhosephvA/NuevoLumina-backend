const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize-config');
const Course = require('./Course');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Courses",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  semana: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  fechaEntrega: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: "Tasks",
  timestamps: true,
});

Course.hasMany(Task, { foreignKey: "courseId", as: "tareas" });
Task.belongsTo(Course, { foreignKey: "courseId", as: "curso" });

module.exports = Task;
