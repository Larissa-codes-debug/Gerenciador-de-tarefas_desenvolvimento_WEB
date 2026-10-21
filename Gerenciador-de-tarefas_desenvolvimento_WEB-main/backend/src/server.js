require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarMongoDB = require('./config/mongodb');
const inicializarBanco = require('./config/initDatabase');
const { validarAmbiente } = require('./config/env');
const { cabecalhosSeguros, limitarRequisicoes } = require('./middlewares/securityMiddleware');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', process.env.TRUST_PROXY === 'true' ? 1 : false);
const origens = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',').map(x => x.trim()).filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || origens.includes(origin)) return callback(null, true);
    const erro = new Error('Origem não permitida pelo CORS.'); erro.status = 403; return callback(erro);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id']
}));
app.use(cabecalhosSeguros);
app.use(express.json({ limit: '256kb', strict: true }));
app.use(express.urlencoded({ extended: false, limit: '32kb' }));
app.use(limitarRequisicoes({ max: Number(process.env.RATE_LIMIT_MAX || 300) }));

app.get('/api/health', async (req, res) => {
  res.json({ status: 'ok', servico: 'gerenciador-tarefas', timestamp: new Date().toISOString() });
});
app.get('/api/ready', async (req, res) => {
  const pool = require('./config/postgres');
  const mongoose = require('mongoose');
  try {
    await pool.query('SELECT 1');
    if (mongoose.connection.readyState !== 1) throw new Error('MongoDB indisponível');
    res.json({ status: 'ready' });
  } catch {
    res.status(503).json({ status: 'not_ready' });
  }
});

app.use('/api/auth', limitarRequisicoes({ janelaMs: 15 * 60 * 1000, max: 30, mensagem: 'Muitas tentativas de autenticação.' }), require('./routes/authRoutes'));
app.use('/api/tarefas', require('./routes/tarefaRoutes'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/catalogos', require('./routes/catalogRoutes'));
app.use('/api/notificacoes', require('./routes/notificacaoRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 3000);
(async () => {
  try {
    validarAmbiente();
    await conectarMongoDB();
    await inicializarBanco();
    const server = app.listen(PORT, '0.0.0.0', () => console.log(`API iniciada na porta ${PORT}`));
    const encerrar = signal => server.close(async () => {
      try { await require('./config/postgres').end(); await require('mongoose').disconnect(); }
      finally { process.exit(0); }
    });
    process.on('SIGTERM', () => encerrar('SIGTERM'));
    process.on('SIGINT', () => encerrar('SIGINT'));
  } catch (e) {
    console.error('Falha ao iniciar a API:', e.message);
    process.exit(1);
  }
})();