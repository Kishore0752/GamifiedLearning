import React, { useState, useEffect } from 'react';
import { fetchLeaderboard, fetchLeaderboardByCategory } from '../services/api';

export default function LeaderboardPage() {
  const [category, setCategory] = useState('global');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // These should match your backend department options
  const categories = ['global', 'CSE', 'ECE', 'ME', 'CE'];

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        let data;
        if (category === 'global') {
          data = await fetchLeaderboard();
        } else {
          data = await fetchLeaderboardByCategory(category);
        }
        setLeaderboard(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🏆</div>
          <p className="text-slate-400 text-lg">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl font-black">
            <span className="gradient-text">🏆 Leaderboard</span>
          </h1>
          <p className="text-slate-400 mt-2">
            See who's leading the way
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex gap-2 flex-wrap animate-fade-in">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 rounded-lg font-semibold transition duration-200 capitalize ${
                category === cat
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                  : 'glass-card text-slate-300 hover:text-white hover:shadow-lg'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="glass-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-700/50">
                  <th className="text-left py-4 px-6 font-semibold text-slate-300">
                    Rank
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-300">
                    User
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-300">
                    Level
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-300">
                    XP
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-300">
                    Badges
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {leaderboard.length > 0 ? (
                  leaderboard.map((user, index) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-800/30 transition duration-150 border-slate-700/30"
                    >
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 font-bold text-slate-900">
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-200">
                          {user.name || user.username}
                        </div>
                        <div className="text-xs text-slate-400">
                          {user.email}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-3 py-1 bg-indigo-600/20 border border-indigo-500/50 text-indigo-300 rounded-lg font-semibold">
                          Level {user.level || Math.floor(user.xp / 100)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        <span className="font-semibold">{(user.xp || 0).toLocaleString()}</span>
                        <span className="text-slate-400 text-sm ml-1">XP</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-1">
                          {user.badges && user.badges.length > 0 ? (
                            user.badges.slice(0, 3).map((badge, i) => (
                              <span
                                key={i}
                                className="text-xl badge-glow"
                                title={badge.name}
                              >
                                {badge.emoji || '🏆'}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500 text-sm">
                              No badges
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 px-6 text-center">
                      <p className="text-slate-400 text-lg">
                        No users found in this category
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
