import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize credentials from localStorage or default
    const [credentials, setCredentials] = useState(() => {
        const saved = localStorage.getItem('yakawa_admin_creds');
        return saved ? JSON.parse(saved) : { username: 'admin', password: 'password123' };
    });

    const [user, setUser] = useState(null); // null = not logged in, object = logged in

    // Check for existing session
    useEffect(() => {
        const session = localStorage.getItem('yakawa_admin_session');
        if (session) {
            setUser(JSON.parse(session));
        }
    }, []);

    // Persist credentials when changed
    useEffect(() => {
        localStorage.setItem('yakawa_admin_creds', JSON.stringify(credentials));
    }, [credentials]);

    const login = (username, password) => {
        if (username === credentials.username && password === credentials.password) {
            const userData = { username, role: 'admin' };
            localStorage.setItem('yakawa_admin_session', JSON.stringify(userData));
            setUser(userData);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('yakawa_admin_session');
        setUser(null);
    };

    const updateCredentials = (newUsername, newPassword) => {
        setCredentials({ username: newUsername, password: newPassword });
        // Optionally logout user to force re-login, or update session
        // Let's keep them logged in but update the session user name if needed
        if (user) {
            const updatedUser = { ...user, username: newUsername };
            localStorage.setItem('yakawa_admin_session', JSON.stringify(updatedUser));
            setUser(updatedUser);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateCredentials, credentials }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
