const express = require('express');
const controller = require('../controllers/authController');
const autenticar = require('../middlewares/authMiddleware');

const router = express.Router();

// Normaliza chamadas POST sem corpo para evitar acesso a req.body undefined.
router.use((req, res, next) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) req.body = {};
  next();
});

// Rotas públicas: cadastro, login e manutenção da sessão.
router.post('/register', controller.registrar);
router.post('/login', controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);

// Rota privada: retorna somente os dados do usuário autenticado.
router.get('/me', autenticar, controller.me);

module.exports = router;
