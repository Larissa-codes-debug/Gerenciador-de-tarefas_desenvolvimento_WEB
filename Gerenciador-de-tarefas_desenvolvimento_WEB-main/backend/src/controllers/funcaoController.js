const pool = require("../config/postgres");

async function criarFuncao(req, res) {
  try {
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({
        mensagem: "O nome da função é obrigatório."
      });
    }

    const resultado = await pool.query(
      `
      INSERT INTO funcoes (nome, descricao)
      VALUES ($1, $2)
      RETURNING *
      `,
      [nome, descricao || null]
    );

    res.status(201).json(resultado.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao criar função."
    });
  }
}

async function listarFuncoes(req, res) {
  try {
    const resultado = await pool.query(
      `
      SELECT *
      FROM funcoes
      ORDER BY nome
      `
    );

    res.json(resultado.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao listar funções."
    });
  }
}

async function buscarFuncao(req, res) {
  try {
    const resultado = await pool.query(
      `
      SELECT *
      FROM funcoes
      WHERE id = $1
      `,
      [req.params.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Função não encontrada."
      });
    }

    res.json(resultado.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar função."
    });
  }
}

async function atualizarFuncao(req, res) {
  try {
    const { nome, descricao, ativo } = req.body;

    const resultado = await pool.query(
      `
      UPDATE funcoes
      SET
        nome = COALESCE($1, nome),
        descricao = COALESCE($2, descricao),
        ativo = COALESCE($3, ativo),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
      `,
      [nome, descricao, ativo, req.params.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Função não encontrada."
      });
    }

    res.json(resultado.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao atualizar função."
    });
  }
}

async function excluirFuncao(req, res) {
  try {
    const resultado = await pool.query(
      `
      DELETE FROM funcoes
      WHERE id = $1
      RETURNING *
      `,
      [req.params.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Função não encontrada."
      });
    }

    res.json({
      mensagem: "Função excluída com sucesso."
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao excluir função."
    });
  }
}

module.exports = {
  criarFuncao,
  listarFuncoes,
  buscarFuncao,
  atualizarFuncao,
  excluirFuncao
};