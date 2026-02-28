import React, { useState } from 'react';

const ProfileCard = ({ user }) => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [profilePicturePreview, setProfilePicturePreview] = useState(user?.profilePicture || null);
    const [uploading, setUploading] = useState(false);

    if (!user) return null;
    const nextLevelXP = Math.pow((user.level) / 0.1, 2);
    const progress = (user.xp / nextLevelXP) * 100;

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String = event.target.result;
                setProfilePicturePreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfilePicture = async () => {
        if (!profilePicturePreview) {
            alert('Please select an image');
            return;
        }

        setUploading(true);
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch('https://gamifiedlearning-bu11.onrender.com/api/users/update-profile-picture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, profilePicture: profilePicturePreview })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Profile picture updated successfully!');
                setShowUploadModal(false);
                // Reload page to see changes
                window.location.reload();
            } else {
                alert(data.error || 'Failed to update profile picture');
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            alert('Failed to upload profile picture. Make sure backend is running!');
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
        <div className="glass-card p-8 animate-fade-in group">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    {/* Profile Picture - Clickable */}
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-glow-indigo transition-all overflow-hidden hover:scale-105"
                        title="Click to update profile picture"
                    >
                        {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl">👤</span>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-lg">📷</span>
                        </div>
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                        <p className="text-slate-400">{user.department} • {user.skillLevel}</p>
                    </div>
                </div>
                <div className="badge-glow">
                    <span className="text-2xl">⭐</span>
                    <span>Lvl {user.level}</span>
                </div>
            </div>

            {/* XP Progress */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-300">Experience Progress</span>
                    <span className="text-xs font-bold text-indigo-400">{user.xp} / {Math.round(nextLevelXP)} XP</span>
                </div>
                <div className="h-4 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50 backdrop-blur">
                    <div
                        className="progress-gradient transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>
                <p className="text-xs text-slate-500">
                    {Math.round(100 - progress)}% until next level
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-700/50">
                <div className="stat-box">
                    <div className="text-3xl font-black text-transparent bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text">
                        {Math.round(progress)}%
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Progress</p>
                </div>
                <div className="stat-box">
                    <div className="text-3xl font-black text-transparent bg-gradient-to-br from-cyan-400 to-blue-400 bg-clip-text">
                        {user.level}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Level</p>
                </div>
                <div className="stat-box">
                    <div className="text-3xl font-black text-transparent bg-gradient-to-br from-amber-400 to-orange-400 bg-clip-text">
                        {user.badges?.length || 0}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Badges</p>
                </div>
            </div>
        </div>

        {/* Upload Profile Picture Modal */}
        {showUploadModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="glass-card p-8 max-w-md w-full animate-fade-in">
                    <h3 className="text-2xl font-bold text-white mb-6">Update Profile Picture</h3>
                    
                    {/* Image Preview */}
                    {profilePicturePreview && (
                        <div className="mb-6 flex justify-center">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-lg">
                                <img src={profilePicturePreview} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    )}

                    {/* File Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-300 mb-3">
                            Choose Image
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
                        <p className="text-xs text-slate-400 mt-2">
                            Supported formats: JPG, PNG, GIF, etc.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setShowUploadModal(false);
                                setProfilePicturePreview(user.profilePicture || null);
                            }}
                            className="flex-1 px-4 py-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-semibold transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveProfilePicture}
                            disabled={uploading || !profilePicturePreview}
                            className="flex-1 px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-50"
                        >
                            {uploading ? '⏳ Saving...' : '💾 Save'}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default ProfileCard;