import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const tarefasDemo = [
  {
    id: 1,
    titulo: 'Organizar documentação do projeto',
    area_nome: 'Administrativo',
    responsavel_nome: 'Ana Carolina',
    status: 'PENDENTE',
    prioridade: 'ALTA',
    percentual_atendimento: 25,
    prazo: '2026-11-15',
    atrasada: false
  },
  {
    id: 2,
    titulo: 'Atualizar cadastro de usuários',
    area_nome: 'Recursos Humanos',
    responsavel_nome: 'Mariana Silva',
    status: 'EM_ANDAMENTO',
    prioridade: 'MEDIA',
    percentual_atendimento: 60,
    prazo: '2026-11-18',
    atrasada: false
  },
  {
    id: 3,
    titulo: 'Finalizar relatório mensal',
    area_nome: 'Operações',
    responsavel_nome: 'Carlos Eduardo',
    status: 'CONCLUIDA',
    prioridade: 'ALTA',
    percentual_atendimento: 100,
    prazo: '2026-11-05',
    atrasada: false
  },
  {
    id: 4,
    titulo: 'Revisar tarefas pendentes',
    area_nome: 'Administrativo',
    responsavel_nome: 'Ana Carolina',
    status: 'PENDENTE',
    prioridade: 'BAIXA',
    percentual_atendimento: 10,
    prazo: '2026-11-01',
    atrasada: true
  }
];

export default function Tarefas() {
  const { usuario } = useAuth();
  const [status, setStatus] = useState('');

  const tarefasFiltradas = status
    ? tarefasDemo.filter((tarefa) => tarefa.status === status)
    : tarefasDemo;

  return (
    <div className="content standalone">
      <header className="topbar">
        <div>
          <Link to="/dashboard">← Dashboard</Link>
          <h1>Tarefas</h1>
        </div>

        {usuario?.perfil !== 'USUARIO' && (
          <Link className="primary" to="/tarefas/nova">
            + Nova tarefa
          </Link>
        )}
      </header>

      <div className="filters">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="">Todos</option>
          <option value="PENDENTE">Pendente</option>
          <option value="EM_ANDAMENTO">Em andamento</option>
          <option value="CONCLUIDA">Concluída</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Responsável</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>%</th>
              <th>Prazo</th>
            </tr>
          </thead>

          <tbody>
            {tarefasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  Nenhuma tarefa encontrada.
                </td>
              </tr>
            ) : (
              tarefasFiltradas.map((tarefa) => (
                <tr key={tarefa.id}>
                  <td>
                    <Link to={`/tarefas/${tarefa.id}`}>
                      {tarefa.titulo}
                    </Link>
                    <small>{tarefa.area_nome}</small>
                  </td>

                  <td>{tarefa.responsavel_nome}</td>

                  <td>
                    <span className="status">
                      {tarefa.atrasada ? 'ATRASADA' : tarefa.status}
                    </span>
                  </td>

                  <td>{tarefa.prioridade}</td>

                  <td>{tarefa.percentual_atendimento}%</td>

                  <td>
                    {new Date(tarefa.prazo).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}