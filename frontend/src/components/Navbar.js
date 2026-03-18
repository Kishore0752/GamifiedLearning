import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Settings from './Settings';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 glass-card neon-cyan mx-2 sm:m-3 rounded-xl border border-cyan-500/30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        {/* Logo - Mission Control */}
        <Link to="/dashboard" className="group flex items-center gap-2 flex-shrink-0">
          <div className="text-2xl sm:text-3xl font-black gradient-text group-hover:animate-float">🎮</div>
          <span className="text-lg sm:text-2xl font-black mission-text hidden sm:inline whitespace-nowrap">QUEST</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/dashboard"
            className="px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base text-cyan-300 hover:text-cyan-100 font-semibold transition-all duration-300 hover:bg-cyan-500/10 relative group"
          >
            Dashboard
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/community"
            className="px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base text-cyan-300 hover:text-cyan-100 font-semibold transition-all duration-300 hover:bg-cyan-500/10 relative group"
          >
            Community
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/daily-challenges"
            className="px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base text-cyan-300 hover:text-cyan-100 font-semibold transition-all duration-300 hover:bg-cyan-500/10 relative group"
          >
            🏆 Challenges
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/leaderboard"
            className="px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base text-cyan-300 hover:text-cyan-100 font-semibold transition-all duration-300 hover:bg-cyan-500/10 relative group"
          >
            Rankings
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/search"
            className="px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base text-cyan-300 hover:text-cyan-100 font-semibold transition-all duration-300 hover:bg-cyan-500/10 relative group"
          >
            Find Users
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* User Info */}
          <div className="ml-2 lg:ml-4 pl-2 lg:pl-4 border-l border-cyan-500/30 flex items-center gap-2 lg:gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 lg:w-8 h-7 lg:h-8 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center text-black font-bold text-xs lg:text-sm glow-cyan">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs lg:text-sm text-cyan-300 hidden lg:inline whitespace-nowrap">{userName}</span>
            </div>
          </div>

          {/* Settings Modal */}
          <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-cyan-500/20 neon-cyan rounded-lg transition-all duration-300 flex-shrink-0"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-cyan-500/30 px-3 sm:px-6 py-3 sm:py-4 space-y-2 animate-slide-in bg-slate-950/40">
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 rounded-lg text-sm text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/10 transition-all duration-300 font-semibold"
          >
            🏠 Dashboard
          </Link>
          <Link
            to="/community"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 rounded-lg text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/10 transition-all duration-300 font-semibold"
          >
            Community
          </Link>
          <Link
            to="/daily-challenges"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 rounded-lg text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/10 transition-all duration-300 font-semibold"
          >
            🏆 Daily Challenges
          </Link>
          <Link
            to="/leaderboard"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 rounded-lg text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/10 transition-all duration-300 font-semibold"
          >
            Rankings
          </Link>
          <Link
            to="/search"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 rounded-lg text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/10 transition-all duration-300 font-semibold"
          >
            Find Users
          </Link>
          <button
            onClick={() => {
              setIsOpen(false);
              setIsSettingsOpen(true);
            }}
            className="block px-4 py-2 rounded-lg text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/10 transition-all duration-300 font-semibold"
          >
            ⚙️ Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full mt-4 px-4 py-2 rounded-lg bg-red-600/20 border border-red-500/50 text-red-300 hover:bg-red-600/30 font-semibold transition-all duration-300"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;