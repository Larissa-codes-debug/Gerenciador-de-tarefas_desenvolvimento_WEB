const mongoose = require("mongoose");

const observacaoSchema = new mongoose.Schema({
  tarefaId: {
    type: String,
    required: true
  },

  usuarioId: {
    type: String,
    required: true
  },

  texto: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Observacao", observacaoSchema);