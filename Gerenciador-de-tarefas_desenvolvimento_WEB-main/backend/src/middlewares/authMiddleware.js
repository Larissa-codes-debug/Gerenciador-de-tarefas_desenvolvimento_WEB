const { verificarAccessToken } = require('../utils/jwt');
const pool = require('../config/postgres');

async function autenticar(req, res, next) {
  try {
    const authorization = req.headers.authorization || '';
    const match = /^Bearer\s+([^\s]+)$/i.exec(authorization);
    if (!match) {
      return res.status(401).json({ mensagem: 'Autenticação obrigatória. Envie o token Bearer.' });
    }

    const payload = verificarAccessToken(match[1]);
    if (!payload || !payload.id || String(payload.sub) !== String(payload.id)) {
      return res.status(401).json({ mensagem: 'Token inválido.' });
    }

    // O perfil e o estado da conta são consultados no banco em cada requisição.
    const resultado = await pool.query(
      `SELECT id,nome,email,perfil,area_id,setor_id,funcao_id,ativo
       FROM usuarios WHERE id=$1 LIMIT 1`,
      [payload.id]
    );

    if (!resultado.rowCount || !resultado.rows[0].ativo) {
      return res.status(401).json({ mensagem: 'Sessão inválida ou usuário inativo.' });
    }

    req.usuario = resultado.rows[0];
    return next();
  } catch (erro) {
    if (['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(erro.name)) {
      return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
    }
    return next(erro);
  }
}

module.exports = autenticar;
