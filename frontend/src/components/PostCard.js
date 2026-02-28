import React, { useState } from 'react';
import { addCommentToPost, likePost, deletePost } from '../services/api';

export default function PostCard({ post, onPostUpdate }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [liking, setLiking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [upvotes, setUpvotes] = useState(post.upvotes || 0);

  const currentUserId = localStorage.getItem('userId');
  const currentUserName = localStorage.getItem('userName');

  const handleLike = async () => {
    setLiking(true);
    try {
      const result = await likePost(post._id, currentUserId);
      setUpvotes(result.upvotes);
    } catch (error) {
      console.error('Failed to like post:', error);
      alert('Failed to like post');
    } finally {
      setLiking(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post.author || post.author._id !== currentUserId) {
      alert('You can only delete your own posts!');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await deletePost(post._id, currentUserId);
      alert('Post deleted successfully!');
      
      // Trigger parent refresh
      if (onPostUpdate) {
        onPostUpdate({ _id: post._id, deleted: true });
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post. Make sure backend is running!');
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      alert('Please write a reply');
      return;
    }

    setSubmittingReply(true);
    try {
      const result = await addCommentToPost(post._id, currentUserId, replyText);
      
      // Update the post with new comments
      if (onPostUpdate) {
        onPostUpdate(result.post);
      }
      
      setReplyText('');
      setShowReplyForm(false);
      alert('Reply added! +10 XP earned.');
    } catch (error) {
      console.error('Failed to add reply:', error);
      alert('Failed to add reply. Make sure backend is running!');
    } finally {
      setSubmittingReply(false);
    }
  };

  // Helper function to format date
  const formatDate = (date) => {
    try {
      const postDate = new Date(date);
      const now = new Date();
      const diffMs = now - postDate;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return postDate.toLocaleDateString();
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className="glass-card p-6 animate-fade-in card-hover">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {post.author?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <h4 className="font-semibold text-slate-200">
                {post.author?.name || 'Anonymous'}
              </h4>
              <p className="text-xs text-slate-400">
                {post.author?.department || ''} {post.author?.year ? `• Year ${post.author.year}` : ''}
              </p>
            </div>
          </div>
        </div>
        <span className="text-xs text-slate-500">
          {formatDate(post.createdAt)}
        </span>
      </div>

      {/* Post Title & Content */}
      <h3 className="text-lg font-bold text-slate-100 mb-2">
        {post.title}
      </h3>
      <p className="text-slate-300 mb-4 leading-relaxed">
        {post.content}
      </p>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-indigo-600/20 border border-indigo-500/50 text-indigo-300 rounded-lg text-xs font-semibold"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-slate-700/50">
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={liking}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-red-400 transition duration-200 disabled:opacity-50"
        >
          <span className="text-lg">{liking ? '⏳' : '❤️'}</span>
          <span className="text-sm font-semibold">{upvotes}</span>
        </button>

        {/* Comments Button - Show count */}
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-blue-400 transition duration-200 cursor-default"
        >
          <span className="text-lg">💬</span>
          <span className="text-sm font-semibold">
            {post.comments?.length || 0}
          </span>
        </button>

        {/* Reply Button */}
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-green-400 transition duration-200"
        >
          <span className="text-lg">↩️</span>
          <span className="text-sm font-semibold">Reply</span>
        </button>

        {/* Save Button */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-yellow-400 transition duration-200">
          <span className="text-lg">🔖</span>
          <span className="text-sm font-semibold">Save</span>
        </button>

        {/* Delete Button (Only for post author) */}
        {post.author && post.author._id === currentUserId && (
          <button
            onClick={handleDeletePost}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 transition duration-200 disabled:opacity-50 ml-auto"
          >
            <span className="text-lg">{deleting ? '⏳' : '🗑️'}</span>
            <span className="text-sm font-semibold">Delete</span>
          </button>
        )}
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <form onSubmit={handleSubmitReply} className="mt-4 pt-4 border-t border-slate-700/50 animate-slide-in">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {currentUserName?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="flex-1">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply here..."
                className="input-enhanced w-full px-4 py-2 mb-2 resize-none"
                rows="3"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReply}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-50"
                >
                  {submittingReply ? 'Posting...' : 'Post Reply'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Comments Section - Always Visible */}
      {post.comments && post.comments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-3 animate-slide-in">
          <h5 className="text-sm font-semibold text-slate-300">
            {post.comments.length} {post.comments.length === 1 ? 'Reply' : 'Replies'}
          </h5>
          
          {post.comments.map((comment, idx) => (
            <div key={idx} className="flex gap-3 p-3 bg-slate-800/30 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {comment.user?.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-slate-200">
                    {comment.user?.name || 'Anonymous'}
                  </p>
                  {comment.isSenior && (
                    <span className="px-2 py-0.5 bg-green-600/20 border border-green-500/50 text-green-300 rounded text-xs font-bold">
                      Expert
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-slate-300 break-words">
                  {comment.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Comments Yet - Always Visible */}
      {(!post.comments || post.comments.length === 0) && (
        <div className="mt-4 pt-4 border-t border-slate-700/50 text-center py-4">
          <p className="text-slate-400 text-sm">No replies yet. Be the first to reply!</p>
        </div>
      )}
    </div>
  );
}
