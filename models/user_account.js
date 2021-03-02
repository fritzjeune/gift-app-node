// const { Mongoose, Model } = require("mongoose");

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserAccountSchema = new mongoose.Schema({
    firstname : {
        type: String,
        required: true,
        
    },
    lastname : {
        type: String,
        required: true,

    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: {
        type: String,
        required:false, //for now 
        match: [/\d{3}-\d{4}-\d{4}/, 'please give a valid phone number']
    },
    username: {
        required: true,
        type: String,
        unique: true,
        maxlength: [15, 'Username cant have more than 15 caracters']

    },
    password: {
        type: String,
        trim: true,
        required:true,
        minlength: [8, 'Password cant have less than 8 caracters']
    },
    profilPicture: {
        type: String,
    
    },
    sexe: {
        enum: ["Male", "Female"],
        type: String,
        required: false, // for now

     },
    country: {
        type: String,
        required: false  // for now
    }, 
    followers: [{
        type:mongoose.Schema.ObjectId,
        ref: 'UserAccount'
    }],
    followings: [{
        type:mongoose.Schema.ObjectId,
        ref: 'UserAccount'
    }],
    followers_count: Number,
    following_count: Number,
    posts: [],
    favorite_gift: [{
        type: mongoose.Schema.ObjectId,
        ref: 'favorite_gift'
    }],
    tokens: [{
        token: {
            type: String,
            required: false
        }
    }]
    
},
{
    timestamps: true
});

UserAccountSchema.pre('save', function(next) {
    let user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            console.log(salt);
            if (err) return next(err);

            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                console.log(hash);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }

});

UserAccountSchema.methods.generateToken = function() {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'supersecret');

    user.tokens = user.tokens.concat({ token });
    user.save(function(err) {
        if (err) throw err;
    });
    return token;

};




module.exports = mongoose.models.UserAccount || mongoose.model('UserAccount', UserAccountSchema);