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
        required: false //for now 
    }, 
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    tags: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }], // later will be a list of user who will have access to the post.
    shares: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    hashTags: [{
        type: String
    }],
    comments: {
        type: mongoose.Schema.ObjectId,
        ref: 'Comments'
    }

},{
    timestamps: true
})



module.exports = mongoose.models.PostSchema || mongoose.model('Post', PostSchema);