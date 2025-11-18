import { createContext, useContext, useState, type ReactNode } from 'react';
import { createAccount, login as loginUser} from '../utils/APIFunction.ts';

interface User {
  user_id: string | number; 
  username: string;          
  full_name: string;         
  email: string;
  role: 'customer' | 'admin';
  token: string;             
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (username: string, password: string) => {
    try {
      const userData = await loginUser({ username, password }); 
      console.log("Context Login User Data:", userData.user_id);
      if (userData) { 
        console.log(1);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); 
        return true;
      }
      return false;
    } catch (error) {
      console.error("Context Login Failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Xóa session
  };

  const register = async (userData: any) => {
    try {
      await createAccount(userData);
      return true;
    } catch (error) {
      console.error("Context Registration Failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user 
    }}>
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
