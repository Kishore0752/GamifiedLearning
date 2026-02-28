import React from 'react';

const DoubtFeed = ({ posts }) => (
    <div className="space-y-4">
        {posts && posts.length > 0 ? (
            posts.map((post) => (
                <div
                    key={post._id || Math.random()}
                    className="glass-card p-6 animate-fade-in group hover:shadow-2xl transition-all duration-300 border-l-4 border-l-indigo-500"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold">
                                {post.author?.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                                    {post.author?.name || 'Anonymous'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 rounded-full text-xs font-semibold border border-indigo-400/30">
                            {post.category}
                        </span>
                    </div>

                    <h2 className="text-lg font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                        {post.title}
                    </h2>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        {post.content}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-slate-800/50 text-slate-300 text-xs rounded-full hover:bg-indigo-500/30 hover:text-indigo-300 transition-all cursor-pointer border border-slate-700/50"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-6 pt-4 border-t border-slate-700/50 text-sm text-slate-400">
                        <button className="flex items-center gap-2 hover:text-indigo-400 transition-colors group/btn">
                            <span className="group-hover/btn:scale-110 transition-transform">👍</span>
                            <span>{post.likes || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-purple-400 transition-colors group/btn">
                            <span className="group-hover/btn:scale-110 transition-transform">💬</span>
                            <span>{post.comments?.length || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-pink-400 transition-colors group/btn ml-auto">
                            <span className="group-hover/btn:scale-110 transition-transform">🔖</span>
                        </button>
                    </div>
                </div>
            ))
        ) : (
            <div className="glass-card p-12 text-center animate-fade-in">
                <p className="text-4xl mb-4">📝</p>
                <p className="text-slate-400">No posts to display yet...</p>
            </div>
        )}
    </div>
);

export default DoubtFeed;