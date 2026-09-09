const mongoose = require("mongoose");

const historicoTarefaSchema = new mongoose.Schema({
  tarefaId: {
    type: String,
    required: true
  },

  usuarioId: {
    type: String,
    required: true
  },

  acao: {
    type: String,
    required: true
  },

  valorAnterior: {
    type: String
  },

  valorNovo: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  "HistoricoTarefa",
  historicoTarefaSchema
);