import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const areasDemo = [
  { id: 1, nome: 'Administrativo' },
  { id: 2, nome: 'Operações' },
  { id: 3, nome: 'Recursos Humanos' }
];

const usuariosDemo = [
  { id: 1, nome: 'Ana Carolina' },
  { id: 2, nome: 'Carlos Eduardo' },
  { id: 3, nome: 'Mariana Silva' }
];

export default function TarefaForm() {
  const nav = useNavigate();

  const [f, setF] = useState({
    titulo: '',
    descricao: '',
    area_id: '',
    responsavel_id: '',
    prazo: '',
    custo_estimado: 0,
    prioridade: 'MEDIA'
  });

  const [erro, setErro] = useState('');

  const alterarCampo = (e) => {
    setF({
      ...f,
      [e.target.name]: e.target.value
    });
  };

  const salvar = (e) => {
    e.preventDefault();
    setErro('');

    if (!f.titulo || !f.area_id || !f.responsavel_id || !f.prazo) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    nav('/tarefas');
  };

  return (
    <div className="content standalone">
      <header className="topbar">
        <div>
          <Link to="/tarefas">← Tarefas</Link>
          <h1>Nova tarefa</h1>
        </div>
      </header>

      {erro && (
        <div className="alert error">
          {erro}
        </div>
      )}

      <form className="form-grid" onSubmit={salvar}>
        <label>
          Título
          <input
            name="titulo"
            value={f.titulo}
            onChange={alterarCampo}
            placeholder="Digite o título da tarefa"
            required
          />
        </label>

        <label>
          Área
          <select
            name="area_id"
            value={f.area_id}
            onChange={alterarCampo}
            required
          >
            <option value="">Selecione</option>

            {areasDemo.map((area) => (
              <option key={area.id} value={area.id}>
                {area.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="full">
          Descrição
          <textarea
            name="descricao"
            value={f.descricao}
            onChange={alterarCampo}
            placeholder="Descreva a tarefa..."
            required
          />
        </label>

        <label>
          Responsável
          <select
            name="responsavel_id"
            value={f.responsavel_id}
            onChange={alterarCampo}
            required
          >
            <option value="">Selecione</option>

            {usuariosDemo.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          Prazo
          <input
            type="datetime-local"
            name="prazo"
            value={f.prazo}
            onChange={alterarCampo}
            required
          />
        </label>

        <label>
          Prioridade
          <select
            name="prioridade"
            value={f.prioridade}
            onChange={alterarCampo}
          >
            <option value="BAIXA">BAIXA</option>
            <option value="MEDIA">MEDIA</option>
            <option value="ALTA">ALTA</option>
          </select>
        </label>

        <label>
          Custo
          <input
            type="number"
            min="0"
            step="0.01"
            name="custo_estimado"
            value={f.custo_estimado}
            onChange={alterarCampo}
          />
        </label>

        <button className="primary" type="submit">
          Criar
        </button>
      </form>
    </div>
  );
}