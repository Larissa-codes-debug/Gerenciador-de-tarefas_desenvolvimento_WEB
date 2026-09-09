const pool = require("../../config/postgres");

async function criarTabelaSetor() {
  const query = `
    CREATE TABLE IF NOT EXISTS setores (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nome VARCHAR(150) NOT NULL,
      descricao TEXT,
      area_id UUID NOT NULL,
      ativo BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_setor_area
        FOREIGN KEY (area_id)
        REFERENCES areas(id)
        ON DELETE RESTRICT
    );
  `;

  await pool.query(query);

  console.log("Tabela setores criada/verificada.");
}

module.exports = {
  criarTabelaSetor
};