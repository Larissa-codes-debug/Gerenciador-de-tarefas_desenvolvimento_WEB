import { useState } from 'react';
import { Link } from 'react-router-dom';

const usuariosIniciais = [
  {
    id: 1,
    nome: 'Ana Carolina',
    email: 'ana@taskflow.com',
    perfil: 'ADMIN',
    area_nome: 'Administrativo',
    setor_nome: 'Gestão',
    ativo: true
  },
  {
    id: 2,
    nome: 'Carlos Eduardo',
    email: 'carlos@taskflow.com',
    perfil: 'GESTOR',
    area_nome: 'Operações',
    setor_nome: 'Projetos',
    ativo: true
  },
  {
    id: 3,
    nome: 'Mariana Silva',
    email: 'mariana@taskflow.com',
    perfil: 'SUPERVISOR',
    area_nome: 'Recursos Humanos',
    setor_nome: 'Pessoas',
    ativo: false
  }
];

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState(usuariosIniciais);

  function alternarStatus(id) {
    setUsuarios(lista =>
      lista.map(usuario =>
        usuario.id === id
          ? { ...usuario, ativo: !usuario.ativo }
          : usuario
      )
    );
  }

  return (
    <div className="content standalone">
      <Link to="/dashboard">← Dashboard</Link>

      <h1>Usuários</h1>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Área</th>
              <th>Setor</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>{usuario.perfil}</td>
                <td>{usuario.area_nome || '-'}</td>
                <td>{usuario.setor_nome || '-'}</td>
                <td>{usuario.ativo ? 'Ativo' : 'Bloqueado'}</td>
                <td>
                  <button
                    className="secondary"
                    onClick={() => alternarStatus(usuario.id)}
                  >
                    {usuario.ativo ? 'Bloquear' : 'Ativar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
