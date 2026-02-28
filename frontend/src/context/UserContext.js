import React, { createContext, useState, useEffect } from 'react';
import { getUser, getUserStats } from '../services/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                // Get user ID from localStorage
                const userId = localStorage.getItem('userId');
                
                if (!userId) {
                    setLoading(false);
                    return;
                }
                
                // Fetch user profile from backend
                const userData = await getUser(userId);
                
                // Fetch user stats (dashboard data)
                const statsData = await getUserStats(userId);
                
                // Merge data
                const mergedUser = { ...userData, ...statsData };
                setUser(mergedUser);
            } catch (err) {
                setError(err.message);
                console.error('Failed to fetch user:', err);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const updateUser = (updatedUser) => {
        setUser(prevUser => ({
            ...prevUser,
            ...updatedUser
        }));
    };

    const addBadge = (badge) => {
        setUser(prevUser => ({
            ...prevUser,
            badges: [...(prevUser?.badges || []), badge]
        }));
    };

    return (
        <UserContext.Provider value={{ user, setUser: updateUser, updateUser, addBadge, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};

