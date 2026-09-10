const Notificacao = require("../models/mongodb/Notificacao");

async function criarNotificacao(req, res) {
  try {
    const {
      destinatarioId,
      tarefaId,
      tipo,
      titulo,
      mensagem
    } = req.body;

    if (!destinatarioId || !tipo || !titulo || !mensagem) {
      return res.status(400).json({
        mensagem:
          "destinatarioId, tipo, titulo e mensagem são obrigatórios."
      });
    }

    const notificacao = await Notificacao.create({
      destinatarioId,
      tarefaId,
      tipo,
      titulo,
      mensagem
    });

    res.status(201).json(notificacao);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao criar notificação."
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

async function marcarComoLida(req, res) {
  try {
    const notificacao = await Notificacao.findOneAndUpdate(
      {
        _id: req.params.id,
        destinatarioId: req.usuario.id
      },
      {
        lida: true
      },
      {
        new: true
      }
    );

    if (!notificacao) {
      return res.status(404).json({
        mensagem: "Notificação não encontrada."
      });
    }

    res.json(notificacao);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao marcar notificação."
    });
  }
}

module.exports = {
  criarNotificacao,
  listarNotificacoes,
  marcarComoLida
};