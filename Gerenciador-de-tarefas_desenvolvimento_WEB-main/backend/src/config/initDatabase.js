const { criarTabelaArea } = require("../models/postgres/Area");
const { criarTabelaFuncao } = require("../models/postgres/Funcao");
const { criarTabelaSetor } = require("../models/postgres/Setor");
const { criarTabelaEquipe } = require("../models/postgres/Equipe");
const { criarTabelaUsuario } = require("../models/postgres/Usuario");
const { criarTabelaTarefa } = require("../models/postgres/Tarefa");

const {
  criarTabelaUsuarioEquipe,
  criarTabelaTarefaEquipe
} = require("../models/postgres/relacionamentos");

async function inicializarBanco() {
  try {
    console.log("Iniciando criação das tabelas...");

    // Tabelas principais
    await criarTabelaArea();
    console.log("Tabela areas OK");

    await criarTabelaFuncao();
    console.log("Tabela funcoes OK");

    await criarTabelaSetor();
    console.log("Tabela setores OK");

    await criarTabelaEquipe();
    console.log("Tabela equipes OK");

    await criarTabelaUsuario();
    console.log("Tabela usuarios OK");

    await criarTabelaTarefa();
    console.log("Tabela tarefas OK");

    // Tabelas de relacionamento
    await criarTabelaUsuarioEquipe();
    console.log("Tabela usuario_equipes OK");

    await criarTabelaTarefaEquipe();
    console.log("Tabela tarefa_equipes OK");

    console.log("Todas as tabelas foram criadas/verificadas.");

  } catch (error) {
    console.error("Erro ao inicializar o banco de dados:");
    console.error(error);
    throw error;
  }
}

module.exports = inicializarBanco;