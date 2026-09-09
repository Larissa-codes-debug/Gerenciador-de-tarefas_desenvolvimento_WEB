const mongoose = require("mongoose");

const notificacaoSchema = new mongoose.Schema({
  destinatarioId: {
    type: String,
    required: true
  },

  tarefaId: {
    type: String
  },

  tipo: {
    type: String,
    required: true
  },

  titulo: {
    type: String,
    required: true
  },

  mensagem: {
    type: String,
    required: true
  },

  lida: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Notificacao", notificacaoSchema);