const express = require("express");
const { addGift, getGifts, editGift, reactToGift } = require("../controllers/gifts");
const userAuth = require("../middlewares/auth");
const router = express.Router();

router
    .route('/')
    .post(userAuth, addGift)
    .get(userAuth, getGifts);

router
    .route('/:id')
    .put(userAuth, editGift)
    .patch(userAuth, reactToGift);

module.exports = router;