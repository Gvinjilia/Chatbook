const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        }, 

        fullname: {
            type: String,
            required: [true, 'fullname is required']
        },

        profileImage: {
            type: String
        },
        
        postImage: String,

        title: {
            type: String,
            required: [true, 'title is required'],
        },

        content: {
            type: String,
            required: [true, 'content is required'],
            maxLength: [20, 'The number of charachters is more than 20']
        },

        likesCount: {
            type: Number,
            default: 0
        },

        tags: [String]
    }
);

const Post = mongoose.model("Posts", postSchema);

module.exports = Post;

// model - ი არის უკვე დასრულებული ობიექტი რომელსაც გააჩნია სხვადასხვა მეთოდები რომლითაც ჩვენ შეგვიძლია ობიექტების დამატება, წაშლა წამოღება, განახლება 
// მონაცემთა ბაზაში
// schema - არის ობიექტის (მონაცემების) სტრუქტურა