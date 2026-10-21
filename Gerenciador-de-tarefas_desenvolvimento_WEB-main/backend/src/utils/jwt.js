const jwt = require('jsonwebtoken');

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) throw new Error('JWT_SECRET inválido.');
  return value;
}
function criarAccessToken(usuario) {
  return jwt.sign(
    { id: usuario.id },
    secret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      issuer: process.env.ACCESS_TOKEN_ISSUER || 'gerenciador-tarefas',
      audience: process.env.ACCESS_TOKEN_AUDIENCE || 'gerenciador-tarefas-client',
      subject: String(usuario.id)
    }
  );
}
function verificarAccessToken(token) {
  return jwt.verify(token, secret(), {
    issuer: process.env.ACCESS_TOKEN_ISSUER || 'gerenciador-tarefas',
    audience: process.env.ACCESS_TOKEN_AUDIENCE || 'gerenciador-tarefas-client'
  });
}
module.exports = { criarAccessToken, verificarAccessToken };