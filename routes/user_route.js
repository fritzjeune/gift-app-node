const express = require("express");
const router = express.Router();

const { createUser, updateUser } = require("../controllers/user_controllers")

router
    .route('/')
    .post(createUser)
    .get(createUser)
    .put(updateUser);







module.exports = router;