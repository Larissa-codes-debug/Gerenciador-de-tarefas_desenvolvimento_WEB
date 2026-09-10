const pool = require("../config/postgres");

async function criarEquipe(req, res) {
  try {
    const {
      nome,
      descricao,
      area_id,
      setor_id
    } = req.body;

    if (!nome) {
      return res.status(400).json({
        mensagem: "O nome da equipe é obrigatório."
      });
    }

    const resultado = await pool.query(
      `
      INSERT INTO equipes
      (nome, descricao, area_id, setor_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        nome,
        descricao || null,
        area_id || null,
        setor_id || null
      ]
    );

    res.status(201).json(resultado.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao criar equipe."
    });
  }
}

async function listarEquipes(req, res) {
  try {
    const resultado = await pool.query(
      `
      SELECT
        e.*,
        a.nome AS area_nome,
        s.nome AS setor_nome
      FROM equipes e
      LEFT JOIN areas a ON a.id = e.area_id
      LEFT JOIN setores s ON s.id = e.setor_id
      ORDER BY e.nome
      `
    );

    res.json(resultado.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao listar equipes."
    });
  }
}

async function buscarEquipe(req, res) {
  try {
    const resultado = await pool.query(
      `
      SELECT
        e.*,
        a.nome AS area_nome,
        s.nome AS setor_nome
      FROM equipes e
      LEFT JOIN areas a ON a.id = e.area_id
      LEFT JOIN setores s ON s.id = e.setor_id
      WHERE e.id = $1
      `,
      [req.params.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Equipe não encontrada."
      });
    }

    res.json(resultado.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar equipe."
    });
  }
}

async function atualizarEquipe(req, res) {
  try {
    const {
      nome,
      descricao,
      area_id,
      setor_id,
      ativo
    } = req.body;

    const resultado = await pool.query(
      `
      UPDATE equipes
      SET
        nome = COALESCE($1, nome),
        descricao = COALESCE($2, descricao),
        area_id = COALESCE($3, area_id),
        setor_id = COALESCE($4, setor_id),
        ativo = COALESCE($5, ativo),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
      `,
      [
        nome,
        descricao,
        area_id,
        setor_id,
        ativo,
        req.params.id
      ]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Equipe não encontrada."
      });
    }

    res.json(resultado.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao atualizar equipe."
    });
  }
}

async function excluirEquipe(req, res) {
  try {
    const resultado = await pool.query(
      `
      DELETE FROM equipes
      WHERE id = $1
      RETURNING *
      `,
      [req.params.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Equipe não encontrada."
      });
    }

    res.json({
      mensagem: "Equipe excluída com sucesso."
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao excluir equipe."
    });
  }
}

module.exports = {
  criarEquipe,
  listarEquipes,
  buscarEquipe,
  atualizarEquipe,
  excluirEquipe
};