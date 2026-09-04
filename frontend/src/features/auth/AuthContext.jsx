import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, loginAccount, registerAccount } from './auth.api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('support_token')) {
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then(setUser)
      .catch(() => localStorage.removeItem('support_token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(payload) {
    const session = await loginAccount(payload);
    localStorage.setItem('support_token', session.token);
    setUser(session.user);
  }

  async function register(payload) {
    const session = await registerAccount(payload);
    localStorage.setItem('support_token', session.token);
    setUser(session.user);
  }

  function logout() {
    localStorage.removeItem('support_token');
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
