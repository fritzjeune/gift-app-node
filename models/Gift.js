const mongoose = require("mongoose");

const GiftSchema = new mongoose.Schema({
    name: {
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
        enum: ["Surprise", "Material", "Home appliance", "Luxury", "Money", "Ropa dama", "Cars", "House", "Herramientas"],
        required: true
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    hashTags: [{
        type: String
    }],
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }], 
    shares: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Comment'
    }],
    status: {
        type: String,
        default: "desired"
    },
    visibleBy: {
        type: String,
        enum:["followers", "everybody", "me"],
        default: "followers"
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    timestamps: true
});



module.exports = mongoose.models.GiftSchema || mongoose.model('Gift', GiftSchema);