import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState('geral'); // 'geral', 'aluno', 'admin'

  useEffect(() => {
    // Verificar se há usuário no localStorage ao carregar
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        const userData = JSON.parse(savedUser);
        setUserType(userData.isAdmin ? 'admin' : 'aluno');
      } catch (error) {
        console.error('Erro ao recuperar usuário:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (cpf, password) => {
    try {
      const response = await fetch('http://127.0.0.1:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf, password }),
      });

      const data = await response.json();

      if (data.valid) {
        const userData = {
          cpf,
          nome: data.nome,
          email: data.email,
          curso: data.curso,
          unidadeEnsino: data.unidadeEnsino,
          isAdmin: data.isAdmin,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setUserType(data.isAdmin ? 'admin' : 'aluno');
        return { success: true };
      } else {
        return { success: false, error: 'CPF ou senha inválidos' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro de conexão com o servidor' };
    }
  };

  const logout = () => {
    setUser(null);
    setUserType('geral');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    userType,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
