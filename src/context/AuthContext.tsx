import React, { createContext, useContext, useMemo, useState } from 'react';
import api, { Tokens } from '../services/api'; // 

type User = { username: string } | null;

type AuthCtx = {
  user: User;
  login: (email: string, password: string) => Promise<void>; // <- email
  signup: (username: string, password: string) => Promise<void>;
  profile: () => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  // --- LOGIN (email + password) ---
  const login = async (email: string, password: string) => {
    const { data } = await api.post('/api/auth/login/', { email, password });
    Tokens.access = data.access;
    Tokens.refresh = data.refresh;
    await profile();
  };

  // --- SIGNUP (el register sí requiere username + email y otros) ---
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

  const value = useMemo(() => ({ user, login, signup, profile, logout }), [user]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};
