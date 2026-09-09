const pool = require("../../config/postgres");

async function criarTabelaEquipe() {
  const query = `
    CREATE TABLE IF NOT EXISTS equipes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nome VARCHAR(150) NOT NULL,
      descricao TEXT,
      area_id UUID,
      setor_id UUID,
      ativo BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_equipe_area
        FOREIGN KEY (area_id)
        REFERENCES areas(id)
        ON DELETE SET NULL,

      CONSTRAINT fk_equipe_setor
        FOREIGN KEY (setor_id)
        REFERENCES setores(id)
        ON DELETE SET NULL
    );
  `;

  await pool.query(query);

  console.log("Tabela equipes criada/verificada.");
}

module.exports = {
  criarTabelaEquipe
};