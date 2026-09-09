const pool = require("../../config/postgres");

async function criarTabelaUsuario() {
  const query = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      nome VARCHAR(150) NOT NULL,

      email VARCHAR(150) NOT NULL UNIQUE,

      senha_hash VARCHAR(255) NOT NULL,

      perfil VARCHAR(30) NOT NULL DEFAULT 'USUARIO',

      area_id UUID,

      setor_id UUID,

      funcao_id UUID,

      ativo BOOLEAN NOT NULL DEFAULT TRUE,

      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT usuarios_perfil_check
        CHECK (
          perfil IN (
            'USUARIO',
            'GESTOR',
            'SUPERVISOR',
            'ADMIN'
          )
        ),

      CONSTRAINT fk_usuario_area
        FOREIGN KEY (area_id)
        REFERENCES areas(id)
        ON DELETE SET NULL,

      CONSTRAINT fk_usuario_setor
        FOREIGN KEY (setor_id)
        REFERENCES setores(id)
        ON DELETE SET NULL,

      CONSTRAINT fk_usuario_funcao
        FOREIGN KEY (funcao_id)
        REFERENCES funcoes(id)
        ON DELETE SET NULL
    );
  `;

  await pool.query(query);

  console.log("Tabela usuarios criada/verificada.");
}

module.exports = {
  criarTabelaUsuario
};