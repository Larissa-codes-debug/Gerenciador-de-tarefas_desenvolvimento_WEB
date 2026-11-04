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

const origensPermitidas = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map(origem => origem.trim())
  .filter(Boolean);

app.use(cors({
  origin(origem, callback) {
    // Requisições sem Origin (healthcheck, curl e comunicação serviço-serviço).
    if (!origem || origensPermitidas.includes(origem)) return callback(null, true);
    const erro = new Error('Origem não permitida pelo CORS.');
    erro.status = 403;
    return callback(erro);
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  optionsSuccessStatus: 204
}));

app.use(cabecalhosSeguros);
app.use(express.json({ limit: '256kb', strict: true }));
app.use(express.urlencoded({ extended: false, limit: '32kb' }));
app.use(limitarRequisicoes({
  max: Number(process.env.RATE_LIMIT_MAX || 300),
  mensagem: 'Muitas requisições. Tente novamente mais tarde.'
}));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    servico: 'gerenciador-tarefas',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/ready', async (req, res) => {
  const pool = require('./config/postgres');
  const mongoose = require('mongoose');
  try {
    await pool.query('SELECT 1');
    if (mongoose.connection.readyState !== 1) throw new Error('MongoDB indisponível');
    return res.json({ status: 'ready' });
  } catch {
    return res.status(503).json({ status: 'not_ready' });
  }
});

app.use(
  '/api/auth',
  limitarRequisicoes({
    janelaMs: 15 * 60 * 1000,
    max: Number(process.env.AUTH_RATE_LIMIT_MAX || 30),
    mensagem: 'Muitas tentativas de autenticação. Aguarde antes de tentar novamente.'
  }),
  require('./routes/authRoutes')
);

app.use('/api/tarefas', require('./routes/tarefaRoutes'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/catalogos', require('./routes/catalogRoutes'));
app.use('/api/notificacoes', require('./routes/notificacaoRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 3000);

async function iniciarServidor() {
  try {
    validarAmbiente();
    await conectarMongoDB();
    await inicializarBanco();

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`API iniciada na porta ${PORT}`);
    });

    const encerrar = () => {
      server.close(async () => {
        try {
          await require('./config/postgres').end();
          await require('mongoose').disconnect();
        } finally {
          process.exit(0);
        }
      });
    };

    process.once('SIGTERM', encerrar);
    process.once('SIGINT', encerrar);
  } catch (erro) {
    console.error('Falha ao iniciar a API:', erro.message);
    process.exit(1);
  }
}

iniciarServidor();
