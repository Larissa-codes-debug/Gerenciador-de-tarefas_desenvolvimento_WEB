const { Pool } = require('pg');
if (!process.env.POSTGRES_PASSWORD) throw new Error('POSTGRES_PASSWORD é obrigatório.');
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT || 5432),
  database: process.env.POSTGRES_DB || 'gerenciador_tarefas',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  max: Number(process.env.PG_POOL_MAX || 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  application_name: 'gerenciador-tarefas-api'
});
pool.on('error', err => console.error('Erro inesperado no pool PostgreSQL:', err.message));
module.exports = pool;