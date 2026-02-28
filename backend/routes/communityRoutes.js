const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, addComment, likePost, getPostById, deletePost } = require('../controllers/communityController');

router.post('/', createPost);
router.get('/', getAllPosts);
router.get('/:postId', getPostById);
router.post('/:postId/comment', addComment);
router.post('/:postId/like', likePost);
router.delete('/:postId', deletePost);

module.exports = router;