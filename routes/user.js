const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/auth");

const { signUpUser, updateUser, loginUser, getUser, followUser } = require("../controllers/users");
const { addGift } = require("../controllers/gifts");
const { addPost, getPosts, likePost } = require("../controllers/posts")

router
    .route('/signup')
    .post(signUpUser);
    
router
    .route('/profile/:username')
    .put(userAuth, updateUser)
    .get(userAuth, getUser)
    .post(userAuth, followUser);

router
    .route('/login')
    .post(loginUser);

router
    .route('/:username/gifts')
    .post(userAuth, addGift);







module.exports = router;