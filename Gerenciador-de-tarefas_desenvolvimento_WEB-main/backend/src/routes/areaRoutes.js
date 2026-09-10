const express = require("express");

const {
  criarArea,
  listarAreas,
  buscarArea,
  atualizarArea,
  excluirArea
} = require("../controllers/areaController");

const router = express.Router();

router.post("/", criarArea);
router.get("/", listarAreas);
router.get("/:id", buscarArea);
router.put("/:id", atualizarArea);
router.delete("/:id", excluirArea);

module.exports = router;