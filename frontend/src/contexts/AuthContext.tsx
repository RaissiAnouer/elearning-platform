import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';
import { User } from '../types/user';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (userData: User) => void;
}

// Create context with undefined as initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the provider component as default
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateUser = (userData: User) => {
    try {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user information');
    }
  };

  const value = {
    user,
    login: async (email: string, password: string) => {
      try {
        const data = await authAPI.login(email, password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    signup: async (userData: any) => {
      try {
        const data = await authAPI.signup(userData);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return data;
      } catch (error) {
        console.error('Signup error:', error);
        throw error;
      }
    },
    logout: () => {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('Failed to logout properly');
      }
    },
    isLoading,
    updateUser
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          try {
            // Set user from stored data immediately
            setUser(JSON.parse(storedUser));
            
            // Verify token in background
            const response = await authAPI.verifyToken(token);
            if (!response.valid) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
              toast.error('Your session has expired. Please login again.');
            }
          } catch (error) {
            // On verification error, keep the session but log the error
            console.error('Token verification error:', error);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        toast.error('Failed to restore your session');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider; 