const pool = require("../../config/postgres");

async function criarTabelaTarefa() {
  const query = `
    CREATE TABLE IF NOT EXISTS tarefas (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      titulo VARCHAR(255) NOT NULL,

      descricao TEXT NOT NULL,

      area_id UUID NOT NULL,

      setor_id UUID,

      responsavel_id UUID NOT NULL,

      prazo TIMESTAMP NOT NULL,

      data_inicio TIMESTAMP,

      data_conclusao TIMESTAMP,

      custo_estimado DECIMAL(12,2) NOT NULL DEFAULT 0,

      custo_real DECIMAL(12,2) NOT NULL DEFAULT 0,

      prioridade VARCHAR(10) NOT NULL DEFAULT 'MEDIA',

      status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',

      percentual_atendimento DECIMAL(5,2) NOT NULL DEFAULT 0,

      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT tarefa_prioridade_check
        CHECK (
          prioridade IN (
            'BAIXA',
            'MEDIA',
            'ALTA'
          )
        ),

      CONSTRAINT tarefa_status_check
        CHECK (
          status IN (
            'PENDENTE',
            'EM_ANDAMENTO',
            'CONCLUIDA',
            'CANCELADA'
          )
        ),

      CONSTRAINT tarefa_percentual_check
        CHECK (
          percentual_atendimento >= 0
          AND percentual_atendimento <= 100
        ),

      CONSTRAINT tarefa_custo_estimado_check
        CHECK (
          custo_estimado >= 0
        ),

      CONSTRAINT tarefa_custo_real_check
        CHECK (
          custo_real >= 0
        ),

      CONSTRAINT fk_tarefa_area
        FOREIGN KEY (area_id)
        REFERENCES areas(id)
        ON DELETE RESTRICT,

      CONSTRAINT fk_tarefa_setor
        FOREIGN KEY (setor_id)
        REFERENCES setores(id)
        ON DELETE SET NULL,

      CONSTRAINT fk_tarefa_responsavel
        FOREIGN KEY (responsavel_id)
        REFERENCES usuarios(id)
        ON DELETE RESTRICT
    );
  `;

  await pool.query(query);

  console.log("Tabela tarefas criada/verificada.");
}

module.exports = {
  criarTabelaTarefa
};