const express = require('express');
const { getCommentByItsId, getCommentByPostId, createComment, deleteComment } = require('../controllers/comment.contoller');

const commentRouter = express.Router();

commentRouter.route('/').post(createComment);
commentRouter.route('/post/:postId', getCommentByPostId);
commentRouter.route('/:id').get(getCommentByItsId).delete(deleteComment);

module.exports = commentRouter;