import React, { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../services/api';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleUserClick = (user, index) => {
    setSelectedUser({ ...user, rank: index + 1 });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

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
            className="group flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 hover-lift"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-white text-lg ${
                  index === 0 ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                  index === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500' :
                  index === 2 ? 'bg-gradient-to-br from-amber-600 to-yellow-600' :
                  'bg-gradient-to-br from-indigo-500 to-purple-600'
                }`}>
                  {index === 0 ? '1' : index === 1 ? '2' : index === 2 ? '3' : index + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => handleUserClick(user, index)}
                  className="font-semibold text-white truncate group-hover:text-cyan-300 transition-colors text-left hover:underline cursor-pointer w-full block"
                >
                  {user.name}
                </button>
                <p className="text-xs text-slate-400 truncate">{user.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-right min-w-fit">
                <p className="font-bold text-indigo-400 whitespace-nowrap text-sm">{user.xp}</p>
                <p className="text-xs text-slate-500">XP</p>
              </div>
              <div className="badge-glow py-1 px-3 flex-shrink-0 whitespace-nowrap">
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

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}>
            <div className="glass-card neon-cyan rounded-xl p-8 shadow-2xl border border-cyan-500/40">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 hover:bg-cyan-500/20 rounded-lg transition-all"
              >
                ×
              </button>

              {/* User Avatar */}
              <div className="flex justify-center mb-6">
                <div className={`w-20 h-20 rounded-full font-bold text-white text-2xl flex items-center justify-center ${
                  selectedUser.rank === 1 ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                  selectedUser.rank === 2 ? 'bg-gradient-to-br from-slate-400 to-slate-500' :
                  selectedUser.rank === 3 ? 'bg-gradient-to-br from-amber-600 to-yellow-600' :
                  'bg-gradient-to-br from-indigo-500 to-purple-600'
                }`}>
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* User Info */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">{selectedUser.name}</h2>
                <p className="text-slate-300 mb-2">{selectedUser.department}</p>
                <div className="flex justify-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-sm">
                    Rank #{selectedUser.rank}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-300 text-sm">
                    Lvl {selectedUser.level}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <p className="text-slate-400 text-sm mb-1">Total XP</p>
                  <p className="text-xl font-bold text-cyan-300">{selectedUser.xp}</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <p className="text-slate-400 text-sm mb-1">Badges</p>
                  <p className="text-xl font-bold text-yellow-300">{selectedUser.badges?.length || 0}</p>
                </div>
              </div>

              {/* Badges Section */}
              {selectedUser.badges && selectedUser.badges.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">Badges Earned</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.badges.map((badge, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-lg hover:scale-110 transition-transform cursor-pointer"
                        title={badge.name}
                      >
                        {badge.icon || '⭐'}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={closeModal}
                className="w-full py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 font-semibold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
