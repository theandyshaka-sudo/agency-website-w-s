import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin]   = useState(false);
  const [token,   setToken]     = useState(null);
  const [loading, setLoading]   = useState(true);

  // On mount, verify any stored token
  useEffect(() => {
    const saved = localStorage.getItem('adminToken');
    if (!saved) {
      setLoading(false);
      return;
    }
    fetch('/api/auth/verify', {
      headers: { Authorization: `Bearer ${saved}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          setToken(saved);
          setIsAdmin(true);
        } else {
          localStorage.removeItem('adminToken');
        }
      })
      .catch(() => localStorage.removeItem('adminToken'))
      .finally(() => setLoading(false));
  }, []);

  const login = (newToken) => {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
    setIsAdmin(true);
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (_) {
        // ignore network errors on logout
      }
    }
    localStorage.removeItem('adminToken');
    setToken(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
