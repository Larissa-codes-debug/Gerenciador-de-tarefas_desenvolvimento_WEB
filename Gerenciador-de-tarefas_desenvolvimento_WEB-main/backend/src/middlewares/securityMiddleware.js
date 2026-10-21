const buckets = new Map();

function cabecalhosSeguros(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cache-Control', 'no-store');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
}

// Rate limiter em memória: adequado para uma única instância; use Redis em múltiplas réplicas.
function limitarRequisicoes({ janelaMs = 15 * 60 * 1000, max = 300, mensagem = 'Muitas requisições. Tente novamente mais tarde.' } = {}) {
  return (req, res, next) => {
    const agora = Date.now();
    const chave = `${req.ip}:${req.baseUrl}${req.path}`;
    let item = buckets.get(chave);
    if (!item || item.expira <= agora) item = { total: 0, expira: agora + janelaMs };
    item.total += 1;
    buckets.set(chave, item);
    if (buckets.size > 10000) {
      for (const [k, v] of buckets) if (v.expira <= agora) buckets.delete(k);
    }
    res.setHeader('RateLimit-Limit', max);
    res.setHeader('RateLimit-Remaining', Math.max(0, max - item.total));
    if (item.total > max) {
      res.setHeader('Retry-After', Math.ceil((item.expira - agora) / 1000));
      return res.status(429).json({ mensagem });
    }
    next();
  };
}
module.exports = { cabecalhosSeguros, limitarRequisicoes };