require('dotenv').config();
const inicializarBanco = require('./initDatabase');
const pool = require('./postgres');
(async () => {
  try {
    await inicializarBanco();
    console.log('Inicialização do esquema concluída.');
  } catch (e) {
    console.error('Falha ao inicializar esquema:', e.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();