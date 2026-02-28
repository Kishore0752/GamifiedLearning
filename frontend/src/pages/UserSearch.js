import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { searchUsers } from '../services/api';

export default function UserSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Use the useFetch hook for cleaner data fetching
  const { data: allUsers = [], loading, error } = useFetch(searchUsers);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setHasSearched(true);
    if (!term.trim()) {
      setFilteredUsers([]);
    } else {
      const filtered = allUsers.filter(user =>
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        (user.department && user.department.toLowerCase().includes(term.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl font-black mb-4">
            <span className="gradient-text">👥 Find Users</span>
          </h1>
          <p className="text-slate-400">
            Search and connect with other community members
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-fade-in">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name or department..."
              className="input-enhanced w-full pl-12 py-4 text-lg"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
              🔍
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-slate-400">
          {hasSearched ? (
            <>
              Found <span className="font-bold text-indigo-400">{filteredUsers.length}</span> user{filteredUsers.length !== 1 ? 's' : ''}
            </>
          ) : (
            <span className="text-slate-500 italic"> Start to search for users...</span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg animate-pulse">Loading users...</p>
          </div>
        ) : !hasSearched ? (
          <div className="glass-card p-12 text-center animate-fade-in">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-slate-300 text-lg font-semibold">Start your search!</p>
            <p className="text-slate-400 mt-2">Search for users by name or department to view their profiles</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="glass-card p-8 text-center animate-fade-in">
            <p className="text-slate-400 text-lg">No users found</p>
            <p className="text-slate-500 mt-2">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className="glass-card p-6 cursor-pointer hover:shadow-lg hover:shadow-indigo-500/20 transition duration-200 animate-fade-in card-hover"
              >
                {/* User Avatar Placeholder */}
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 mx-auto text-white font-bold text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                {/* User Info */}
                <h3 className="text-xl font-bold text-slate-200 text-center mb-4">
                  {user.name}
                </h3>

                {/* User Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-b border-slate-700/50">
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">
                      {Math.floor(user.xp / 100)}
                    </div>
                    <div className="text-xs text-slate-400">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-400">
                      {user.xp}
                    </div>
                    <div className="text-xs text-slate-400">XP</div>
                  </div>
                </div>

                {/* Department & Year */}
                {user.department && (
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-indigo-600/20 border border-indigo-500/50 text-indigo-300 rounded-lg text-xs font-semibold">
                      {user.department}
                    </span>
                  </div>
                )}

                {user.year && (
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-purple-600/20 border border-purple-500/50 text-purple-300 rounded-lg text-xs font-semibold ml-2">
                      Year {user.year}
                    </span>
                  </div>
                )}

                {/* Skill Level */}
                {user.skillLevel && (
                  <div className="mb-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${
                      user.skillLevel === 'Placement-Ready'
                        ? 'bg-green-600/20 border border-green-500/50 text-green-300'
                        : user.skillLevel === 'Intermediate'
                        ? 'bg-yellow-600/20 border border-yellow-500/50 text-yellow-300'
                        : 'bg-blue-600/20 border border-blue-500/50 text-blue-300'
                    }`}>
                      {user.skillLevel}
                    </span>
                  </div>
                )}

                {/* Technical Interests */}
                {user.technicalInterests && user.technicalInterests.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <p className="text-xs text-slate-400 mb-2 font-semibold">Interests:</p>
                    <div className="flex flex-wrap gap-2">
                      {user.technicalInterests.slice(0, 2).map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-slate-800/50 border border-slate-600/50 text-slate-300 rounded text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                      {user.technicalInterests.length > 2 && (
                        <span className="px-2 py-1 text-slate-400 text-xs">
                          +{user.technicalInterests.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Badges */}
                {user.badges && user.badges.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <p className="text-xs text-slate-400 mb-2 font-semibold">Badges:</p>
                    <div className="flex gap-1">
                      {user.badges.map((badge, idx) => (
                        <span key={idx} className="text-lg badge-glow" title={badge.name}>
                          {badge.emoji}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* User Detail Modal */}
        {selectedUser && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedUser(null)}
          >
            <div
              className="glass-card p-8 max-w-md w-full animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedUser(null)}
                className="float-right text-2xl text-slate-400 hover:text-slate-200 transition"
              >
                ✕
              </button>

              {/* Avatar */}
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6 text-white font-bold text-4xl">
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>

              {/* Details */}
              <h2 className="text-3xl font-bold text-slate-200 text-center mb-6">
                {selectedUser.name}
              </h2>

              {/* Full Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-800/30 rounded-lg">
                <div className="text-center">
                  <div className="font-bold gradient-text text-2xl">
                    {Math.floor(selectedUser.xp / 100)}
                  </div>
                  <p className="text-xs text-slate-400">Level</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-indigo-400 text-2xl">
                    {selectedUser.xp}
                  </div>
                  <p className="text-xs text-slate-400">XP</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-400 text-2xl">
                    {selectedUser.badges?.length || 0}
                  </div>
                  <p className="text-xs text-slate-400">Badges</p>
                </div>
              </div>

              {/* Full Information */}
              {selectedUser.department && (
                <p className="text-slate-300 mb-2">
                  <span className="font-semibold">Department:</span> {selectedUser.department}
                </p>
              )}
              
              {selectedUser.year && (
                <p className="text-slate-300 mb-2">
                  <span className="font-semibold">Year:</span> {selectedUser.year}
                </p>
              )}

              {selectedUser.skillLevel && (
                <p className="text-slate-300 mb-4">
                  <span className="font-semibold">Level:</span> {selectedUser.skillLevel}
                </p>
              )}

              {selectedUser.technicalInterests && selectedUser.technicalInterests.length > 0 && (
                <div className="mb-4">
                  <p className="font-semibold text-slate-300 mb-2">Technical Interests:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.technicalInterests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-slate-800/50 border border-slate-600/50 text-slate-300 rounded-lg text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full btn-gradient py-2 rounded-lg mt-6 font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
