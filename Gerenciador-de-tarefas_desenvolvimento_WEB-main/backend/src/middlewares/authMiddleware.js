const { verificarAccessToken } = require('../utils/jwt');
const pool = require('../config/postgres');

async function autenticar(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const match = /^Bearer\s+([^\s]+)$/i.exec(header);
    if (!match) return res.status(401).json({ mensagem: 'Autenticação obrigatória.' });
    const payload = verificarAccessToken(match[1]);
    const r = await pool.query(
      `SELECT id,nome,email,perfil,area_id,setor_id,funcao_id,ativo
       FROM usuarios WHERE id=$1`,
      [payload.id]
    );
    if (!r.rowCount || !r.rows[0].ativo) {
      return res.status(401).json({ mensagem: 'Sessão inválida ou usuário inativo.' });
    }
    // Permissões sempre vêm do banco; não confiamos em perfil antigo dentro do JWT.
    req.usuario = r.rows[0];
    next();
  } catch (e) {
    if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError' || e.name === 'NotBeforeError') {
      return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
    }
    next(e);
  }
}
module.exports = autenticar;