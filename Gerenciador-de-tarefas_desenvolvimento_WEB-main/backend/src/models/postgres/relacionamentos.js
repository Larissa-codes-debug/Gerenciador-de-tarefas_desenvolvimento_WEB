const pool = require("../../config/postgres");

async function criarTabelaUsuarioEquipe() {
  const query = `
    CREATE TABLE IF NOT EXISTS usuario_equipes (
      usuario_id UUID NOT NULL,
      equipe_id UUID NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

      PRIMARY KEY (usuario_id, equipe_id),

      CONSTRAINT fk_usuario_equipe_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_usuario_equipe_equipe
        FOREIGN KEY (equipe_id)
        REFERENCES equipes(id)
        ON DELETE CASCADE
    );
  `;

  await pool.query(query);

  console.log("Tabela usuario_equipes criada/verificada.");
}

async function criarTabelaTarefaEquipe() {
  const query = `
    CREATE TABLE IF NOT EXISTS tarefa_equipes (
      tarefa_id UUID NOT NULL,
      equipe_id UUID NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

      PRIMARY KEY (tarefa_id, equipe_id),

      CONSTRAINT fk_tarefa_equipe_tarefa
        FOREIGN KEY (tarefa_id)
        REFERENCES tarefas(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_tarefa_equipe_equipe
        FOREIGN KEY (equipe_id)
        REFERENCES equipes(id)
        ON DELETE CASCADE
    );
  `;

  await pool.query(query);

  console.log("Tabela tarefa_equipes criada/verificada.");
}

module.exports = {
  criarTabelaUsuarioEquipe,
  criarTabelaTarefaEquipe
};