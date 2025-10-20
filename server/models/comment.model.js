const mongoose = require('mongoose');

const comments = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'Users'
    },

    postId: {
        type: mongoose.Types.ObjectId,
        ref: 'Posts'
    },

    text: {
        type: String,
        required: [true, 'The text field is required']
    }
});

const Comment = mongoose.model('Comments', comments);

module.exports = Comment;