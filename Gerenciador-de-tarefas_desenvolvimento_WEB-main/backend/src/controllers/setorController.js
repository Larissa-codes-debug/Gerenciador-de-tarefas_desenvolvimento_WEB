const pool = require("../config/postgres");

async function criarSetor(req, res) {
  try {
    const { nome, descricao, area_id } = req.body;

    if (!nome || !area_id) {
      return res.status(400).json({
        mensagem: "Nome e area_id são obrigatórios."
      });
    }

    const resultado = await pool.query(
      `
      INSERT INTO setores (nome, descricao, area_id)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [nome, descricao || null, area_id]
    );

    res.status(201).json(resultado.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao criar setor."
    });
  }
}

async function listarSetores(req, res) {
  try {
    const resultado = await pool.query(
      `
      SELECT s.*, a.nome AS area_nome
      FROM setores s
      JOIN areas a ON a.id = s.area_id
      ORDER BY s.nome
      `
    );

    res.json(resultado.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao listar setores."
    });
  }
}

async function buscarSetor(req, res) {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `
      SELECT s.*, a.nome AS area_nome
      FROM setores s
      JOIN areas a ON a.id = s.area_id
      WHERE s.id = $1
      `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Setor não encontrado."
      });
    }

    res.json(resultado.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar setor."
    });
  }
}

async function atualizarSetor(req, res) {
  try {
    const { id } = req.params;
    const { nome, descricao, area_id, ativo } = req.body;

    const resultado = await pool.query(
      `
      UPDATE setores
      SET
        nome = COALESCE($1, nome),
        descricao = COALESCE($2, descricao),
        area_id = COALESCE($3, area_id),
        ativo = COALESCE($4, ativo),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
      `,
      [nome, descricao, area_id, ativo, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Setor não encontrado."
      });
    }

    res.json(resultado.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao atualizar setor."
    });
  }
}

async function excluirSetor(req, res) {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `
      DELETE FROM setores
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Setor não encontrado."
      });
    }

    res.json({
      mensagem: "Setor excluído com sucesso."
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao excluir setor."
    });
  }
}

module.exports = {
  criarSetor,
  listarSetores,
  buscarSetor,
  atualizarSetor,
  excluirSetor
};