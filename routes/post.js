const express = require('express');
const userAuth = require('../middlewares/auth');
const { getPost, getPosts, addPost, reactToPost, editPost, deletePost } = require('../controllers/posts');
const { addComment, reactToComment } = require('../controllers/comment');

const router = express.Router();

router
    .route('/')
    .get(userAuth, getPost);

router
    .route('/:username')
    .get(userAuth, getPosts)
    .post(userAuth, addPost);

router
    .route('/:postId')
    .patch(userAuth, reactToPost)
    .put(userAuth, editPost)
    .delete(userAuth, deletePost);

router
    .route('/:postId/comments')
    .post(userAuth, addComment);

router
    .route('/:postId/comments/:commentId')
    .patch(userAuth, reactToComment)

module.exports = router;