const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    postRef: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post', // we can use a conditionl to verify if it s a post or another comment.
        required: false//for now // this is the field that will contain info about the items that we are commenting to
    },
    CommentRef: {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment', // we can use a conditionl to verify if it s a post or another comment.
        required: false//for now // this is the field that will contain info about the items that we are commenting to
    },
    ArticleRef: {
        type: mongoose.Schema.ObjectId,
        ref: 'Article', // we can use a conditionl to verify if it s a post or another comment.
        required: false//for now // this is the field that will contain info about the items that we are commenting to
    },
    commentText: {
        required: true,
        type: String
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    likes: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Comment'
    }],
    private: {
        type : Boolean,
        default : false
    }
}, {
    timestamps: true
});


module.exports.CommentSchema || mongoose.model('Comment', CommentSchema)