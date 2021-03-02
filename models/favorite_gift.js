const { mongo, Mongoose } = require("mongoose")

const schema = require("mongoose").Schema()

const FavoriteGift = new schema({
    gift_name : {
        type: String,
        required: true
    },
    gift_picture: String,
    gift_description: {
        type: String,
        required: true
    },
    gift_category: {
        type: String,
        enum: ["flower", "material", "home appliance", "luxury", "money"],
        required: true
    },
    gift_hashtag: [{
        type: String
    }],
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'UserAccount'
    }], 
    shared_to: {
        type: mongoose.Schema.ObjectId,
        ref: 'UserAccount'
    }
})