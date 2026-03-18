import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    year: 1,
    technicalInterests: '',
    skillLevel: 'Beginner',
    profilePicture: null
  });

  const departments = ['CSE', 'ECE', 'ME', 'CE', 'EEE', 'Other'];
  const years = [1, 2, 3, 4];
  const skillLevels = ['Beginner', 'Intermediate', 'Placement-Ready'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setFormData(prev => ({
          ...prev,
          profilePicture: base64String
        }));
        setProfilePicturePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        ...formData,
        technicalInterests: formData.technicalInterests
          .split(',')
          .map(skill => skill.trim())
          .filter(skill => skill.length > 0)
      };

      const response = await registerUser(userData);
      
      if (response._id) {
        // Store user ID in localStorage
        localStorage.setItem('userId', response._id);
        localStorage.setItem('userName', response.name);
        localStorage.setItem('userEmail', response.email);
        
        // Trigger storage event for App.js to detect login
        window.dispatchEvent(new Event('storage'));
        
        // Navigate using React Router
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 flex flex-col">
      {/* Header with Logo - Same as Navbar */}
      <div className="sticky top-0 z-50 glass-card m-3 rounded-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <div className="text-3xl font-black gradient-text group-hover:animate-float">🎮</div>
            <span className="text-2xl font-black gradient-text hidden sm:inline">CAMPUSQUEST</span>
          </Link>

          {/* Quick Links */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/"
              className="px-4 py-2 rounded-lg text-slate-300 hover:text-white font-semibold transition-all duration-300 hover:bg-indigo-500/20 relative group"
            >
              Back to Login
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-black mb-4">
              <span className="gradient-text">Begin Your 🚀 Quest</span>
            </h1>
            <p className="text-slate-400 text-lg">
              Register and start your learning journey with us
            </p>
          </div>

          {/* Form Card */}
          <div className="glass-card p-8 md:p-12 animate-fade-in">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Upload (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Profile Picture <span className="text-slate-500 text-xs">(Optional - Add Later)</span>
              </label>
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-slate-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-600 file:text-white
                      hover:file:bg-indigo-700
                      cursor-pointer"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Optional: Upload a profile picture (JPG, PNG, etc.) or add it later
                  </p>
                </div>
                {profilePicturePreview && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500 flex-shrink-0">
                    <img src={profilePicturePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder=""
                required
                className="input-enhanced w-full"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Institutional Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=""
                required
                className="input-enhanced w-full"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                  className="input-enhanced w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                  className="input-enhanced w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., Computer Science, Electrical Engineering, Mechanical Engineering"
                required
                className="input-enhanced w-full"
              />
              <p className="text-xs text-slate-400 mt-2">
                Enter your department name (e.g., CSE, ECE, ME, etc.)
              </p>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Year of Study
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="input-enhanced w-full"
              >
                {years.map(y => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
            </div>

            {/* Skill Level */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Skill Level
              </label>
              <select
                name="skillLevel"
                value={formData.skillLevel}
                onChange={handleChange}
                className="input-enhanced w-full"
              >
                {skillLevels.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            {/* Technical Interests */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Technical Interests (comma separated)
              </label>
              <input
                type="text"
                name="technicalInterests"
                value={formData.technicalInterests}
                onChange={handleChange}
                placeholder="e.g., Web Development, Machine Learning, Data Science"
                className="input-enhanced w-full"
              />
              <p className="text-xs text-slate-400 mt-2">
                Enter skills separated by commas
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Registering...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                   Create Account
                </span>
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-indigo-600/10 border border-indigo-500/30 rounded-lg">
            <p className="text-sm text-slate-300">
              💡 <strong>Tip:</strong> Use your institutional email to get verified as a student.
            </p>
          </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-slate-400 text-sm animate-fade-in">
            <p>
              By registering, you agree to our community guidelines and policies
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
