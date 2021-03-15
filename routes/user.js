const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/auth");

const { signUpUser, updateUser, loginUser, getUser } = require("../controllers/users");
const { addGift } = require("../controllers/gifts");
const { addPost } = require("../controllers/posts")

router
    .route('/signup')
    .post(signUpUser);
    // .get(getUser);
    
router
    .route('/profile/:username')
    .put(userAuth, updateUser)
    .get(userAuth, getUser);

router
    .route('/login')
    .post(loginUser);

router
    .route('/:username/posts')
    .post(userAuth, addPost)

router
    .route('/:username/gifts')
    .post(userAuth, addGift);







module.exports = router;