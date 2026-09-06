const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
});

pool.on('connect', () => {
    console.log('Conectado ao PostgreSQL');
});

pool.on('error', (err) => {
    console.error('Erro inesperado no PostgreSQL:', err);
});

module.exports = pool;