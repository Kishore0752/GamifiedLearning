import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('userId', data._id);
                localStorage.setItem('userName', data.name);
                localStorage.setItem('userEmail', data.email);

                window.location.href = '/dashboard';
            } else {
                setError(data.msg || "User not found. Please register first.");
            }
        } catch (err) {
            console.error("Login error", err);
            setError("Server error. Make sure backend is running on port 5000.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">

                {/* ✅ CAMPUSQUEST BRAND LOGO (Navbar Style) */}
                <div className="flex justify-center mb-10">
                    <div className="group flex items-center gap-3">
                        <div className="text-5xl gradient-text group-hover:animate-float">
                            🎮
                        </div>

                        <h1 className="text-5xl font-black gradient-text tracking-tight">
                            CAMPUSQUEST
                        </h1>
                    </div>
                </div>

                {/* Login Card */}
                <div className="glass-card p-8 md:p-10 shadow-2xl">
                    <h2 className="text-2xl font-bold mb-6 text-center text-slate-100">
                        Login to Your Account
                    </h2>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-200 text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase">
                                Email
                            </label>

                            <input
                                type="email"
                                required
                                className="input-enhanced w-full"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-gradient font-bold py-4 rounded-xl transition-all disabled:opacity-50"
                        >
                            {loading ? " Authenticating..." : " Resume Quest"}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-800 text-center text-sm">
                        <Link
                            to="/register"
                            className="text-indigo-400 hover:underline"
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