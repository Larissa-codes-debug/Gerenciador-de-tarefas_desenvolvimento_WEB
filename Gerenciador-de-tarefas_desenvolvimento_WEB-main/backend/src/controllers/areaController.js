const pool = require("../config/postgres");

async function criarArea(req, res) {
  try {
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({
        mensagem: "O nome da área é obrigatório."
      });
    }

    const resultado = await pool.query(
      `
      INSERT INTO areas (nome, descricao)
      VALUES ($1, $2)
      RETURNING *
      `,
      [nome, descricao || null]
    );

    res.status(201).json(resultado.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao criar área."
    });
  }
}

async function listarAreas(req, res) {
  try {
    const resultado = await pool.query(
      `
      SELECT *
      FROM areas
      ORDER BY nome
      `
    );

    res.json(resultado.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao listar áreas."
    });
  }
}

async function buscarArea(req, res) {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `
      SELECT *
      FROM areas
      WHERE id = $1
      `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Área não encontrada."
      });
    }

    res.json(resultado.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar área."
    });
  }
}

async function atualizarArea(req, res) {
  try {
    const { id } = req.params;
    const { nome, descricao, ativo } = req.body;

    const resultado = await pool.query(
      `
      UPDATE areas
      SET
        nome = COALESCE($1, nome),
        descricao = COALESCE($2, descricao),
        ativo = COALESCE($3, ativo),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
      `,
      [nome, descricao, ativo, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Área não encontrada."
      });
    }

    res.json(resultado.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao atualizar área."
    });
  }
}

async function excluirArea(req, res) {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `
      DELETE FROM areas
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Área não encontrada."
      });
    }

    res.json({
      mensagem: "Área excluída com sucesso.",
      area: resultado.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao excluir área."
    });
  }
}

module.exports = {
  criarArea,
  listarAreas,
  buscarArea,
  atualizarArea,
  excluirArea
};