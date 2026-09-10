const express = require("express");

const autenticar = require("../middlewares/authMiddleware");

const {
  criarNotificacao,
  listarNotificacoes,
  marcarComoLida
} = require("../controllers/notificacaoController");

const router = express.Router();

router.use(autenticar);

router.post("/", criarNotificacao);
router.get("/", listarNotificacoes);
router.put("/:id/lida", marcarComoLida);

module.exports = router;