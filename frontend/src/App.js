import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UserProvider } from './context/UserContext';
import Dashboard from './pages/Dashboard';
import Community from './pages/Community';
import LeaderboardPage from './pages/LeaderboardPage';
import DailyChallenges from './pages/DailyChallenges';
import Login from './pages/Login';
import Register from './pages/Register';
import UserSearch from './pages/UserSearch';
import Navbar from './components/Navbar';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in (has userId in localStorage)
        const userId = localStorage.getItem('userId');
        setIsLoggedIn(!!userId);
        setLoading(false);
    }, []);

    // Listen for storage changes (in case login happens in another tab)
    useEffect(() => {
        const handleStorageChange = () => {
            const userId = localStorage.getItem('userId');
            setIsLoggedIn(!!userId);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl mb-4 animate-bounce">🚀</div>
                    <p className="text-slate-400 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <UserProvider>
            <Router>
                <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200">
                    {isLoggedIn && <Navbar />}
                    <Routes>
                        {!isLoggedIn ? (
                            <>
                                <Route path="/" element={<Login />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="*" element={<Navigate to="/" />} />
                            </>
                        ) : (
                            <>
                                <Route path="/" element={<Navigate to="/dashboard" />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/community" element={<Community />} />
                                <Route path="/daily-challenges" element={<DailyChallenges />} />
                                <Route path="/leaderboard" element={<LeaderboardPage />} />
                                <Route path="/search" element={<UserSearch />} />
                                <Route path="*" element={<Navigate to="/dashboard" />} />
                            </>
                        )}
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;