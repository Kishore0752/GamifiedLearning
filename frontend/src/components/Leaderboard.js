import React, { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../services/api';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await fetchLeaderboard();
        setLeaderboardData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="glass-card p-6 animate-pulse">
        <div className="h-8 bg-slate-700/50 rounded-lg mb-4 w-3/4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-slate-700/50 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="text-2xl">🏆</span>
        <span className="gradient-text">Top Contributors</span>
      </h2>

      <div className="space-y-3">
        {leaderboardData.slice(0, 5).map((user, index) => (
          <div
            key={user._id || index}
            className="group flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 hover-lift"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-shrink-0">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${
                  index === 0 ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                  index === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500' :
                  index === 2 ? 'bg-gradient-to-br from-amber-600 to-yellow-600' :
                  'bg-gradient-to-br from-indigo-500 to-purple-600'
                }`}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">{user.name}</p>
                <p className="text-xs text-slate-400">{user.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-bold text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">{user.xp}</p>
                <p className="text-xs text-slate-500">XP</p>
              </div>
              <div className="badge-glow py-1 px-3">
                <span className="text-sm">Lvl {user.level}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {leaderboardData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-400">No leaderboard data yet...</p>
        </div>
      )}
    </div>
  );
}
