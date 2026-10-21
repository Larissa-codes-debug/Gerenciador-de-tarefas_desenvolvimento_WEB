function notFound(req, res) {
  res.status(404).json({ mensagem: 'Rota não encontrada.' });
}
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const status = Number(err.status || err.statusCode || 500);
  if (status >= 500) console.error({ message: err.message, path: req.path, method: req.method });
  const mensagem = status >= 500 ? 'Erro interno do servidor.' : (err.message || 'Requisição inválida.');
  res.status(status).json({ mensagem });
}
module.exports = { notFound, errorHandler };