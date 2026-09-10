const express = require("express");

const autenticar = require("../middlewares/authMiddleware");

const {
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  excluirUsuario
} = require("../controllers/usuarioController");

const router = express.Router();

router.use(autenticar);

router.get("/", listarUsuarios);
router.get("/:id", buscarUsuario);
router.put("/:id", atualizarUsuario);
router.delete("/:id", excluirUsuario);

module.exports = router;