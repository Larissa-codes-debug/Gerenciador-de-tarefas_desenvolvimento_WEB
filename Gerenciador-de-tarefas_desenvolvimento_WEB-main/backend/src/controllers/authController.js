const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/postgres");

async function registrar(req, res) {
  try {
    const {
      nome,
      email,
      senha,
      perfil = "USUARIO"
    } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        mensagem: "Nome, email e senha são obrigatórios."
      });
    }

    const usuarioExistente = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({
        mensagem: "Email já cadastrado."
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const resultado = await pool.query(
      `
      INSERT INTO usuarios
      (nome, email, senha_hash, perfil)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nome, email, perfil
      `,
      [nome, email, senhaHash, perfil]
    );

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso.",
      usuario: resultado.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao cadastrar usuário."
    });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const resultado = await pool.query(
      `
      SELECT *
      FROM usuarios
      WHERE email = $1
      AND ativo = TRUE
      `,
      [email]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({
        mensagem: "Email ou senha inválidos."
      });
    }

    const usuario = resultado.rows[0];

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha_hash
    );

    if (!senhaValida) {
      return res.status(401).json({
        mensagem: "Email ou senha inválidos."
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        perfil: usuario.perfil
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d"
      }
    );

    res.json({
      mensagem: "Login realizado com sucesso.",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao realizar login."
    });
  }
}

module.exports = {
  registrar,
  login
};