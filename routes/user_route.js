const express = require("express");
const router = express.Router();

const { signUpUser, updateUser, loginUser } = require("../controllers/user_controllers")

router
    .route('/signup')
    .post(signUpUser)
    // .get(getUser)
    .put(updateUser);

router
    .route('/login')
    .post(loginUser);







module.exports = router;