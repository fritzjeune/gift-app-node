const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    post_text : {
        type: String,
        maxlength: 250,

    },
    post_picture: String,
    post_owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'UserAccount',
        required: false //for now 
    }, 
    like_count: Number,
    users_target: [{
        type: mongoose.Schema.ObjectId,
        ref: 'UserAccount'
    }], // later will be a list of user who will have access to the post.
    shared_count: Number,
    hash_tags_category: [{
        type: String
    }]

})