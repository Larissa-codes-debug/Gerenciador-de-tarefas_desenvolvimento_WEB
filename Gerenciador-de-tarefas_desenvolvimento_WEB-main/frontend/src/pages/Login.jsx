
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/LOGO_GERENCIAMENTO.png';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      await login(email, senha);
      nav('/dashboard');
    } catch (x) {
      setErro(x.response?.data?.mensagem || 'Falha no login');
    }
  };

  return (
    <main className="login-container">
      <section className="login-banner">
        <img
          src={logo}
          alt="TASKFLOW — Sistema de Gerenciamento de Tarefas e Atividades"
          className="brand-logo"
        />
      </section>

      <section className="login-right-side">
        <form className="login-card" onSubmit={submit}>
          <h2>Seja Bem-vindo</h2>

          <div className="login-fields">
            <label htmlFor="email">E-mail:</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />

            <label htmlFor="senha">Senha:</label>
            <input
              id="senha"
              type="password"
              placeholder="••••••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {erro && (
            <div className="alert error" role="alert">
              {erro}
            </div>
          )}

          <button className="login-button" type="submit">
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
