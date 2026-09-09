const express = require("express");

const autenticar = require("../middlewares/authMiddleware");

const {
  criarTarefa,
  listarTarefas,
  buscarTarefa,
  atualizarTarefa,
  excluirTarefa
} = require("../controllers/tarefaController");

const router = express.Router();

router.use(autenticar);

router.post("/", criarTarefa);

router.get("/", listarTarefas);

router.get("/:id", buscarTarefa);

router.put("/:id", atualizarTarefa);

router.delete("/:id", excluirTarefa);

module.exports = router;