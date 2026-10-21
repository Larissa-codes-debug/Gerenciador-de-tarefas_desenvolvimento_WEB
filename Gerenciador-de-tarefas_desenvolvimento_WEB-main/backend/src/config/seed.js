require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./postgres');
const inicializarBanco = require('./initDatabase');

(async () => {
  try {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error('Defina ADMIN_EMAIL e ADMIN_PASSWORD para provisionar o administrador.');
    }
    if (process.env.ADMIN_PASSWORD.length < 12) {
      throw new Error('ADMIN_PASSWORD deve ter pelo menos 12 caracteres.');
    }
    await inicializarBanco();
    const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
    const existe = await pool.query('SELECT id FROM usuarios WHERE lower(email) = $1', [email]);
    if (existe.rowCount) {
      throw new Error('Esse e-mail já existe. O seed não altera contas existentes; use o fluxo administrativo de redefinição.');
    }
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await pool.query(
      `INSERT INTO usuarios(nome,email,senha_hash,perfil,ativo)
       VALUES($1,$2,$3,'ADMIN',TRUE)`,
      [process.env.ADMIN_NAME || 'Administrador do Sistema', email, hash]
    );
    console.log(`Administrador criado: ${email}. Guarde a senha em local seguro.`);
  } catch (e) {
    console.error('Falha no seed:', e.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();