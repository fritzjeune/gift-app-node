// const { Mongoose, Model } = require("mongoose");

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
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
        ref: 'User'
    }],
    followings: [{
        type:mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    followers_count: Number,
    following_count: Number,
    posts: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Post'
    }],
    gifts: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Gift'
    }],
    tokens: [{
        token: {
            type: String,
            required: false
        }
    }]
    
},
{
    toObject: {virtuals: true},
    toJSON: {virtuals: true},
    timestamps: true
});

UserSchema.pre('save', function(next) {
    let user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }

});

UserSchema.methods.generateToken = function() {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'supersecret');

    user.tokens = user.tokens.concat({ token });
    user.save(function(err) {
        if (err) throw err;
    });
    return token;

};




module.exports = mongoose.models.UserSchema || mongoose.model('User', UserSchema);