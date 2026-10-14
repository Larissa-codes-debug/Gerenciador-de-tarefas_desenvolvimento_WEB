import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function TarefaDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tarefa, setTarefa] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [observacao, setObservacao] = useState('');
  const [justificativa, setJustificativa] = useState('');

  const carregarDados = async () => {
    try {
      const [tarefaResponse, historicoResponse] = await Promise.all([
        api.get(`/tarefas/${id}`),
        api.get(`/tarefas/${id}/historico`)
      ]);

      setTarefa(tarefaResponse.data);
      setHistorico(historicoResponse.data);
    } catch (error) {
      console.error('Erro ao carregar tarefa:', error);

      alert(
        error.response?.data?.mensagem ||
          'Erro ao carregar os dados da tarefa.'
      );
    }
  };

  useEffect(() => {
    carregarDados();
  }, [id]);

  const atualizarTarefa = async (dados) => {
    try {
      await api.put(`/tarefas/${id}`, dados);

      await carregarDados();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);

      alert(
        error.response?.data?.mensagem ||
          'Erro ao atualizar a tarefa.'
      );
    }
  };

  const adicionarObservacao = async () => {
    if (!observacao.trim()) {
      alert('Digite uma observação.');
      return;
    }

    try {
      await api.post(`/tarefas/${id}/observacoes`, {
        texto: observacao.trim()
      });

      setObservacao('');

      await carregarDados();
    } catch (error) {
      console.error('Erro ao adicionar observação:', error);

      alert(
        error.response?.data?.mensagem ||
          'Erro ao adicionar a observação.'
      );
    }
  };

  const registrarJustificativa = async () => {
    if (!justificativa.trim()) {
      alert('Digite uma justificativa.');
      return;
    }

    try {
      await api.post(`/tarefas/${id}/justificativas`, {
        percentual: tarefa.percentual_atendimento,
        motivo: justificativa.trim()
      });

      setJustificativa('');

      await carregarDados();
    } catch (error) {
      console.error('Erro ao registrar justificativa:', error);

      alert(
        error.response?.data?.mensagem ||
          'Erro ao registrar a justificativa.'
      );
    }
  };

  if (!tarefa) {
    return (
      <div className="loading">
        Carregando...
      </div>
    );
  }

  return (
    <div className="content standalone">

      {/* VOLTAR */}
      <button
        className="secondary"
        onClick={() => navigate('/tarefas')}
      >
        ← Voltar
      </button>

      {/* CABEÇALHO */}
      <div className="detail-head">

        <div>
          <h1>{tarefa.titulo}</h1>

          <p>
            {tarefa.descricao || 'Sem descrição.'}
          </p>
        </div>

        <span className="status">
          {tarefa.atrasada
            ? 'ATRASADA'
            : tarefa.status}
        </span>

      </div>

      {/* INFORMAÇÕES */}
      <div className="detail-grid">

        <div className="info">
          <span>Responsável</span>
          <strong>
            {tarefa.responsavel_nome || '-'}
          </strong>
        </div>

        <div className="info">
          <span>Área</span>
          <strong>
            {tarefa.area_nome || '-'}
          </strong>
        </div>

        <div className="info">
          <span>Prazo</span>
          <strong>
            {tarefa.prazo
              ? new Date(tarefa.prazo).toLocaleString(
                  'pt-BR'
                )
              : '-'}
          </strong>
        </div>

        <div className="info">
          <span>Prioridade</span>
          <strong>
            {tarefa.prioridade || '-'}
          </strong>
        </div>

        <div className="info">
          <span>Atendimento</span>
          <strong>
            {Number(tarefa.percentual_atendimento || 0)}%
          </strong>
        </div>

        <div className="info">
          <span>Custo</span>
          <strong>
            R${' '}
            {Number(
              tarefa.custo_estimado || 0
            ).toLocaleString('pt-BR', {
              minimumFractionDigits: 2
            })}
          </strong>
        </div>

      </div>

      {/* AÇÕES */}
      <div className="actions">

        <button
          className="primary"
          onClick={() =>
            atualizarTarefa({
              status: 'EM_ANDAMENTO',
              percentual_atendimento: Math.max(
                Number(tarefa.percentual_atendimento || 0),
                1
              )
            })
          }
        >
          Iniciar
        </button>

        <button
          className="primary"
          onClick={() =>
            atualizarTarefa({
              status: 'CONCLUIDA',
              percentual_atendimento: 100
            })
          }
        >
          Concluir 100%
        </button>

        <button
          className="danger"
          onClick={() =>
            atualizarTarefa({
              status: 'CANCELADA'
            })
          }
        >
          Cancelar
        </button>

      </div>

      {/* OBSERVAÇÕES E JUSTIFICATIVAS */}
      <div className="panel">

        <h3>Observação</h3>

        <textarea
          value={observacao}
          onChange={(event) =>
            setObservacao(event.target.value)
          }
          placeholder="Digite uma observação..."
        />

        <button
          className="secondary"
          onClick={adicionarObservacao}
        >
          Adicionar observação
        </button>

        <h3>Justificativa</h3>

        <textarea
          value={justificativa}
          onChange={(event) =>
            setJustificativa(event.target.value)
          }
          placeholder="Digite uma justificativa..."
        />

        <button
          className="secondary"
          onClick={registrarJustificativa}
        >
          Registrar justificativa
        </button>

      </div>

      {/* HISTÓRICO */}
      <div className="panel">

        <h3>Histórico</h3>

        {historico.length === 0 ? (
          <p>
            Nenhum registro no histórico.
          </p>
        ) : (
          historico.map((item) => (
            <div
              className="history"
              key={item._id}
            >
              <b>
                {item.acao}
              </b>

              <span>
                {item.valorAnterior || '-'}
                {' → '}
                {item.valorNovo || '-'}
              </span>

              <small>
                {item.createdAt
                  ? new Date(
                      item.createdAt
                    ).toLocaleString('pt-BR')
                  : '-'}
              </small>
            </div>
          ))
        )}

      </div>

    </div>
  );
}