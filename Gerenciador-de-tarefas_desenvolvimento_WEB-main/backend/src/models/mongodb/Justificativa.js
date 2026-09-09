const mongoose = require("mongoose");

const justificativaSchema = new mongoose.Schema({
  tarefaId: {
    type: String,
    required: true
  },

  usuarioId: {
    type: String,
    required: true
  },

  percentual: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },

  motivo: {
    type: String,
    required: true
  },

  aprovadoPor: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Justificativa", justificativaSchema);