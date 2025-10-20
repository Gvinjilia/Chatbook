const express = require('express');
const { deletePost, updatePost, createPost, getPostById, getPosts, getUserPosts } = require('../controllers/post.controller.js');
const { protect } = require('../middleware/auth.middleware.js');

const postRouter = express.Router();

postRouter.route('/').get(protect, getPosts).post(protect, createPost);

postRouter.get('/user', protect, getUserPosts);

postRouter.route('/:id').get(protect, getPostById).patch(protect, updatePost).delete(protect, deletePost);

module.exports = postRouter;