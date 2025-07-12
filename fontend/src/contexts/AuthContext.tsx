import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'Sarah Johnson',
    points: 150,
    role: 'user',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinedDate: '2024-01-15'
  },
  {
    id: '2',
    email: 'admin@rewear.com',
    name: 'Admin User',
    points: 0,
    role: 'admin',
    joinedDate: '2024-01-01'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('rewear_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('rewear_user', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setLoading(false);
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    
    // Mock user creation
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      points: 50, // Welcome bonus
      role: 'user',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    
    setUser(newUser);
    localStorage.setItem('rewear_user', JSON.stringify(newUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rewear_user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}