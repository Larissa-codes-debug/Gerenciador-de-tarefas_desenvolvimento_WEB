const pool = require("../../config/postgres");

async function criarTabelaFuncao() {
  const query = `
    CREATE TABLE IF NOT EXISTS funcoes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nome VARCHAR(150) NOT NULL,
      descricao TEXT,
      ativo BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await pool.query(query);

  console.log("Tabela funcoes criada/verificada.");
}

module.exports = {
  criarTabelaFuncao
};