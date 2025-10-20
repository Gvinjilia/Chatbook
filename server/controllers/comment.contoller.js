const Comment = require("../models/comment.model");
const catchAsync = require("../utils/catchAsync");

const getCommentByItsId = catchAsync(async (req, res) => {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    res.status(200).json(comment);
});

const getCommentByPostId = catchAsync(async (req, res) => {
    const { postId } = req.params;

    const comment = await Comment.find({ postId });

    res.status(200).json(comment);
});

const createComment = catchAsync(async (req, res) => {
    const { userId, postId, text } = req.body;

    const newComment = await Comment.create({
        userId,
        postId,
        text
    });

    res.status(201).json(newComment);
});

const deleteComment = catchAsync(async (req, res) => {
    const { id } = req.params;

    const comment = await Comment.findByIdAndDelete(id);

    if(!comment){
        return res.status(404).json({
            status: 'fail',
            message: "Comment with given id can't be found"
        })
    }

    res.status(204).send();
});

module.exports = { getCommentByItsId, getCommentByPostId, createComment, deleteComment };