const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    articleName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ["Electrinics", "Home Appliance", "luxury", "Computing"]
    }, 
    mark: {
        type: String,
        required: false //for now
    },
    model: {
        type: String,
        required: false, //for now 
    },
    publisher: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    shares: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    hashTags: [{
        type: String
    }]
},{
    timestamps: true
});


module.exports.ArticleSchema || mongoose.model('Article', CommentSchema);