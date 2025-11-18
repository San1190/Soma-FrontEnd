import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, registerUser } from '../services/auth';
import { getItem, setItem, deleteItem } from '../services/session';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Failed to load user from storage', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
        const response = await loginService(email, password);
        const userData = {
          id: response.user_id,
          email: response.email || email,
          first_name: response.first_name,
          last_name: response.last_name,
        };
      setUser(userData);
      await setItem('user', JSON.stringify(userData));
      return true;
    } catch (e) {
      console.error('Login failed', e);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await deleteItem('user');
      setUser(null);
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const response = await registerUser(name, email, password);
      // Dependiendo de tu API, podrías querer loguear al usuario automáticamente después del registro
      // o simplemente retornar éxito.
      setIsLoading(false);
      return true;
    } catch (e) {
      console.error('Registration failed', e);
      setIsLoading(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
