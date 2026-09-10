const express = require("express");

const {
  criarEquipe,
  listarEquipes,
  buscarEquipe,
  atualizarEquipe,
  excluirEquipe
} = require("../controllers/equipeController");

const router = express.Router();

router.post("/", criarEquipe);
router.get("/", listarEquipes);
router.get("/:id", buscarEquipe);
router.put("/:id", atualizarEquipe);
router.delete("/:id", excluirEquipe);

module.exports = router;