const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/auth");

const { signUpUser, updateUser, loginUser, getUser } = require("../controllers/user_controllers");
const { addGift } = require("../controllers/gift_controller");

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
    .route('/:username/gifts')
    .post(userAuth, addGift);







module.exports = router;