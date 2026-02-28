import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    <nav className="sticky top-0 z-50 glass-card m-3 rounded-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/dashboard" className="group flex items-center gap-2">
          <div className="text-3xl font-black gradient-text group-hover:animate-float">🎮</div>
          <span className="text-2xl font-black gradient-text hidden sm:inline">CAMPUSQUEST</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-lg text-slate-300 hover:text-white font-semibold transition-all duration-300 hover:bg-indigo-500/20 relative group"
          >
            Dashboard
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/community"
            className="px-4 py-2 rounded-lg text-slate-300 hover:text-white font-semibold transition-all duration-300 hover:bg-indigo-500/20 relative group"
          >
            Community
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/daily-challenges"
            className="px-4 py-2 rounded-lg text-slate-300 hover:text-white font-semibold transition-all duration-300 hover:bg-indigo-500/20 relative group"
          >
            🏆 Daily Challenges
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/leaderboard"
            className="px-4 py-2 rounded-lg text-slate-300 hover:text-white font-semibold transition-all duration-300 hover:bg-indigo-500/20 relative group"
          >
            Rankings
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            to="/search"
            className="px-4 py-2 rounded-lg text-slate-300 hover:text-white font-semibold transition-all duration-300 hover:bg-indigo-500/20 relative group"
          >
            Find Users
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* User Info & Logout */}
          <div className="ml-4 pl-4 border-l border-slate-700/50 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-slate-300 hidden sm:inline">{userName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600/20 border border-red-500/50 text-red-300 hover:bg-red-600/30 font-semibold transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-indigo-500/20 rounded-lg transition-all duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-700/50 px-6 py-4 space-y-2 animate-slide-in">
          <Link
            to="/dashboard"
            className="block px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-indigo-500/20 transition-all duration-300 font-semibold"
          >
            Dashboard
          </Link>
          <Link
            to="/community"
            className="block px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-indigo-500/20 transition-all duration-300 font-semibold"
          >
            Community
          </Link>
          <Link
            to="/daily-challenges"
            className="block px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-indigo-500/20 transition-all duration-300 font-semibold"
          >
            🏆 Daily Challenges
          </Link>
          <Link
            to="/leaderboard"
            className="block px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-indigo-500/20 transition-all duration-300 font-semibold"
          >
            Rankings
          </Link>
          <Link
            to="/search"
            className="block px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-indigo-500/20 transition-all duration-300 font-semibold"
          >
            Find Users
          </Link>
          <button
            onClick={handleLogout}
            className="w-full mt-4 px-4 py-2 rounded-lg bg-red-600/20 border border-red-500/50 text-red-300 hover:bg-red-600/30 font-semibold transition-all duration-300"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;