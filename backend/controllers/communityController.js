const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
  try {
    const { authorId, title, content, tags } = req.body;
    
    const newPost = new Post({ author: authorId, title, content, tags });
    await newPost.save();

    // Reward XP for community contribution (e.g., sharing a doubt)
    await User.findByIdAndUpdate(authorId, { $inc: { xp: 20 } });

    res.status(201).json({ msg: "Post shared! +20 XP earned.", post: newPost });
  } catch (err) {
    res.status(500).json({ error: "Failed to publish community post." });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    // Populate author details to facilitate collaborative learning and mentorship
    const posts = await Post.find()
      .populate('author', 'name email department year')
      .populate('comments.user', 'name email department')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching discussions." });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('author', 'name email department year')
      .populate('comments.user', 'name email department');
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Add comment to post
    post.comments.push({
      user: userId,
      text: text.trim(),
      isSenior: false, // Can be set based on user level
      createdAt: new Date()
    });

    await post.save();

    // Reward XP for helping others
    await User.findByIdAndUpdate(userId, { $inc: { xp: 10 } });

    // Populate the new comment's user info
    await post.populate('comments.user', 'name email department');

    res.status(201).json({
      msg: "Comment added! +10 XP earned.",
      post: post
    });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Increment upvotes
    post.upvotes = (post.upvotes || 0) + 1;
    await post.save();

    res.json({
      msg: "Post liked!",
      upvotes: post.upvotes
    });
  } catch (err) {
    console.error('Error liking post:', err);
    res.status(500).json({ error: "Failed to like post" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user is the post author
    if (post.author.toString() !== userId) {
      return res.status(403).json({ error: "You can only delete your own posts" });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    res.json({
      msg: "Post deleted successfully"
    });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: "Failed to delete post" });
  }
};