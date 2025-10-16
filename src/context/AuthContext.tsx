import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect, // 👈 añadido
} from 'react';
import api, { Tokens } from '../services/api';

type User = { username: string } | null;

type AuthCtx = {
  user: User;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  profile: () => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  // --- LOGIN ---
  const login = async (username: string, password: string) => {
    const { data } = await api.post('/api/auth/login/', { username, password });
    Tokens.access = data.access;
    Tokens.refresh = data.refresh;
    await profile();
  };

  // --- SIGNUP (placeholder) ---
  const signup = async (username: string, password: string) => {
    await api.post('/api/auth/signup/', { username, password });
  };

  // --- PERFIL ---
  const profile = async () => {
    const { data } = await api.get('/api/auth/profile/');
    setUser({ username: data.username });
  };

  // --- LOGOUT ---
  const logout = () => {
    Tokens.clear();
    setUser(null);
  };

  // --- HIDRATAR SESIÓN DESDE TOKENS AL MONTAR ---
  useEffect(() => {
    if (Tokens.access) {
      profile().catch(() => {
        Tokens.clear();
        setUser(null);
      });
    }
    // solo al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({ user, login, signup, profile, logout }), [user]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};
