import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '@/models/types';
import {UserRepository} from '@/database/repositories/UserRepository';
import {verifyPassword} from '@/utils/hash';
import {getDatabase} from '@/database/DatabaseService';
import {seedDatabase} from '@/database/seed';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isDbReady: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{success: boolean; error?: string}>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: string,
    phone?: string,
  ) => Promise<{success: boolean; error?: string}>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'BOOKMYBUS_SESSION';

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isDbReady: false,
  });

  // Initialize database + restore session
  useEffect(() => {
    const init = async () => {
      try {
        await getDatabase();
        await seedDatabase();
        setState(s => ({...s, isDbReady: true}));

        const storedUserId = await AsyncStorage.getItem(SESSION_KEY);
        if (storedUserId) {
          const user = await UserRepository.findById(storedUserId);
          if (user) {
            setState(s => ({...s, user, isLoading: false}));
            return;
          }
        }
      } catch (err) {
        console.error('Auth init error:', err);
      }
      setState(s => ({...s, isLoading: false}));
    };
    init();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const user = await UserRepository.findByEmail(email.trim().toLowerCase());
      if (!user) {
        return {success: false, error: 'No account found with this email'};
      }
      if (!verifyPassword(password, user.password_hash)) {
        return {success: false, error: 'Incorrect password'};
      }
      await AsyncStorage.setItem(SESSION_KEY, user.id);
      setState(s => ({...s, user}));
      return {success: true};
    } catch (err: any) {
      return {success: false, error: err.message || 'Login failed'};
    }
  }, []);

  const signup = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: string,
      phone?: string,
    ) => {
      try {
        const existing = await UserRepository.findByEmail(email.trim().toLowerCase());
        if (existing) {
          return {success: false, error: 'Email already registered'};
        }
        const user = await UserRepository.create(
          name.trim(),
          email.trim().toLowerCase(),
          password,
          role,
          phone?.trim(),
        );
        await AsyncStorage.setItem(SESSION_KEY, user.id);
        setState(s => ({...s, user}));
        return {success: true};
      } catch (err: any) {
        return {success: false, error: err.message || 'Signup failed'};
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setState(s => ({...s, user: null}));
  }, []);

  const refreshUser = useCallback(async () => {
    if (state.user) {
      const user = await UserRepository.findById(state.user.id);
      if (user) {
        setState(s => ({...s, user}));
      }
    }
  }, [state.user]);

  return (
    <AuthContext.Provider value={{...state, login, signup, logout, refreshUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
