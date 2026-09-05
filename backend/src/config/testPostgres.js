const pool = require('./postgres');

async function testarConexao() {
    try {
        const resultado = await pool.query('SELECT NOW() AS horario');

        console.log('=================================');
        console.log('CONEXÃO COM POSTGRESQL OK!');
        console.log('Horário do banco:', resultado.rows[0].horario);
        console.log('=================================');

    } catch (erro) {
        console.error('ERRO AO CONECTAR AO POSTGRESQL');
        console.error(erro.message);

    } finally {
        await pool.end();
    }
}

testarConexao();