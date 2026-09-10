const express = require("express");

const {
  criarFuncao,
  listarFuncoes,
  buscarFuncao,
  atualizarFuncao,
  excluirFuncao
} = require("../controllers/funcaoController");

const router = express.Router();

router.post("/", criarFuncao);
router.get("/", listarFuncoes);
router.get("/:id", buscarFuncao);
router.put("/:id", atualizarFuncao);
router.delete("/:id", excluirFuncao);

module.exports = router;