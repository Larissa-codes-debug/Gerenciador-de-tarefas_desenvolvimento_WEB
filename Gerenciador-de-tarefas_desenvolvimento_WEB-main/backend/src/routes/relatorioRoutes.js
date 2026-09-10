const express = require("express");

const autenticar = require("../middlewares/authMiddleware");

const {
  criarObservacao,
  criarJustificativa,
  listarHistorico
} = require("../controllers/relatorioController");

const router = express.Router();

router.use(autenticar);

router.post(
  "/tarefas/:id/observacoes",
  criarObservacao
);

router.post(
  "/tarefas/:id/justificativas",
  criarJustificativa
);

router.get(
  "/tarefas/:id/historico",
  listarHistorico
);

module.exports = router;