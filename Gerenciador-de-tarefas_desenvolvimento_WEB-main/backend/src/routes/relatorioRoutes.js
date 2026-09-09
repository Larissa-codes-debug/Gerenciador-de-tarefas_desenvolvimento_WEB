const express = require("express");

const autenticar = require("../middlewares/authMiddleware");

const {
  criarObservacao,
  criarJustificativa,
  listarNotificacoes,
  listarHistorico
} = require("../controllers/documentosController");

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
  "/notificacoes",
  listarNotificacoes
);

router.get(
  "/tarefas/:id/historico",
  listarHistorico
);

module.exports = router;