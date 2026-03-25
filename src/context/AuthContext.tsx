import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { users as mockUsers } from '@/data/mock';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (data: { name: string; email: string; password: string; phone: string; role: UserRole }) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('marketmate_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('marketmate_user'); }
    }
  }, []);

  const login = (email: string, password: string) => {
    const found = mockUsers.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'Invalid email or password' };
    setUser(found);
    localStorage.setItem('marketmate_user', JSON.stringify(found));
    return { success: true };
  };

  const register = (data: { name: string; email: string; password: string; phone: string; role: UserRole }) => {
    const exists = mockUsers.find(u => u.email === data.email);
    if (exists) return { success: false, error: 'Email already registered' };
    const newUser: User = {
      id: `u${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString().split('T')[0],
    };
    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('marketmate_user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('marketmate_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
