const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/auth");

const { signUpUser, updateUser, loginUser, getUser, sendFriendRequest, respondFriendRequest } = require("../controllers/users");

router
    .route('/signup')
    .post(signUpUser);
    
router
    .route('/profile/:userId')
    .post(userAuth, sendFriendRequest)
    .put(userAuth, respondFriendRequest);

router
    .route('/profile')
    .get(userAuth, getUser)
    .put(userAuth, updateUser)

router
    .route('/login')
    .post(loginUser);







module.exports = router;