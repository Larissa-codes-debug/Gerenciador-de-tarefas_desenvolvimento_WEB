const pool = require('./postgres');
const bcrypt = require('bcrypt');

async function inicializarBanco() {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS areas (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(), nome VARCHAR(150) NOT NULL,
      descricao TEXT, ativo BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS setores (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(), nome VARCHAR(150) NOT NULL,
      descricao TEXT, area_id UUID NOT NULL REFERENCES areas(id) ON DELETE RESTRICT,
      ativo BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS funcoes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(), nome VARCHAR(150) NOT NULL,
      descricao TEXT, ativo BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS equipes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(), nome VARCHAR(150) NOT NULL,
      descricao TEXT, area_id UUID REFERENCES areas(id) ON DELETE SET NULL,
      setor_id UUID REFERENCES setores(id) ON DELETE SET NULL,
      ativo BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS usuarios (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(), nome VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE, senha_hash VARCHAR(255) NOT NULL,
      perfil VARCHAR(20) NOT NULL DEFAULT 'USUARIO' CHECK (perfil IN ('USUARIO','GESTOR','SUPERVISOR','ADMIN')),
      area_id UUID REFERENCES areas(id) ON DELETE SET NULL, setor_id UUID REFERENCES setores(id) ON DELETE SET NULL,
      funcao_id UUID REFERENCES funcoes(id) ON DELETE SET NULL, ativo BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS tarefas (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(), titulo VARCHAR(255) NOT NULL,
      descricao TEXT NOT NULL, area_id UUID NOT NULL REFERENCES areas(id) ON DELETE RESTRICT,
      setor_id UUID REFERENCES setores(id) ON DELETE SET NULL, responsavel_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
      prazo TIMESTAMPTZ NOT NULL, data_inicio TIMESTAMPTZ, data_conclusao TIMESTAMPTZ,
      custo_estimado NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (custo_estimado >= 0),
      custo_real NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (custo_real >= 0),
      prioridade VARCHAR(10) NOT NULL DEFAULT 'MEDIA' CHECK (prioridade IN ('BAIXA','MEDIA','ALTA')),
      status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE','EM_ANDAMENTO','CONCLUIDA','CANCELADA')),
      percentual_atendimento NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (percentual_atendimento BETWEEN 0 AND 100),
      ativo BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS usuario_equipes (
      usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      equipe_id UUID NOT NULL REFERENCES equipes(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY(usuario_id,equipe_id)
    );
    CREATE TABLE IF NOT EXISTS tarefa_equipes (
      tarefa_id UUID NOT NULL REFERENCES tarefas(id) ON DELETE CASCADE,
      equipe_id UUID NOT NULL REFERENCES equipes(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY(tarefa_id,equipe_id)
    );
    CREATE TABLE IF NOT EXISTS tarefa_usuarios (
      tarefa_id UUID NOT NULL REFERENCES tarefas(id) ON DELETE CASCADE,
      usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY(tarefa_id,usuario_id)
    );
    CREATE TABLE IF NOT EXISTS tarefa_funcoes (
      tarefa_id UUID NOT NULL REFERENCES tarefas(id) ON DELETE CASCADE,
      funcao_id UUID NOT NULL REFERENCES funcoes(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY(tarefa_id,funcao_id)
    );
    CREATE INDEX IF NOT EXISTS idx_tarefas_status ON tarefas(status);
    CREATE INDEX IF NOT EXISTS idx_tarefas_prazo ON tarefas(prazo);
    CREATE INDEX IF NOT EXISTS idx_tarefas_responsavel ON tarefas(responsavel_id);
    CREATE INDEX IF NOT EXISTS idx_tarefas_area ON tarefas(area_id);
    CREATE INDEX IF NOT EXISTS idx_tarefas_setor ON tarefas(setor_id);
    CREATE INDEX IF NOT EXISTS idx_usuarios_area ON usuarios(area_id);
    CREATE INDEX IF NOT EXISTS idx_usuarios_setor ON usuarios(setor_id);
  `);
  const area = await pool.query("INSERT INTO areas(nome,descricao) VALUES('Administração','Área inicial do sistema') ON CONFLICT DO NOTHING RETURNING id");
  await pool.query("INSERT INTO funcoes(nome,descricao) VALUES('Administrador','Administrador do sistema') ON CONFLICT DO NOTHING");
  const email=(process.env.ADMIN_EMAIL||'admin@instituicao.local').toLowerCase();
  const senha=await bcrypt.hash(process.env.ADMIN_PASSWORD||'Admin@12345',12);
  await pool.query("INSERT INTO usuarios(nome,email,senha_hash,perfil) VALUES($1,$2,$3,'ADMIN') ON CONFLICT(email) DO UPDATE SET perfil='ADMIN',ativo=true,senha_hash=EXCLUDED.senha_hash,updated_at=NOW()",[process.env.ADMIN_NAME||'Administrador do Sistema',email,senha]);
  console.log('PostgreSQL: schema + administrador inicial OK');
}
module.exports = inicializarBanco;
