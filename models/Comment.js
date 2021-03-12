const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    referredTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
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
    }]
}, {
    timestamps: true
});


module.exports.CommentSchema || mongoose.model('Comment', CommentSchema)