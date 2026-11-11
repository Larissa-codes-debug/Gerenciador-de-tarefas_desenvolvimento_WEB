import { Link } from 'react-router-dom';
import {
  LogOut,
  LayoutDashboard,
  ClipboardCheck,
  Users,
  BarChart3,
  Bell,
  FolderKanban,
  Clock3,
  ListTodo,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/LOGO_GERENCIAMENTO.png';

const dashboardDemo = {
  total: 385,
  pendentes: 78,
  andamento: 40,
  concluidas: 40,
  atrasadas: 20,
  percentual: 78,

  prioridades: [
    { nome: 'BAIXA', valor: 20 },
    { nome: 'MÉDIA', valor: 28 },
    { nome: 'ALTA', valor: 35 }
  ],

  areas: [
    { nome: 'Tecnologia', valor: 35 },
    { nome: 'Comercial', valor: 28 },
    { nome: 'Financeiro', valor: 20 },
    { nome: 'Rec. Humanos', valor: 12 },
    { nome: 'Marketing', valor: 8 }
  ],

  funcionarios: [
    { nome: 'Ana Silva', valor: 82 },
    { nome: 'Carlos Eduardo', valor: 72 },
    { nome: 'Luiz Gomes', valor: 68 },
    { nome: 'Fernanda Cruz', valor: 45 },
    { nome: 'Michael Pereira', valor: 78 }
  ]
};

export default function Dashboard() {
  const { usuario, logout } = useAuth();

  const d = dashboardDemo;

  return (
    <div className="dashboard-page">

      <header className="dashboard-header">
        <img
          src={logo}
          alt="TaskFlow"
          className="dashboard-logo"
        />

        <div className="dashboard-user">
          <div className="user-icon">●</div>

          <div>
            <strong>{usuario?.nome || 'NOME DO USUÁRIO'}</strong>
            <small>{usuario?.perfil || 'ADMIN'}</small>
          </div>

          <Bell size={16} />
        </div>
      </header>

      <div className="dashboard-layout">

        <aside className="dashboard-sidebar">

          <nav>

            <Link className="dashboard-menu active" to="/dashboard">
              <LayoutDashboard size={16} />
              Dashboard
            </Link>

            <Link className="dashboard-menu" to="/tarefas">
              <ClipboardCheck size={16} />
              Minhas Tarefas
            </Link>

            <Link className="dashboard-menu" to="/usuarios">
              <Users size={16} />
              Equipe
            </Link>

            <Link className="dashboard-menu" to="/dashboard">
              <BarChart3 size={16} />
              Relatórios
            </Link>

          </nav>

          <button
            className="dashboard-logout"
            onClick={logout}
          >
            <LogOut size={16} />
            Sair
          </button>

        </aside>

        <main className="dashboard-main">

          <div className="dashboard-title">
            <h1>Dashboard</h1>
            <p>Visão geral de atividades e desempenho da equipe</p>
          </div>

          <section className="dashboard-cards">

  <div className="dashboard-card">
    <FolderKanban className="card-icon total-icon" />
    <span>Total de Tarefas</span>
    <strong>{d.total}</strong>
  </div>

  <div className="dashboard-card">
    <Clock3 className="card-icon pending-icon" />
    <span>Tarefas pendentes</span>
    <strong>{d.pendentes}</strong>
  </div>

  <div className="dashboard-card">
    <ListTodo className="card-icon progress-icon" />
    <span>Tarefas em andamento</span>
    <strong>{d.andamento}</strong>
  </div>

  <div className="dashboard-card">
    <CheckCircle2 className="card-icon done-icon" />
    <span>Tarefas concluídas</span>
    <strong>{d.concluidas}</strong>
  </div>

  <div className="dashboard-card">
    <AlertCircle className="card-icon late-icon" />
    <span>Tarefas atrasadas</span>
    <strong>{d.atrasadas}</strong>
  </div>

</section>


          <section className="dashboard-charts">

            <div className="dashboard-panel attendance-panel">

              <h3>Percentual médio de atendimento</h3>

              <div
                className="donut"
                style={{
                  '--percentual': `${d.percentual * 3.6}deg`
                }}
              >
                <div>
                  <strong>{d.percentual}%</strong>
                </div>
              </div>

            </div>

            <div className="dashboard-panel">

              <h3>Tarefas por prioridade</h3>

              <div className="priority-chart">

                {d.prioridades.map((item) => (
                  <div className="priority-column" key={item.nome}>

                    <div
                      className={`priority-bar ${item.nome.toLowerCase()}`}
                      style={{ height: `${item.valor * 4}px` }}
                    />

                    <strong>{item.valor}</strong>

                    <small>{item.nome}</small>

                  </div>
                ))}

              </div>

            </div>

            <div className="dashboard-panel">

              <h3>Tarefas por Área/Setor</h3>

              <div className="horizontal-chart">

                {d.areas.map((item) => (
                  <div className="horizontal-row" key={item.nome}>

                    <span>{item.nome}</span>

                    <div className="horizontal-track">
                      <div
                        className="horizontal-fill"
                        style={{ width: `${item.valor * 2.4}%` }}
                      />
                    </div>

                    <strong>{item.valor}</strong>

                  </div>
                ))}

              </div>

            </div>

            <div className="dashboard-panel">

              <h3>Tarefas por funcionário</h3>

              <div className="horizontal-chart">

                {d.funcionarios.map((item) => (
                  <div className="horizontal-row" key={item.nome}>

                    <span>{item.nome}</span>

                    <div className="horizontal-track">
                      <div
                        className="horizontal-fill"
                        style={{ width: `${item.valor}%` }}
                      />
                    </div>

                    <strong>{item.valor}%</strong>

                  </div>
                ))}

              </div>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}