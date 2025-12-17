import { createContext, useContext, useState, type ReactNode } from 'react';
import { createAccount, login as loginUser, createReceptionAccount, deleteReceptionAccount, getAllReceptionists} from '../apis/APIFunction.ts';
import { useQuery } from '@tanstack/react-query';

interface User {
    user_id: string | number; 
    username: string;          
    full_name: string;         
    email: string;
    role: 'customer' | 'admin' | 'employee';
    token: string;             
}

interface AuthContextType {
    user: User | null;
    createReceptionAccount: (employeeData: any) => Promise<boolean>;
    deleteReceptionAccount: (employeeID: number) => Promise<boolean>;
    login: (username: string, password: string, role: string) => Promise<boolean>;
    register: (userData: any) => Promise<boolean>;
    logout: () => void;
    receptionAccounts: Array<{ id: number, username: string, password: string, fullName: string, phone: string, email: string, role: string, createdAt: string }>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const { data: receptionAccounts} = useQuery({
        queryKey: ['receptionists'],
        queryFn: getAllReceptionists,
        enabled: user?.role === 'admin', 
    });

    // const [receptionAccounts, setReceptionAccount] = useState([
    //     {
    //         id: 1,
    //         username: "recep1",
    //         password: "123",
    //         fullName: "Nguyen Van A",
    //         phone: "0123456789",
    //         email: "reception1@gmail.com",
    //         role: "employee", 
    //         createdAt: "",
    //     },
    //     {
    //         id: 2,
    //         username: "recep2",
    //         password: "123",
    //         fullName: "Nguyen Van B",
    //         phone: "0123456789",
    //         email: "reception2@gmail.com",
    //         role: "employee", 
    //         createdAt: ""
    //     }
    // ]);

    // warning
    const createReceptionAccount = async (employeeData: any) => {
        try {
            await createReceptionAccount(employeeData);
            return true;
        } catch (error) {
            console.log("Create Reception Account fail: ", error);
            throw error;
        }
    }

    // warning
    const deleteReceptionAccount = async (employeeID: number) => {
        try {
            await deleteReceptionAccount(employeeID);
            return true;
        } catch (error) {
            console.log("Delete Reception Account fail: ", error);
            throw error;
        }
    }

    // Trong file AuthContext.tsx, trong hàm login
    const login = async (username: string, password: string, role: string) => {
        try {
            const apiResponse = await loginUser({ username, password}, role); 
            const userDetails = apiResponse.user; 
            const token = apiResponse.token; // L?y token

            if (userDetails && userDetails.user_id) { 
                const dataToStore: User = { 
                    user_id: userDetails.user_id,
                    username: userDetails.username,
                    full_name: userDetails.full_name,
                    email: userDetails.email,
                    role: userDetails.role,
                    token: token 
                };
                    
                setUser(dataToStore);
                localStorage.setItem('user', JSON.stringify(dataToStore)); 
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
            await createAccount({ ...userData, role: 'customer' });
            return true;
        } catch (error) {
            console.error("Context Registration Failed:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            createReceptionAccount,
            deleteReceptionAccount,
            login, 
            register, 
            logout, 
            receptionAccounts,
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
