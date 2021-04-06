const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/auth");

const { signUpUser, updateUser, loginUser, getUser, sendFriendRequest } = require("../controllers/users");

router
    .route('/signup')
    .post(signUpUser);
    
router
    .route('/profile/:username')
    .get(userAuth, getUser)
    .post(userAuth, sendFriendRequest);

router
    .route('/profile')
    .put(userAuth, updateUser)

router
    .route('/login')
    .post(loginUser);







module.exports = router;