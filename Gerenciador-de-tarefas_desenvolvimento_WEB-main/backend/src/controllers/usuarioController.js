const bcrypt = require("bcrypt");
const pool = require("../config/postgres");

async function listarUsuarios(req, res) {
  try {
    const resultado = await pool.query(
      `
      SELECT
        u.id,
        u.nome,
        u.email,
        u.perfil,
        u.area_id,
        u.setor_id,
        u.funcao_id,
        u.ativo,
        u.created_at,
        u.updated_at
      FROM usuarios u
      ORDER BY u.nome
      `
    );

    res.json(resultado.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao listar usuários."
    });
  }
}

async function buscarUsuario(req, res) {
  try {
    const resultado = await pool.query(
      `
      SELECT
        id,
        nome,
        email,
        perfil,
        area_id,
        setor_id,
        funcao_id,
        ativo,
        created_at,
        updated_at
      FROM usuarios
      WHERE id = $1
      `,
      [req.params.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado."
      });
    }

    res.json(resultado.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar usuário."
    });
  }
}

async function atualizarUsuario(req, res) {
  try {
    const {
      nome,
      email,
      senha,
      perfil,
      area_id,
      setor_id,
      funcao_id,
      ativo
    } = req.body;

    let senhaHash = null;

    if (senha) {
      senhaHash = await bcrypt.hash(senha, 10);
    }

    const resultado = await pool.query(
      `
      UPDATE usuarios
      SET
        nome = COALESCE($1, nome),
        email = COALESCE($2, email),
        senha_hash = COALESCE($3, senha_hash),
        perfil = COALESCE($4, perfil),
        area_id = COALESCE($5, area_id),
        setor_id = COALESCE($6, setor_id),
        funcao_id = COALESCE($7, funcao_id),
        ativo = COALESCE($8, ativo),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING
        id,
        nome,
        email,
        perfil,
        area_id,
        setor_id,
        funcao_id,
        ativo,
        created_at,
        updated_at
      `,
      [
        nome,
        email,
        senhaHash,
        perfil,
        area_id,
        setor_id,
        funcao_id,
        ativo,
        req.params.id
      ]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado."
      });
    }

    res.json(resultado.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao atualizar usuário."
    });
  }
}

async function excluirUsuario(req, res) {
  try {
    const resultado = await pool.query(
      `
      DELETE FROM usuarios
      WHERE id = $1
      RETURNING id, nome, email
      `,
      [req.params.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Usuário não encontrado."
      });
    }

    res.json({
      mensagem: "Usuário excluído com sucesso.",
      usuario: resultado.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao excluir usuário."
    });
  }
}

module.exports = {
  listarUsuarios,
  buscarUsuario,
  atualizarUsuario,
  excluirUsuario
};