const Observacao = require("../models/mongodb/Observacao");
const Justificativa = require("../models/mongodb/Justificativa");
const Notificacao = require("../models/mongodb/Notificacao");
const HistoricoTarefa = require("../models/mongodb/HistoricoTarefa");

async function criarObservacao(req, res) {
  try {
    const observacao = await Observacao.create({
      tarefaId: req.params.id,
      usuarioId: req.usuario.id,
      texto: req.body.texto
    });

    res.status(201).json(observacao);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao criar observação."
    });
  }
}

async function criarJustificativa(req, res) {
  try {
    const justificativa = await Justificativa.create({
      tarefaId: req.params.id,
      usuarioId: req.usuario.id,
      percentual: req.body.percentual,
      motivo: req.body.motivo
    });

    res.status(201).json(justificativa);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao criar justificativa."
    });
  }
}

async function listarNotificacoes(req, res) {
  try {
    const notificacoes = await Notificacao
      .find({
        destinatarioId: req.usuario.id
      })
      .sort({ createdAt: -1 });

    res.json(notificacoes);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao listar notificações."
    });
  }
}

async function listarHistorico(req, res) {
  try {
    const historico = await HistoricoTarefa
      .find({
        tarefaId: req.params.id
      })
      .sort({ createdAt: -1 });

    res.json(historico);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao consultar histórico."
    });
  }
}

module.exports = {
  criarObservacao,
  criarJustificativa,
  listarNotificacoes,
  listarHistorico
};