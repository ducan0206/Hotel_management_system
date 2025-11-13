import { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'customer' | 'admin') => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: 'customer' | 'admin' = 'customer') => {
    // Mock login - in a real app, this would call an API
    // For demo: admin@hotel.com / admin123 for admin
    // Any other email/password for customer
    
    if (role === 'admin' && email === 'admin@hotel.com' && password === 'admin123') {
      setUser({
        id: '1',
        name: 'Admin User',
        email: email,
        role: 'admin'
      });
      return true;
    } else if (role === 'customer' && email && password) {
      setUser({
        id: '2',
        name: email.split('@')[0],
        email: email,
        role: 'customer'
      });
      return true;
    }
    
    return false;
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock registration - in a real app, this would call an API
    if (name && email && password) {
      setUser({
        id: Date.now().toString(),
        name: name,
        email: email,
        role: 'customer'
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
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
