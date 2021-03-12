const mongoose = require("mongoose");

const GiftSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    imageURL: String,
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["flower", "material", "home appliance", "luxury", "money", "ropa dama"],
        required: true
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    hashtags: [{
        type: String
    }],
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }], 
    shares: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    comments: {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment'
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    timestamps: true
});



module.exports = mongoose.models.GiftSchema || mongoose.model('Gift', GiftSchema);