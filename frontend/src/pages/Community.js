import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import DoubtFeed from '../components/DoubtFeed';
import { fetchCommunityPosts, createPost } from '../services/api';

export default function Community() {
  const [showNewPost, setShowNewPost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    tags: ''
  });

  // Load posts on mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await fetchCommunityPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    setSubmitting(true);
    try {
      const newPost = await createPost({
        authorId: localStorage.getItem('userId'),
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      });
      
      // Add the new post to the top of the feed
      setPosts([newPost.post || newPost, ...posts]);
      setFormData({ title: '', content: '', category: 'General', tags: '' });
      setShowNewPost(false);
      alert('Post created successfully! +20 XP earned.');
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Make sure backend is running!');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    // If post is deleted, remove it from the list
    if (updatedPost.deleted) {
      setPosts(posts.filter(p => p._id !== updatedPost._id));
    } else {
      // Update the post in the posts array
      setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-5xl font-black mb-2">
            <span className="gradient-text">💬 Community</span>
          </h1>
          <p className="text-slate-400">Share your doubts, help others, earn XP, and grow together</p>
        </div>

        {/* Create Post Button */}
        <button
          onClick={() => setShowNewPost(!showNewPost)}
          className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl btn-smooth neon-glow flex items-center justify-center gap-2 text-lg transition-all duration-300"
        >
          <span className="text-2xl">{showNewPost ? '✕' : '✏️'}</span>
          {showNewPost ? 'Cancel' : 'Create New Post'}
        </button>

        {/* New Post Form */}
        {showNewPost && (
          <form
            onSubmit={handleSubmit}
            className="glass-card p-8 animate-slide-in space-y-5"
          >
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="What's your question? Be specific..."
                className="input-enhanced"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-enhanced appearance-none cursor-pointer"
              >
                <option>General</option>
                <option>React</option>
                <option>JavaScript</option>
                <option>Python</option>
                <option>Database</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Describe your doubt in detail... Include what you've tried..."
                rows="6"
                className="input-enhanced resize-none"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., react, hooks, useState"
                className="input-enhanced"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-gradient disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{submitting ? '⏳' : '📤'}</span>
              {submitting ? 'Posting...' : 'Post Question'}
            </button>
          </form>
        )}

        {/* Posts Feed */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse">
              <p className="text-slate-400">Loading discussions...</p>
            </div>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-6">
              {posts.map((post) => (
                <PostCard 
                  key={post._id} 
                  post={post}
                  onPostUpdate={handlePostUpdate}
                />
              ))}
            </div>

            {/* Doubt Feed Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-24">
                <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                  <span>❓</span> Recent Questions
                </h3>
                <DoubtFeed posts={posts.slice(0, 5)} />
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card p-12 text-center animate-fade-in">
            <p className="text-4xl mb-4">💬</p>
            <p className="text-slate-300 text-lg">No posts yet. Be the first to start a discussion!</p>
          </div>
        )}
      </div>
    </div>
  );
}
