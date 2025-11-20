'use strict';

const bcrypt = require('bcryptjs');
const config = require('../config/config');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // -----------------------
    // 1. Crear usuarios iniciales
    // -----------------------
    const adminPassword = await bcrypt.hash('AdminPass123!', 10);
    const professorPassword = await bcrypt.hash('ProfesorPass123!', 10);
    const studentPassword = await bcrypt.hash('EstudiantePass123!', 10);

    await queryInterface.bulkInsert('users', [
      {
        nombre: 'Super',
        apellido: 'Admin',
        email: 'admin@academia.com',
        password: adminPassword,
        rol: config.roles.ADMIN,
        intentosFallidos: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Ana',
        apellido: 'García',
        email: 'ana.garcia@academia.com',
        password: professorPassword,
        rol: config.roles.PROFESSOR,
        intentosFallidos: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Carlos',
        apellido: 'Pérez',
        email: 'carlos.perez@academia.com',
        password: studentPassword,
        rol: config.roles.STUDENT,
        intentosFallidos: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // -----------------------
    // 2. Obtener IDs de profesor y estudiante
    // -----------------------
    const [professorUser] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'ana.garcia@academia.com';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const [studentUser] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'carlos.perez@academia.com';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const professorId = professorUser.id;
    const studentId = studentUser.id;

    // -----------------------
    // 3. Crear curso de ejemplo
    // -----------------------
    await queryInterface.bulkInsert('courses', [
      {
        nombre: 'Introducción a Node.js',
        descripcion: 'Curso básico para aprender a desarrollar backend con Node.js y Express.',
        profesorId: professorId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    const [course] = await queryInterface.sequelize.query(
      `SELECT id FROM courses WHERE nombre = 'Introducción a Node.js';`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const courseId = course.id;

    // -----------------------
    // 4. Crear matrícula de ejemplo
    // -----------------------
    await queryInterface.bulkInsert('enrollments', [
      {
        estudianteId: studentId,
        courseId: courseId,
        fecha: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('enrollments', null, {});
    await queryInterface.bulkDelete('courses', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
