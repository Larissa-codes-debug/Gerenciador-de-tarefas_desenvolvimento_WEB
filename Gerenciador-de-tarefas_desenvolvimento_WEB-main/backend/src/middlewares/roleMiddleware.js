const PERFIS_VALIDOS = new Set(['ADMIN', 'GESTOR', 'SUPERVISOR', 'USUARIO']);

function permitir(...perfisPermitidos) {
  const perfis = perfisPermitidos.map(perfil => String(perfil).toUpperCase());
  if (!perfis.length || perfis.some(perfil => !PERFIS_VALIDOS.has(perfil))) {
    throw new Error('roleMiddleware recebeu um perfil inválido ou nenhuma permissão.');
  }

  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ mensagem: 'Autenticação obrigatória.' });
    }
    if (!perfis.includes(String(req.usuario.perfil).toUpperCase())) {
      return res.status(403).json({ mensagem: 'Você não possui permissão para esta operação.' });
    }
    return next();
  };
}

module.exports = permitir;
