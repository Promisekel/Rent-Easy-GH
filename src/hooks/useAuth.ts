import { useEffect, useState } from 'react';
import { User } from '../types/User';

interface AuthError {
    code: string;
    message: string;
}

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<AuthError | null>(null);

    useEffect(() => {
        // Mock authentication state
        const mockUser: User = {
            id: 'mock-user-id',
            name: 'Demo User',
            email: 'demo@renteasygh.com',
            role: 'renter',
            verified: true,
            favorites: [],
            createdAt: new Date().toISOString()
        };

        // Simulate loading delay
        setTimeout(() => {
            setUser(mockUser);
            setLoading(false);
        }, 1000);
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            // Mock login - in real app, this would call Firebase auth
            const mockUser: User = {
                id: 'mock-user-id',
                name: 'Demo User',
                email: email,
                role: 'renter',
                verified: true,
                favorites: [],
                createdAt: new Date().toISOString()
            };
            
            setTimeout(() => {
                setUser(mockUser);
                setError(null);
                setLoading(false);
            }, 1000);
        } catch (error: any) {
            setError(error as AuthError);
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        setLoading(true);
        try {
            // Mock registration - in real app, this would call Firebase auth
            const mockUser: User = {
                id: 'new-user-id',
                name: name,
                email: email,
                role: 'renter',
                verified: false,
                favorites: [],
                createdAt: new Date().toISOString()
            };
            
            setTimeout(() => {
                setUser(mockUser);
                setError(null);
                setLoading(false);
            }, 1000);
        } catch (error: any) {
            setError(error as AuthError);
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            // Mock logout
            setTimeout(() => {
                setUser(null);
                setError(null);
                setLoading(false);
            }, 500);
        } catch (error: any) {
            setError(error as AuthError);
            setLoading(false);
        }
    };

    return { user, loading, error, login, register, logout };
};

export default useAuth;