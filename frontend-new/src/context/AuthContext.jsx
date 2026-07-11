import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');

    if (token && user_id && role && name) {
      setUser({ user_id, role, name });
    } else if (user_id || token) {
      // Inconsistent state, clear it
      localStorage.clear();
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user_id', userData.user_id);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('name', userData.name);
    setUser({
      user_id: userData.user_id,
      role: userData.role,
      name: userData.name
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
