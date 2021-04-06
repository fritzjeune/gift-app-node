const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    postDescription : {
        type: String,
        maxlength: 250,

    },
    postURL: String,
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }, 
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    tags: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }], // list of friends account in witch post will appear 
    shares: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    hashTags: [{
        type: String
    }],
    comments: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Comment'
    }],
    visibleTo: {
        type: String,
        enum: ["noone", "friends", "friendsOfFriends", "everyone"],
        default: "friends"
    },
    visiblityException: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }]
},{
    timestamps: true
})



module.exports = mongoose.models.PostSchema || mongoose.model('Post', PostSchema);