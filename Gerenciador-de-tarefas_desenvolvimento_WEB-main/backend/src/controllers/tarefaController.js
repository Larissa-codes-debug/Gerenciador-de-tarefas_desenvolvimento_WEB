const pool = require("../config/postgres");

async function criarTarefa(req, res) {
  try {
    const {
      titulo,
      descricao,
      area_id,
      setor_id,
      responsavel_id,
      prazo,
      custo_estimado = 0,
      prioridade = "MEDIA"
    } = req.body;

    if (
      !titulo ||
      !descricao ||
      !area_id ||
      !responsavel_id ||
      !prazo
    ) {
      return res.status(400).json({
        mensagem: "Preencha os campos obrigatórios."
      });
    }

    const resultado = await pool.query(
      `
      INSERT INTO tarefas
      (
        titulo,
        descricao,
        area_id,
        setor_id,
        responsavel_id,
        prazo,
        custo_estimado,
        prioridade
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        titulo,
        descricao,
        area_id,
        setor_id,
        responsavel_id,
        prazo,
        custo_estimado,
        prioridade
      ]
    );

    res.status(201).json(resultado.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao criar tarefa."
    });
  }
}

async function listarTarefas(req, res) {
  try {
    const resultado = await pool.query(`
      SELECT
        t.*,
        u.nome AS responsavel_nome,
        a.nome AS area_nome,
        s.nome AS setor_nome
      FROM tarefas t
      JOIN usuarios u
        ON u.id = t.responsavel_id
      JOIN areas a
        ON a.id = t.area_id
      LEFT JOIN setores s
        ON s.id = t.setor_id
      ORDER BY t.created_at DESC
    `);

    res.json(resultado.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao listar tarefas."
    });
  }
}

async function buscarTarefa(req, res) {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `
      SELECT *
      FROM tarefas
      WHERE id = $1
      `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Tarefa não encontrada."
      });
    }

    res.json(resultado.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao buscar tarefa."
    });
  }
}

async function atualizarTarefa(req, res) {
  try {
    const { id } = req.params;

    const {
      titulo,
      descricao,
      prazo,
      custo_estimado,
      custo_real,
      prioridade,
      status,
      percentual_atendimento
    } = req.body;

    const resultado = await pool.query(
      `
      UPDATE tarefas
      SET
        titulo = COALESCE($1, titulo),
        descricao = COALESCE($2, descricao),
        prazo = COALESCE($3, prazo),
        custo_estimado = COALESCE($4, custo_estimado),
        custo_real = COALESCE($5, custo_real),
        prioridade = COALESCE($6, prioridade),
        status = COALESCE($7, status),
        percentual_atendimento =
          COALESCE($8, percentual_atendimento),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
      `,
      [
        titulo,
        descricao,
        prazo,
        custo_estimado,
        custo_real,
        prioridade,
        status,
        percentual_atendimento,
        id
      ]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Tarefa não encontrada."
      });
    }

    res.json(resultado.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao atualizar tarefa."
    });
  }
}

async function excluirTarefa(req, res) {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      `
      UPDATE tarefas
      SET
        status = 'CANCELADA',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, status
      `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Tarefa não encontrada."
      });
    }

    res.json({
      mensagem: "Tarefa cancelada.",
      tarefa: resultado.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensagem: "Erro ao cancelar tarefa."
    });
  }
}

module.exports = {
  criarTarefa,
  listarTarefas,
  buscarTarefa,
  atualizarTarefa,
  excluirTarefa
};