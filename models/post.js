const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    post_text : {
        type: String,
        maxlength: 250,

    },
    post_owner: String, //for now , later will cast to an objectId of a user. it's publisher.
    like_count: Number,
    users_targert: String, // later will be a list of user who will have access to the post.
    shared_count: Number,
    hash_tags_category: [{
        
    }]

})