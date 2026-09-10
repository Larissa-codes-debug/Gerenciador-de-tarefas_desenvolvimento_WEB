const express = require("express");

const {
  criarSetor,
  listarSetores,
  buscarSetor,
  atualizarSetor,
  excluirSetor
} = require("../controllers/setorController");

const router = express.Router();

router.post("/", criarSetor);
router.get("/", listarSetores);
router.get("/:id", buscarSetor);
router.put("/:id", atualizarSetor);
router.delete("/:id", excluirSetor);

module.exports = router;