import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Dashboard from './pages/Dashboard';
import Community from './pages/Community';
import LeaderboardPage from './pages/LeaderboardPage';
import DailyChallenges from './pages/DailyChallenges';
import Navbar from './components/Navbar';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/community" element={<Community />} />
            <Route path="/daily-challenges" element={<DailyChallenges />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
