import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/LOGO_GERENCIAMENTO.png';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className='login-container'>
      <div className='login-banner'>
        <img src={logoImg} alt='Logo TaskFlow' className='brand-logo'/>
      </div>

        <div className='login-right-side'>
          <div className='login-card'>
            <h2>Seja Bem-vindo</h2>
    
        
          <form onSubmit={handleLogin} className='login-form'>
            <div className='input-group'>
              <label>E-mail</label>
              <input
                type='email'
                placeholder='seu@email.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className='input-group'>
              <label>Senha:</label>
              <input
              type='password'
              placeholder='••••••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              />
            </div>

            <button type='submit' className='login-button'>Entrar</button>
          </form>
      </div>
    </div>
  </div>

  );
}
