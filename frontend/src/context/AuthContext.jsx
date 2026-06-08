import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

// Decode JWT payload without a library
function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function isTokenValid(token) {
  if (!token) return false;
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return false;
  // exp is in seconds, Date.now() is in ms
  return payload.exp * 1000 > Date.now();
}

export default function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('tm_token');
    const savedUser  = localStorage.getItem('tm_user');

    if (savedToken && savedUser && isTokenValid(savedToken)) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    } else {
      // Token missing or expired — clear everything
      localStorage.removeItem('tm_token');
      localStorage.removeItem('tm_user');
    }

    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('tm_token', authToken);
    localStorage.setItem('tm_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tm_token');
    localStorage.removeItem('tm_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
