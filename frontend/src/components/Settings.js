import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');

  // Profile Picture
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  // Change Password
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Change Email
  const [newEmail, setNewEmail] = useState('');

  // Change Username
  const [newUsername, setNewUsername] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePicturePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfilePicture = async () => {
    if (!profilePicturePreview) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('https://gamifiedlearning-bu11.onrender.com/api/users/update-profile-picture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          profilePicture: profilePicturePreview
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Profile picture updated successfully!');
        setProfilePicturePreview(null);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(data.error || 'Failed to update profile picture');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.error('Update profile picture error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');

    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setError('All password fields are required');
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('https://gamifiedlearning-bu11.onrender.com/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Password changed successfully! Please login again.');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          localStorage.removeItem('userId');
          localStorage.removeItem('userName');
          localStorage.removeItem('userEmail');
          navigate('/login');
        }, 2000);
      } else {
        setError(data.msg || 'Failed to change password');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.error('Change password error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async () => {
    setError('');
    setSuccess('');

    if (!newEmail) {
      setError('Please enter a new email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('https://gamifiedlearning-bu11.onrender.com/api/users/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          newEmail
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Email changed successfully!');
        localStorage.setItem('userEmail', newEmail);
        setNewEmail('');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(data.msg || 'Failed to change email');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.error('Change email error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeUsername = async () => {
    setError('');
    setSuccess('');

    if (!newUsername) {
      setError('Please enter a new username');
      return;
    }

    if (newUsername.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('https://gamifiedlearning-bu11.onrender.com/api/users/change-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          newUsername
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Username changed successfully!');
        localStorage.setItem('userName', newUsername);
        setNewUsername('');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(data.msg || 'Failed to change username');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.error('Change username error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    onClose();
    navigate('/');
    window.location.reload();
  };

  if (!isOpen) return null;

  // Temporarily hiding Settings modal
  return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-40">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
      ></div>

      {/* Modal - Positioned on Right Side */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-950 border-l border-cyan-500/40 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        {/* Header - Fixed */}
        <div className="p-6 sm:p-8 flex items-center justify-between border-b border-cyan-500/20 flex-shrink-0">
          <button
            onClick={onClose}
            className="p-2 hover:bg-cyan-500/20 neon-cyan rounded-lg transition-all text-xl"
            title="Go Back"
          >
            ←
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold mission-text flex-1 text-center">COMMAND CENTER</h2>
          <div className="w-10"></div>
        </div>

        {/* Tabs - Fixed */}
        <div className="px-6 sm:px-8 pt-4 pb-2 border-b border-cyan-500/20 flex gap-1 overflow-x-auto scrollbar-hide flex-shrink-0">
          <button
            onClick={() => {
              setActiveTab('profile');
              setError('');
              setSuccess('');
            }}
            className={`px-3 py-2 font-semibold transition-all whitespace-nowrap text-xs sm:text-sm ${
              activeTab === 'profile'
                ? 'text-cyan-300 border-b-2 border-cyan-400 glow-cyan'
                : 'text-cyan-200/50 hover:text-cyan-200'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => {
              setActiveTab('username');
              setError('');
              setSuccess('');
            }}
            className={`px-3 py-2 font-semibold transition-all whitespace-nowrap text-xs sm:text-sm ${
              activeTab === 'username'
                ? 'text-cyan-300 border-b-2 border-cyan-400 glow-cyan'
                : 'text-cyan-200/50 hover:text-cyan-200'
            }`}
          >
            Username
          </button>
            <button
              onClick={() => {
                setActiveTab('password');
                setError('');
                setSuccess('');
              }}
              className={`px-3 py-2 font-semibold transition-all whitespace-nowrap text-xs sm:text-sm ${
                activeTab === 'password'
                  ? 'text-cyan-300 border-b-2 border-cyan-400 glow-cyan'
                  : 'text-cyan-200/50 hover:text-cyan-200'
              }`}
            >
              Password
            </button>
            <button
              onClick={() => {
                setActiveTab('email');
                setError('');
                setSuccess('');
              }}
              className={`px-3 py-2 font-semibold transition-all whitespace-nowrap text-xs sm:text-sm ${
                activeTab === 'email'
                  ? 'text-cyan-300 border-b-2 border-cyan-400 glow-cyan'
                  : 'text-cyan-200/50 hover:text-cyan-200'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => {
                setActiveTab('privacy');
                setError('');
                setSuccess('');
              }}
              className={`px-3 py-2 font-semibold transition-all whitespace-nowrap text-xs sm:text-sm ${
                activeTab === 'privacy'
                  ? 'text-cyan-300 border-b-2 border-cyan-400 glow-cyan'
                  : 'text-cyan-200/50 hover:text-cyan-200'
              }`}
            >
              Privacy
            </button>
            <button
              onClick={() => {
                setActiveTab('theme');
                setError('');
                setSuccess('');
              }}
              className={`px-3 py-2 font-semibold transition-all whitespace-nowrap text-xs sm:text-sm ${
                activeTab === 'theme'
                  ? 'text-cyan-300 border-b-2 border-cyan-400 glow-cyan'
                  : 'text-cyan-200/50 hover:text-cyan-200'
              }`}
            >
              Theme
            </button>
          </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 min-h-0">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">
                {success}
              </div>
            )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <p className="text-slate-300 font-semibold mb-2">Current Profile</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {userName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{userName}</p>
                    <p className="text-slate-400 text-sm">{userEmail}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Update Profile Picture
                </label>
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
              </div>

              {profilePicturePreview && (
                <div className="flex items-center gap-3">
                  <img
                    src={profilePicturePreview}
                    alt="Preview"
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400"
                  />
                  <span className="text-slate-400 text-sm">Preview</span>
                </div>
              )}

              <button
                onClick={handleUpdateProfilePicture}
                disabled={!profilePicturePreview || loading}
                className="w-full btn-gradient py-2 rounded-lg font-semibold disabled:opacity-50 transition-all"
              >
                {loading ? 'Updating...' : 'Save Profile Picture'}
              </button>
            </div>
          )}

          {/* Username Tab */}
          {activeTab === 'username' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Current Username
                </label>
                <input
                  type="text"
                  value={userName}
                  disabled
                  className="input-enhanced w-full opacity-50 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  New Username
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="input-enhanced w-full"
                  placeholder="Enter new username (3+ characters)"
                />
              </div>

              <button
                onClick={handleChangeUsername}
                disabled={loading}
                className="w-full btn-gradient py-2 rounded-lg font-semibold disabled:opacity-50 transition-all"
              >
                {loading ? 'Changing...' : 'Change Username'}
              </button>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="space-y-4 pb-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    className="input-enhanced w-full pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="input-enhanced w-full pr-10"
                    placeholder="Enter new password (6+ chars)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showNewPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="input-enhanced w-full"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="w-full btn-gradient py-2 rounded-lg font-semibold disabled:opacity-50 transition-all"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          )}

          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="space-y-4 pb-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Current Email
                </label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="input-enhanced w-full opacity-50 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  New Email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="input-enhanced w-full"
                  placeholder="Enter new email"
                />
              </div>

              <button
                onClick={handleChangeEmail}
                disabled={loading}
                className="w-full btn-gradient py-2 rounded-lg font-semibold disabled:opacity-50 transition-all"
              >
                {loading ? 'Changing...' : 'Change Email'}
              </button>
            </div>
          )}

          {/* Privacy Settings Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-semibold">Make Profile Private</span>
                <input
                  type="checkbox"
                  className="toggle-checkbox"
                  onChange={(e) => console.log('Profile Privacy:', e.target.checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-semibold">Enable Email Notifications</span>
                <input
                  type="checkbox"
                  className="toggle-checkbox"
                  onChange={(e) => console.log('Email Notifications:', e.target.checked)}
                />
              </div>
            </div>
          )}

          {/* Theme Customization Tab */}
          {activeTab === 'theme' && (
            <div className="space-y-4 pb-4">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Select Theme
              </label>
              <select
                className="input-enhanced w-full"
                onChange={(e) => console.log('Selected Theme:', e.target.value)}
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>
          )}
          </div>

          {/* Bottom Buttons */}
          <div className="px-6 sm:px-8 py-4 border-t border-cyan-500/20 flex flex-col gap-3 flex-shrink-0 bg-slate-950">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 rounded-lg bg-yellow-600/20 border border-yellow-500/50 text-yellow-300 hover:bg-yellow-600/30 font-semibold transition-all duration-300"
            >
              Logout
            </button>

            {/* Delete Account Button */}
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  console.log('Account Deleted');
                }
              }}
              className="w-full px-4 py-2 rounded-lg bg-red-600/20 border border-red-500/50 text-red-300 hover:bg-red-600/30 font-semibold transition-all duration-300"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
  );
};

export default Settings;
