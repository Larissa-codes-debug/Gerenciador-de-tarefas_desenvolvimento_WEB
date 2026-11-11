import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const tarefasDemo = {
  1: {
    id: 1,
    titulo: 'Organizar documentação do projeto',
    descricao:
      'Organizar e revisar toda a documentação necessária para o projeto.',
    responsavel_nome: 'Ana Carolina',
    area_nome: 'Administrativo',
    prazo: '2026-11-15T17:00',
    prioridade: 'ALTA',
    percentual_atendimento: 25,
    custo_estimado: 850,
    status: 'PENDENTE',
    atrasada: false
  },
  2: {
    id: 2,
    titulo: 'Atualizar cadastro de usuários',
    descricao:
      'Revisar e atualizar os cadastros dos usuários do sistema.',
    responsavel_nome: 'Mariana Silva',
    area_nome: 'Recursos Humanos',
    prazo: '2026-11-18T17:00',
    prioridade: 'MEDIA',
    percentual_atendimento: 60,
    custo_estimado: 650,
    status: 'EM_ANDAMENTO',
    atrasada: false
  },
  3: {
    id: 3,
    titulo: 'Finalizar relatório mensal',
    descricao:
      'Finalizar o relatório mensal com os dados das atividades realizadas.',
    responsavel_nome: 'Carlos Eduardo',
    area_nome: 'Operações',
    prazo: '2026-11-05T17:00',
    prioridade: 'ALTA',
    percentual_atendimento: 100,
    custo_estimado: 1200,
    status: 'CONCLUIDA',
    atrasada: false
  },
  4: {
    id: 4,
    titulo: 'Revisar tarefas pendentes',
    descricao:
      'Revisar as tarefas que ainda estão pendentes e verificar os próximos passos.',
    responsavel_nome: 'Ana Carolina',
    area_nome: 'Administrativo',
    prazo: '2026-11-01T17:00',
    prioridade: 'BAIXA',
    percentual_atendimento: 10,
    custo_estimado: 400,
    status: 'PENDENTE',
    atrasada: true
  }
};

export default function TarefaDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tarefa, setTarefa] = useState(
    tarefasDemo[id] || tarefasDemo[1]
  );

  const [observacao, setObservacao] = useState('');
  const [justificativa, setJustificativa] = useState('');

  const [historico, setHistorico] = useState([
    {
      _id: '1',
      acao: 'Tarefa criada',
      valorAnterior: '-',
      valorNovo: tarefa.status,
      createdAt: '2026-11-10T08:30:00'
    }
  ]);

  const registrarHistorico = (acao, anterior, novo) => {
    setHistorico((lista) => [
      ...lista,
      {
        _id: `${Date.now()}`,
        acao,
        valorAnterior: anterior || '-',
        valorNovo: novo || '-',
        createdAt: new Date().toISOString()
      }
    ]);
  };

  const atualizarTarefa = (dados) => {
    setTarefa((atual) => {
      const novaTarefa = {
        ...atual,
        ...dados
      };

      registrarHistorico(
        'Atualização',
        atual.status,
        novaTarefa.status
      );

      return novaTarefa;
    });
  };

  const adicionarObservacao = () => {
    if (!observacao.trim()) {
      alert('Digite uma observação.');
      return;
    }

    registrarHistorico(
      'Observação',
      '-',
      observacao.trim()
    );

    setObservacao('');
  };

  const registrarJustificativa = () => {
    if (!justificativa.trim()) {
      alert('Digite uma justificativa.');
      return;
    }

    registrarHistorico(
      'Justificativa',
      `${tarefa.percentual_atendimento}%`,
      justificativa.trim()
    );

    setJustificativa('');
  };

  return (
    <div className="content standalone">

      <button
        className="secondary"
        onClick={() => navigate('/tarefas')}
      >
        ← Voltar
      </button>

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

      <div className="detail-grid">

        <div className="info">
          <span>Responsável</span>
          <strong>{tarefa.responsavel_nome}</strong>
        </div>

        <div className="info">
          <span>Área</span>
          <strong>{tarefa.area_nome}</strong>
        </div>

        <div className="info">
          <span>Prazo</span>
          <strong>
            {new Date(tarefa.prazo).toLocaleString('pt-BR')}
          </strong>
        </div>

        <div className="info">
          <span>Prioridade</span>
          <strong>{tarefa.prioridade}</strong>
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
            {Number(tarefa.custo_estimado || 0).toLocaleString(
              'pt-BR',
              {
                minimumFractionDigits: 2
              }
            )}
          </strong>
        </div>

      </div>

      <div className="actions">

        <button
          className="primary"
          onClick={() =>
            atualizarTarefa({
              status: 'EM_ANDAMENTO',
              percentual_atendimento: Math.max(
                Number(tarefa.percentual_atendimento || 0),
                1
              ),
              atrasada: false
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
              percentual_atendimento: 100,
              atrasada: false
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

      <div className="panel">

        <h3>Histórico</h3>

        {historico.length === 0 ? (
          <p>Nenhum registro no histórico.</p>
        ) : (
          historico.map((item) => (
            <div
              className="history"
              key={item._id}
            >
              <b>{item.acao}</b>

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