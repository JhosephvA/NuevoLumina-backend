// test-conn.js
const { Sequelize } = require('sequelize');

const DB_URL = process.env.DB_URL;

const sequelize = new Sequelize(DB_URL, {
  dialect: 'mysql',
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a Railway');
    await sequelize.close();
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
  }
})();
