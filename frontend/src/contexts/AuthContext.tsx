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

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create and export useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const login = async (email: string, password: string) => {
    try {
      const data = await authAPI.login(email, password);
      console.log('Login response:', data);
      
      const user = {
        ...data.user,
        role: data.user.role
      };
      
      console.log('Processed user:', user);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (userData: any) => {
    try {
      const data = await authAPI.signup(userData);
      const user = {
        ...data.user,
        role: data.user.role
      };
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout properly');
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log('Stored user:', parsedUser);
            setUser(parsedUser);
            
            const response = await authAPI.verifyToken(token);
            console.log('Token verification response:', response);
            
            if (!response.valid) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
              toast.error('Your session has expired. Please login again.');
            }
          } catch (error) {
            console.error('Auth initialization error:', error);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 