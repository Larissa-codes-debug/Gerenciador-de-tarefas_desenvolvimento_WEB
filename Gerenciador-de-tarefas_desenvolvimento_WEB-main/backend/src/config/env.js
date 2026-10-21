const crypto = require('crypto');

function validarAmbiente() {
  const production = process.env.NODE_ENV === 'production';
  const secret = process.env.JWT_SECRET || '';
  if (secret.length < 32 || /troque-esta-chave|secret|changeme|admin@123/i.test(secret)) {
    throw new Error('JWT_SECRET deve conter pelo menos 32 caracteres aleatórios e não pode ser um valor de exemplo.');
  }
  if (!process.env.POSTGRES_PASSWORD) {
    throw new Error('POSTGRES_PASSWORD é obrigatório.');
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI é obrigatório.');
  }
  if (production && !process.env.CORS_ORIGINS) {
    throw new Error('CORS_ORIGINS deve ser configurado em produção.');
  }
  if (!process.env.ACCESS_TOKEN_ISSUER) process.env.ACCESS_TOKEN_ISSUER = 'gerenciador-tarefas';
  if (!process.env.ACCESS_TOKEN_AUDIENCE) process.env.ACCESS_TOKEN_AUDIENCE = 'gerenciador-tarefas-client';
}
module.exports = { validarAmbiente };