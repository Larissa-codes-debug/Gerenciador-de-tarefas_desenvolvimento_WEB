const { criarTabelaArea } = require("../models/postgres/Area");
const { criarTabelaFuncao } = require("../models/postgres/Funcao");
const { criarTabelaSetor } = require("../models/postgres/Setor");
const { criarTabelaEquipe } = require("../models/postgres/Equipe");
const { criarTabelaUsuario } = require("../models/postgres/Usuario");
const { criarTabelaTarefa } = require("../models/postgres/Tarefa");

const {
  criarTabelaUsuarioEquipe,
  criarTabelaTarefaEquipe
} = require("../models/postgres/Relacionamento");

async function inicializarBanco() {
  console.log("Iniciando criação das tabelas...");

  await criarTabelaArea();

  await criarTabelaFuncao();

  await criarTabelaSetor();

  await criarTabelaEquipe();

  await criarTabelaUsuario();

  await criarTabelaTarefa();

  await criarTabelaUsuarioEquipe();

  await criarTabelaTarefaEquipe();

  console.log("Todas as tabelas foram criadas/verificadas.");
}

module.exports = inicializarBanco;