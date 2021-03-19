const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/auth");

const { signUpUser, updateUser, loginUser, getUser, followUser } = require("../controllers/users");

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







module.exports = router;