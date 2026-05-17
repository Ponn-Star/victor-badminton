import { createContext, useContext } from 'react';
import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/clerk-react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const { user: clerkUser, isLoaded } = useUser();
    const { signOut } = useClerk();
    const { getToken } = useClerkAuth();

    // Map Clerk user sang format quen thuộc của app
    const user = clerkUser ? {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.username || clerkUser.firstName || 'User',
        email: clerkUser.primaryEmailAddress?.emailAddress,
        avatar: clerkUser.imageUrl,
        role: clerkUser.publicMetadata?.role || 'user',
    } : null;

    const isAdmin = user?.role === 'admin';

    const logout = async () => { await signOut(); };

    // Lấy token để gọi API backend (thay thế localStorage.getItem('victor_token'))
    const getAuthToken = async () => await getToken();

    return (
        <AuthContext.Provider value={{ user, loading: !isLoaded, isAdmin, logout, getToken: getAuthToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth phải được dùng bên trong AuthProvider');
    return ctx;
};

