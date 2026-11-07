import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

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
      if (!localStorage.getItem('accessToken')) {
        if (ativo) setCarregando(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        if (ativo) setUsuario(data);
      } catch {
        encerrarSessaoLocal();
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarUsuario();
    return () => {
      ativo = false;
      window.removeEventListener('auth:expired', tratarExpiracao);
    };
  }, [encerrarSessaoLocal]);

  const login = useCallback(async (email, senha) => {
    const { data } = await api.post('/auth/login', { email, senha });
    if (!data.token || !data.refreshToken) {
      throw new Error('O servidor não retornou os tokens de autenticação.');
    }
    localStorage.setItem('accessToken', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUsuario(data.usuario);
    return data.usuario;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      if (refreshToken) await api.post('/auth/logout', { refreshToken });
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
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}
