const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/auth");

const { signUpUser, updateUser, loginUser, getUser } = require("../controllers/users");
const { addGift } = require("../controllers/gifts");
const { addPost, getPosts, likePost } = require("../controllers/posts")

router
    .route('/signup')
    .post(signUpUser);

router
    .route('/:username/posts')
    .post(userAuth, addPost)
    .get(userAuth, getPosts);

router
    .route('/:username/posts/:postId')
    .put(userAuth, likePost);
    
router
    .route('/profile/:username')
    .put(userAuth, updateUser)
    .get(userAuth, getUser);

router
    .route('/login')
    .post(loginUser);

router
    .route('/:username/gifts')
    .post(userAuth, addGift);







module.exports = router;