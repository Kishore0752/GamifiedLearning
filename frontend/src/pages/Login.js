import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('https://gamifiedlearning-bu11.onrender.com/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('userId', data._id);
                localStorage.setItem('userName', data.name);
                localStorage.setItem('userEmail', data.email);

                // Trigger storage event for App.js to detect login
                window.dispatchEvent(new Event('storage'));
                
                // Navigate using React Router
                navigate('/dashboard');
            } else {
                setError(data.msg || "Invalid email or password.");
            }
        } catch (err) {
            console.error("Login error", err);
            setError("Server error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-transparent flex items-center justify-center py-6 sm:py-12 px-4">
            <div className="w-full max-w-md">

                {/* ✅ CAMPUSQUEST BRAND LOGO (Navbar Style) */}
                <div className="flex justify-center mb-6 sm:mb-10">
                    <div className="group flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                        <div className="text-3xl sm:text-5xl gradient-text group-hover:animate-float">
                            🎮
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-black gradient-text tracking-tight text-center sm:text-left">
                            CAMPUSQUEST
                        </h1>
                    </div>
                </div>

                {/* Login Card */}
                <div className="glass-card p-6 sm:p-8 md:p-10 shadow-2xl rounded-2xl">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-slate-100">
                        Login to Your Account
                    </h2>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-red-200 text-xs sm:text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6 sm:space-y-8">
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2 sm:mb-3 uppercase">
                                Email
                            </label>

                            <input
                                type="email"
                                required
                                className="input-enhanced w-full"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2 sm:mb-3 uppercase">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="input-enhanced w-full pr-10"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-gradient font-bold py-3 sm:py-4 rounded-xl transition-all disabled:opacity-50 text-sm sm:text-base"
                        >
                            {loading ? "⏳ Authenticating..." : "🚀 Resume Quest"}
                        </button>
                    </form>

                    <div className="mt-6 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-800 text-center text-xs sm:text-sm">
                        <p className="text-slate-400 mb-2">Don't have an account?</p>
                        <Link
                            to="/register"
                            className="text-indigo-400 hover:text-indigo-300 hover:underline font-semibold"
                        >
                            Create New Profile
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;