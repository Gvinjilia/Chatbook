const express = require('express');
const { deletePost, updatePost, createPost, getPostById, getPosts, getUserPosts } = require('../controllers/post.controller.js');
const { protect } = require('../middleware/auth.middleware.js');
const upload = require('../config/uploadImg.js');

const postRouter = express.Router();

postRouter.route('/').get(protect, getPosts).post(protect, upload.single('postImg'), createPost);

postRouter.get('/user', protect, getUserPosts);

postRouter.route('/:id').get(protect, getPostById).patch(protect, updatePost).delete(protect, deletePost);

// postRouter.post('/upload/image', protect, upload.single('postImg'), (req, res) => {
//     console.log(req.file)
//     res.send('Image uploaded!')
// });

module.exports = postRouter;