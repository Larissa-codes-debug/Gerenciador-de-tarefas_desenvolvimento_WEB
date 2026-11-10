import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const usuarioDemo = {
  id: 1,
  nome: 'Ana Carolina',
  email: 'admin@taskflow.com',
  perfil: 'ADMIN'
};

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const encerrarSessaoLocal = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUsuario(null);
  }, []);

  useEffect(() => {
    let ativo = true;

    const tratarExpiracao = () => {
      if (ativo) setUsuario(null);
    };

    window.addEventListener('auth:expired', tratarExpiracao);

    async function carregarUsuario() {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        if (ativo) setCarregando(false);
        return;
      }

      if (token === 'demo-access-token') {
        if (ativo) {
          setUsuario(usuarioDemo);
          setCarregando(false);
        }
        return;
      }

      try {
        const { data } = await api.get('/auth/me');

        if (ativo) {
          setUsuario(data);
        }
      } catch {
        encerrarSessaoLocal();
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarUsuario();

    return () => {
      ativo = false;
      window.removeEventListener('auth:expired', tratarExpiracao);
    };
  }, [encerrarSessaoLocal]);

  const login = useCallback(async (email, senha) => {
    if (email === 'admin@taskflow.com' && senha === '123456') {
      localStorage.setItem('accessToken', 'demo-access-token');
      localStorage.setItem('refreshToken', 'demo-refresh-token');
      setUsuario(usuarioDemo);
      return usuarioDemo;
    }

    try {
      const { data } = await api.post('/auth/login', { email, senha });

      if (!data.token || !data.refreshToken) {
        throw new Error('O servidor não retornou os tokens de autenticação.');
      }

      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      setUsuario(data.usuario);

      return data.usuario;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken === 'demo-refresh-token') {
      encerrarSessaoLocal();
      return;
    }

    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } finally {
      encerrarSessaoLocal();
    }
  }, [encerrarSessaoLocal]);

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
