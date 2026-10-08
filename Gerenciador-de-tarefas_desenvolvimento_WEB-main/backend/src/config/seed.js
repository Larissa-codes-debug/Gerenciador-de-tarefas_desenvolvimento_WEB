require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./postgres');
const inicializarBanco = require('./initDatabase');
(async()=>{
  try {
    await inicializarBanco();
    const email = (process.env.ADMIN_EMAIL || 'admin@instituicao.local').toLowerCase();
    const senha = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const hash = await bcrypt.hash(senha, 12);
    await pool.query(`INSERT INTO usuarios(nome,email,senha_hash,perfil) VALUES($1,$2,$3,'ADMIN') ON CONFLICT(email) DO UPDATE SET senha_hash=EXCLUDED.senha_hash, perfil='ADMIN', ativo=TRUE, updated_at=NOW()`, [process.env.ADMIN_NAME || 'Administrador do Sistema', email, hash]);
    console.log(`Administrador disponível: ${email}`);
  } finally { await pool.end(); }
})();
